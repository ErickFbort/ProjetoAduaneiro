from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
from config import config

app = Flask(__name__)

# Configuração baseada no ambiente
config_name = os.environ.get('FLASK_ENV', 'development')
app.config.from_object(config[config_name])

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Modelos do banco de dados
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    status = db.Column(db.String(20), default='active')
    group = db.Column(db.String(50), nullable=False)  # Paclog Faturamento, Paclog ADM, Paclog Operacional
    permissions = db.Column(db.Text)  # JSON string das permissões
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Rotas
@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password) and user.status == 'active':
            login_user(user)
            return redirect(url_for('dashboard'))
        else:
            flash('Usuário ou senha inválidos!', 'error')
    
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Você foi desconectado com sucesso!', 'info')
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user=current_user)

@app.route('/cadastros')
@login_required
def cadastros():
    try:
        # Versão simplificada sem paginação
        users = User.query.all()
        search = request.args.get('search', '', type=str)
        
        # Filtrar usuários se houver busca
        if search:
            filtered_users = []
            for user in users:
                if (search.lower() in user.name.lower() or 
                    search.lower() in user.lastname.lower() or 
                    search.lower() in user.email.lower() or 
                    search.lower() in user.cpf.lower()):
                    filtered_users.append(user)
            users = filtered_users
        
        # Criar objeto mock para paginação
        class MockPaginate:
            def __init__(self, items):
                self.items = items
                self.total = len(items)
                self.pages = 1
                self.page = 1
                self.has_prev = False
                self.has_next = False
                self.prev_num = None
                self.next_num = None
                self.iter_pages = lambda: [1]
        
        paginated_users = MockPaginate(users)
        
        return render_template('cadastros.html', users=paginated_users, search=search)
    except Exception as e:
        print(f"Erro na rota cadastros: {e}")
        # Fallback: retornar template de debug
        return render_template('cadastros_debug.html', users=[], search='')

@app.route('/cadastros-debug')
@login_required
def cadastros_debug():
    """Rota de debug para cadastros"""
    try:
        users = User.query.all()
        return render_template('cadastros_debug.html', users=users, search='')
    except Exception as e:
        print(f"Erro na rota debug: {e}")
        return f"Erro: {e}"

@app.route('/api/users', methods=['GET', 'POST'])
@login_required
def api_users():
    if request.method == 'POST':
        data = request.get_json()
        
        # Verificar se email já existe
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email já cadastrado'}), 400
        
        # Verificar se CPF já existe
        if User.query.filter_by(cpf=data['cpf']).first():
            return jsonify({'error': 'CPF já cadastrado'}), 400
        
        user = User(
            name=data['name'],
            lastname=data['lastname'],
            cpf=data['cpf'],
            email=data['email'],
            status=data.get('status', 'active'),
            group=data['group'],
            permissions=data.get('permissions', '[]')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'Usuário criado com sucesso'}), 201
    
    elif request.method == 'GET':
        users = User.query.all()
        return jsonify([{
            'id': user.id,
            'name': user.name,
            'lastname': user.lastname,
            'cpf': user.cpf,
            'email': user.email,
            'status': user.status,
            'group': user.group,
            'permissions': user.permissions
        } for user in users])

@app.route('/api/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def api_user_detail(user_id):
    user = User.query.get_or_404(user_id)
    
    if request.method == 'GET':
        return jsonify({
            'id': user.id,
            'name': user.name,
            'lastname': user.lastname,
            'cpf': user.cpf,
            'email': user.email,
            'status': user.status,
            'group': user.group,
            'permissions': user.permissions
        })
    
    if request.method == 'PUT':
        data = request.get_json()
        user.name = data['name']
        user.lastname = data['lastname']
        user.cpf = data['cpf']
        user.email = data['email']
        user.status = data['status']
        user.group = data['group']
        user.permissions = data.get('permissions', '[]')
        
        if 'password' in data and data['password']:
            user.set_password(data['password'])
        
        db.session.commit()
        return jsonify({'message': 'Usuário atualizado com sucesso'})
    
    elif request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'Usuário removido com sucesso'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Criar usuário admin padrão se não existir
        if not User.query.filter_by(email='admin@teste.com').first():
            admin = User(
                name='ADM',
                lastname='Sistema',
                cpf='000.000.000-00',
                email='admin@teste.com',
                status='active',
                group='Paclog ADM',
                permissions='["all"]'
            )
            admin.set_password('1234')
            db.session.add(admin)
            db.session.commit()
    
    app.run(debug=True)
