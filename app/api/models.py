"""
Modelos de dados para documentação da API
"""
from flask_restx import fields, Model

# Modelos de resposta
success_response = Model('SuccessResponse', {
    'success': fields.Boolean(required=True, description='Indica se a operação foi bem-sucedida'),
    'message': fields.String(description='Mensagem descritiva da operação'),
    'data': fields.Raw(description='Dados retornados pela operação')
})

error_response = Model('ErrorResponse', {
    'success': fields.Boolean(required=True, description='Sempre false para erros'),
    'error': fields.String(required=True, description='Mensagem de erro'),
    'code': fields.Integer(description='Código de erro HTTP'),
    'details': fields.Raw(description='Detalhes adicionais do erro')
})

# Modelos de usuário
user_model = Model('User', {
    'id': fields.Integer(required=True, description='ID único do usuário'),
    'name': fields.String(required=True, description='Nome completo do usuário'),
    'email': fields.String(required=True, description='Email do usuário'),
    'group': fields.String(required=True, description='Grupo do usuário (admin, user, operator)'),
    'status': fields.String(required=True, description='Status do usuário (active, blocked)'),
    'created_at': fields.DateTime(description='Data de criação'),
    'last_login': fields.DateTime(description='Último login')
})

user_create_model = Model('UserCreate', {
    'name': fields.String(required=True, description='Nome completo do usuário'),
    'email': fields.String(required=True, description='Email do usuário'),
    'password': fields.String(required=True, description='Senha do usuário'),
    'group': fields.String(required=True, description='Grupo do usuário', enum=['admin', 'user', 'operator']),
    'status': fields.String(description='Status do usuário', enum=['active', 'blocked'], default='active')
})

user_update_model = Model('UserUpdate', {
    'name': fields.String(description='Nome completo do usuário'),
    'email': fields.String(description='Email do usuário'),
    'group': fields.String(description='Grupo do usuário', enum=['admin', 'user', 'operator']),
    'status': fields.String(description='Status do usuário', enum=['active', 'blocked'])
})

# Modelos de veículo
vehicle_model = Model('Vehicle', {
    'id': fields.Integer(required=True, description='ID único do veículo'),
    'placa': fields.String(required=True, description='Placa do veículo'),
    'modelo': fields.String(required=True, description='Modelo do veículo'),
    'cor': fields.String(required=True, description='Cor do veículo'),
    'ano': fields.Integer(required=True, description='Ano do veículo'),
    'status': fields.String(required=True, description='Status do veículo (ativo, inativo)'),
    'created_at': fields.DateTime(description='Data de criação')
})

vehicle_create_model = Model('VehicleCreate', {
    'placa': fields.String(required=True, description='Placa do veículo'),
    'modelo': fields.String(required=True, description='Modelo do veículo'),
    'cor': fields.String(required=True, description='Cor do veículo'),
    'ano': fields.Integer(required=True, description='Ano do veículo'),
    'status': fields.String(description='Status do veículo', enum=['ativo', 'inativo'], default='ativo')
})

vehicle_update_model = Model('VehicleUpdate', {
    'placa': fields.String(description='Placa do veículo'),
    'modelo': fields.String(description='Modelo do veículo'),
    'cor': fields.String(description='Cor do veículo'),
    'ano': fields.Integer(description='Ano do veículo'),
    'status': fields.String(description='Status do veículo', enum=['ativo', 'inativo'])
})

# Modelos de entidade
entity_model = Model('Entity', {
    'id': fields.Integer(required=True, description='ID único da entidade'),
    'nome': fields.String(required=True, description='Nome da entidade'),
    'cnpj': fields.String(required=True, description='CNPJ da entidade'),
    'endereco': fields.String(required=True, description='Endereço da entidade'),
    'telefone': fields.String(required=True, description='Telefone da entidade'),
    'email': fields.String(required=True, description='Email da entidade'),
    'status': fields.String(required=True, description='Status da entidade (ativo, inativo)'),
    'created_at': fields.DateTime(description='Data de criação')
})

entity_create_model = Model('EntityCreate', {
    'nome': fields.String(required=True, description='Nome da entidade'),
    'cnpj': fields.String(required=True, description='CNPJ da entidade'),
    'endereco': fields.String(required=True, description='Endereço da entidade'),
    'telefone': fields.String(required=True, description='Telefone da entidade'),
    'email': fields.String(required=True, description='Email da entidade'),
    'status': fields.String(description='Status da entidade', enum=['ativo', 'inativo'], default='ativo')
})

