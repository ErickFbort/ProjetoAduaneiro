"""
Rotas de cadastros
"""

from flask import Blueprint, render_template, request
from flask_login import login_required
from app.models.user import User
from app.models.veiculo import Veiculo
from app.models.entidade import Entidade

cadastros_bp = Blueprint('cadastros', __name__)

def create_mock_paginate(items):
    """Cria objeto mock para paginação"""
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
    
    return MockPaginate(items)

@cadastros_bp.route('/cadastros')
@login_required
def cadastros():
    """Página principal de cadastros com sub-menus"""
    return render_template('cadastros_main.html')

@cadastros_bp.route('/cadastros/usuarios')
@login_required
def cadastros_usuarios():
    """Página de cadastros de usuários"""
    try:
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
        
        paginated_users = create_mock_paginate(users)
        return render_template('cadastros_usuarios.html', users=paginated_users, search=search)
    except Exception as e:
        print(f"Erro na rota cadastros usuarios: {e}")
        return render_template('cadastros_usuarios.html', users=[], search='')

@cadastros_bp.route('/cadastros/veiculos')
@login_required
def cadastros_veiculos():
    """Página de cadastros de veículos"""
    try:
        veiculos = Veiculo.query.all()
        search = request.args.get('search', '', type=str)
        
        # Filtrar veículos se houver busca
        if search:
            filtered_veiculos = []
            for veiculo in veiculos:
                if (search.lower() in veiculo.motorista_responsavel.lower() or 
                    search.lower() in veiculo.cpf_motorista.lower() or 
                    search.lower() in veiculo.placa.lower() or 
                    search.lower() in veiculo.renavam.lower() if veiculo.renavam else False):
                    filtered_veiculos.append(veiculo)
            veiculos = filtered_veiculos
        
        paginated_veiculos = create_mock_paginate(veiculos)
        return render_template('cadastros_veiculos.html', veiculos=paginated_veiculos, search=search)
    except Exception as e:
        print(f"Erro na rota cadastros veiculos: {e}")
        return render_template('cadastros_veiculos.html', veiculos=[], search='')

@cadastros_bp.route('/cadastros/entidades')
@login_required
def cadastros_entidades():
    """Página de cadastros de entidades"""
    try:
        entidades = Entidade.query.all()
        search = request.args.get('search', '', type=str)
        
        # Filtrar entidades se houver busca
        if search:
            filtered_entidades = []
            for entidade in entidades:
                if (search.lower() in entidade.razao_social.lower() or 
                    search.lower() in entidade.nome_fantasia.lower() or 
                    search.lower() in entidade.cpf_cnpj.lower() or 
                    search.lower() in entidade.email_faturamento.lower()):
                    filtered_entidades.append(entidade)
            entidades = filtered_entidades
        
        paginated_entidades = create_mock_paginate(entidades)
        return render_template('cadastros_entidades.html', entidades=paginated_entidades, search=search)
    except Exception as e:
        print(f"Erro na rota cadastros entidades: {e}")
        return render_template('cadastros_entidades.html', entidades=[], search='')
