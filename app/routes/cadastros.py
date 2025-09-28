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
            # Garantir que items seja sempre uma lista
            self.items = items if isinstance(items, list) else []
            self.total = len(self.items)
            self.pages = 1 if self.items else 0
            self.page = 1
            self.has_prev = False
            self.has_next = False
            self.prev_num = None
            self.next_num = None
            self.iter_pages = lambda: [1] if self.items else []
    
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
        # Obter parâmetros de filtro
        search = request.args.get('search', '', type=str)
        grupo_filter = request.args.get('grupo', '', type=str)
        status_filter = request.args.get('status', '', type=str)
        
        # Construir query base
        query = User.query
        
        # Aplicar filtro de busca
        if search:
            search_term = f"%{search.lower()}%"
            query = query.filter(
                db.or_(
                    User.name.ilike(search_term),
                    User.lastname.ilike(search_term),
                    User.email.ilike(search_term),
                    User.cpf.ilike(search_term)
                )
            )
        
        # Aplicar filtro de grupo
        if grupo_filter:
            query = query.filter(User.group == grupo_filter)
        
        # Aplicar filtro de status
        if status_filter:
            query = query.filter(User.status == status_filter)
        
        # Executar query
        users = query.all()
        
        # Criar paginação
        paginated_users = create_mock_paginate(users)
        
        return render_template('cadastros_usuarios.html', 
                             users=paginated_users, 
                             search=search,
                             grupo_filter=grupo_filter,
                             status_filter=status_filter)
    except Exception as e:
        print(f"Erro na rota cadastros usuarios: {e}")
        # Criar objeto de paginação vazio em caso de erro
        empty_pagination = create_mock_paginate([])
        return render_template('cadastros_usuarios.html', 
                             users=empty_pagination, 
                             search='',
                             grupo_filter='',
                             status_filter='')

@cadastros_bp.route('/cadastros/veiculos')
@login_required
def cadastros_veiculos():
    """Página de cadastros de veículos"""
    try:
        # Obter parâmetros de filtro
        search = request.args.get('search', '', type=str)
        tipo_filter = request.args.get('tipo', '', type=str)
        estado_filter = request.args.get('estado', '', type=str)
        status_filter = request.args.get('status', '', type=str)
        
        # Construir query base
        query = Veiculo.query
        
        # Aplicar filtro de busca
        if search:
            search_term = f"%{search.lower()}%"
            query = query.filter(
                db.or_(
                    Veiculo.motorista_responsavel.ilike(search_term),
                    Veiculo.cpf_motorista.ilike(search_term),
                    Veiculo.placa.ilike(search_term),
                    Veiculo.renavam.ilike(search_term)
                )
            )
        
        # Aplicar filtro de tipo
        if tipo_filter:
            if tipo_filter == 'Outros':
                query = query.filter(Veiculo.tipo == 'Outros')
            else:
                query = query.filter(Veiculo.tipo == tipo_filter)
        
        # Aplicar filtro de estado
        if estado_filter:
            query = query.filter(Veiculo.estado == estado_filter)
        
        # Aplicar filtro de status
        if status_filter:
            query = query.filter(Veiculo.status == status_filter)
        
        # Executar query
        veiculos = query.all()
        
        # Criar paginação
        paginated_veiculos = create_mock_paginate(veiculos)
        
        return render_template('cadastros_veiculos.html', 
                             veiculos=paginated_veiculos, 
                             search=search,
                             tipo_filter=tipo_filter,
                             estado_filter=estado_filter,
                             status_filter=status_filter)
    except Exception as e:
        print(f"Erro na rota cadastros veiculos: {e}")
        # Criar objeto de paginação vazio em caso de erro
        empty_pagination = create_mock_paginate([])
        return render_template('cadastros_veiculos.html', 
                             veiculos=empty_pagination, 
                             search='',
                             tipo_filter='',
                             estado_filter='',
                             status_filter='')

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