entity_update_model = Model('EntityUpdate', {
    'nome': fields.String(description='Nome da entidade'),
    'cnpj': fields.String(description='CNPJ da entidade'),
    'endereco': fields.String(description='Endereço da entidade'),
    'telefone': fields.String(description='Telefone da entidade'),
    'email': fields.String(description='Email da entidade'),
    'status': fields.String(description='Status da entidade', enum=['ativo', 'inativo'])
})

# Modelos de estatísticas
stats_model = Model('Statistics', {
    'users': fields.Integer(required=True, description='Número total de usuários'),
    'vehicles': fields.Integer(required=True, description='Número total de veículos'),
    'entities': fields.Integer(required=True, description='Número total de entidades'),
    'processes': fields.Integer(required=True, description='Número total de processos')
})

detailed_stats_model = Model('DetailedStatistics', {
    'users': fields.Raw(description='Estatísticas de usuários'),
    'vehicles': fields.Raw(description='Estatísticas de veículos'),
    'entities': fields.Raw(description='Estatísticas de entidades'),
    'processes': fields.Integer(required=True, description='Número total de processos')
})

# Modelos de autenticação
login_model = Model('Login', {
    'email': fields.String(required=True, description='Email do usuário'),
    'password': fields.String(required=True, description='Senha do usuário')
})

login_response_model = Model('LoginResponse', {
    'success': fields.Boolean(required=True, description='Indica se o login foi bem-sucedido'),
    'message': fields.String(description='Mensagem de resposta'),
    'user': fields.Raw(description='Dados do usuário logado'),
    'token': fields.String(description='Token de autenticação (se aplicável)')
})

# Modelos do LinkedIn
linkedin_post_model = Model('LinkedInPost', {
    'id': fields.String(required=True, description='ID do post'),
    'title': fields.String(required=True, description='Título do post'),
    'content': fields.String(required=True, description='Conteúdo do post'),
    'author': fields.String(required=True, description='Autor do post'),
    'published_at': fields.DateTime(required=True, description='Data de publicação'),
    'url': fields.String(description='URL do post'),
    'image_url': fields.String(description='URL da imagem do post'),
    'likes': fields.Integer(description='Número de curtidas'),
    'comments': fields.Integer(description='Número de comentários'),
    'shares': fields.Integer(description='Número de compartilhamentos')
})

linkedin_company_model = Model('LinkedInCompany', {
    'name': fields.String(required=True, description='Nome da empresa'),
    'description': fields.String(description='Descrição da empresa'),
    'website': fields.String(description='Website da empresa'),
    'industry': fields.String(description='Setor da empresa'),
    'company_size': fields.String(description='Tamanho da empresa'),
    'headquarters': fields.String(description='Sede da empresa'),
    'founded': fields.Integer(description='Ano de fundação'),
    'logo_url': fields.String(description='URL do logo da empresa'),
    'followers': fields.Integer(description='Número de seguidores')
})

# Modelos de paginação
pagination_model = Model('Pagination', {
    'page': fields.Integer(required=True, description='Página atual'),
    'per_page': fields.Integer(required=True, description='Itens por página'),
    'total': fields.Integer(required=True, description='Total de itens'),
    'pages': fields.Integer(required=True, description='Total de páginas'),
    'has_prev': fields.Boolean(required=True, description='Tem página anterior'),
    'has_next': fields.Boolean(required=True, description='Tem próxima página')
})

paginated_response = Model('PaginatedResponse', {
    'success': fields.Boolean(required=True, description='Indica se a operação foi bem-sucedida'),
    'data': fields.List(fields.Raw, description='Lista de dados'),
    'pagination': fields.Raw(description='Informações de paginação')
})

# Modelos de validação
validation_error_model = Model('ValidationError', {
    'field': fields.String(required=True, description='Campo com erro'),
    'message': fields.String(required=True, description='Mensagem de erro'),
    'value': fields.Raw(description='Valor que causou o erro')
})

# Modelos de filtros
filter_model = Model('Filter', {
    'field': fields.String(required=True, description='Campo para filtrar'),
    'operator': fields.String(required=True, description='Operador de filtro', enum=['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'in', 'not_in']),
    'value': fields.Raw(required=True, description='Valor para filtrar')
})

search_model = Model('Search', {
    'query': fields.String(description='Termo de busca'),
    'filters': fields.List(fields.Nested(filter_model), description='Filtros aplicados'),
    'sort': fields.String(description='Campo para ordenação'),
    'order': fields.String(description='Ordem da classificação', enum=['asc', 'desc'], default='asc'),
    'page': fields.Integer(description='Página', default=1),
    'per_page': fields.Integer(description='Itens por página', default=10)
})
