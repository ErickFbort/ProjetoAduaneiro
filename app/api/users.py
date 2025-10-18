"""
Namespace de usuários da API
"""
from flask_restx import Namespace, Resource, fields, reqparse
from flask import request, jsonify
from flask_login import current_user, login_required
from werkzeug.security import generate_password_hash
from app.models.user import User
from app import db
from app.api.models import (
    user_model, user_create_model, user_update_model, 
    success_response, error_response, paginated_response
)

users_ns = Namespace('users', description='Operações de usuários')

# Parser para parâmetros de query
parser = reqparse.RequestParser()
parser.add_argument('page', type=int, default=1, help='Número da página')
parser.add_argument('per_page', type=int, default=10, help='Itens por página')
parser.add_argument('search', type=str, help='Termo de busca')
parser.add_argument('group', type=str, help='Filtrar por grupo')
parser.add_argument('status', type=str, help='Filtrar por status')
parser.add_argument('sort', type=str, default='id', help='Campo para ordenação')
parser.add_argument('order', type=str, default='asc', help='Ordem da classificação')

@users_ns.route('/')
class UserList(Resource):
    @users_ns.expect(parser)
    @users_ns.marshal_with(paginated_response)
    @users_ns.doc('list_users',
                  description='Listar usuários com paginação e filtros',
                  responses={
                      200: 'Lista de usuários obtida com sucesso',
                      401: 'Usuário não autenticado',
                      500: 'Erro interno do servidor'
                  })
    def get(self):
        """
        Listar usuários
        
        Este endpoint retorna uma lista paginada de usuários com opções de
        filtro e busca.
        
        **Parâmetros de query:**
        - `page` (int): Número da página (padrão: 1)
        - `per_page` (int): Itens por página (padrão: 10)
        - `search` (string): Termo de busca (nome ou email)
        - `group` (string): Filtrar por grupo (admin, user, operator)
        - `status` (string): Filtrar por status (active, blocked)
        - `sort` (string): Campo para ordenação (padrão: id)
        - `order` (string): Ordem da classificação (asc, desc)
        
        **Exemplo de uso:**
        ```bash
        curl -X GET "http://localhost:5000/api/users/?page=1&per_page=5&search=admin&group=admin"
        ```
        
        **Resposta de sucesso:**
        ```json
        {
          "success": true,
          "data": [
            {
              "id": 1,
              "name": "Administrador",
              "email": "admin@teste.com",
              "group": "admin",
              "status": "active"
            }
          ],
          "pagination": {
            "page": 1,
            "per_page": 5,
            "total": 1,
            "pages": 1,
            "has_prev": false,
            "has_next": false
          }
        }
        ```
        """
        try:
            if not current_user.is_authenticated:
                return {
                    'success': False,
                    'message': 'Usuário não autenticado'
                }, 401
            
            args = parser.parse_args()
            page = args['page']
            per_page = min(args['per_page'], 100)  # Limitar a 100 itens por página
            
            # Construir query
            query = User.query
            
            # Aplicar filtros
            if args['search']:
                search_term = f"%{args['search']}%"
                query = query.filter(
                    (User.name.ilike(search_term)) | 
                    (User.email.ilike(search_term))
                )
            
            if args['group']:
                query = query.filter(User.group == args['group'])
            
            if args['status']:
                query = query.filter(User.status == args['status'])
            
            # Aplicar ordenação
            sort_field = getattr(User, args['sort'], User.id)
            if args['order'] == 'desc':
                query = query.order_by(sort_field.desc())
            else:
                query = query.order_by(sort_field.asc())
            
            # Paginação
            pagination = query.paginate(
                page=page,
                per_page=per_page,
                error_out=False
            )
            
            users = []
            for user in pagination.items:
                users.append({
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'group': user.group,
                    'status': user.status,
                    'created_at': user.created_at.isoformat() if user.created_at else None,
                    'last_login': user.last_login.isoformat() if user.last_login else None
                })
            
            return {
                'success': True,
                'data': users,
                'pagination': {
                    'page': pagination.page,
                    'per_page': pagination.per_page,
                    'total': pagination.total,
                    'pages': pagination.pages,
                    'has_prev': pagination.has_prev,
                    'has_next': pagination.has_next
                }
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': 'Erro ao listar usuários',
                'error': str(e)
            }, 500

    @users_ns.expect(user_create_model, validate=True)
    @users_ns.marshal_with(user_model)
    @users_ns.doc('create_user',
                  description='Criar novo usuário',
                  responses={
                      201: 'Usuário criado com sucesso',
                      400: 'Dados inválidos',
                      401: 'Usuário não autenticado',
                      403: 'Acesso negado',
                      500: 'Erro interno do servidor'
                  })
    def post(self):
        """
        Criar novo usuário
        
        Este endpoint permite criar um novo usuário no sistema.
        
        **Exemplo de uso:**
        ```bash
        curl -X POST "http://localhost:5000/api/users/" \
             -H "Content-Type: application/json" \
             -d '{
               "name": "Novo Usuário",
               "email": "novo@teste.com",
               "password": "senha123",
               "group": "user",
               "status": "active"
             }'
        ```
        
        **Resposta de sucesso:**
        ```json
        {
          "id": 16,
          "name": "Novo Usuário",
          "email": "novo@teste.com",
          "group": "user",
          "status": "active",
          "created_at": "2024-01-15T10:30:00Z"
        }
        ```
        """
        try:
            if not current_user.is_authenticated:
                return {
                    'success': False,
                    'message': 'Usuário não autenticado'
                }, 401
            
            # Verificar permissões (apenas admin pode criar usuários)
            if current_user.group != 'admin':
                return {
                    'success': False,
                    'message': 'Acesso negado. Apenas administradores podem criar usuários.'
                }, 403
            
            data = request.get_json()
            
            # Verificar se email já existe
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user:
                return {
                    'success': False,
                    'message': 'Email já cadastrado'
                }, 400
            
            # Criar usuário
            user = User(
                name=data['name'],
                email=data['email'],
                password=generate_password_hash(data['password']),
                group=data['group'],
                status=data.get('status', 'active')
            )
            
            db.session.add(user)
            db.session.commit()
            
            return {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'group': user.group,
                'status': user.status,
                'created_at': user.created_at.isoformat() if user.created_at else None,
                'last_login': user.last_login.isoformat() if user.last_login else None
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'message': 'Erro ao criar usuário',
                'error': str(e)
            }, 500

@users_ns.route('/<int:user_id>')
class UserDetail(Resource):
    @users_ns.marshal_with(user_model)
    @users_ns.doc('get_user',
                  description='Obter dados de um usuário específico',
                  responses={
                      200: 'Dados do usuário obtidos com sucesso',
                      401: 'Usuário não autenticado',
                      404: 'Usuário não encontrado',
                      500: 'Erro interno do servidor'
                  })
    def get(self, user_id):
        """
        Obter dados de um usuário específico
        
        Este endpoint retorna os dados de um usuário específico pelo ID.
        
        **Exemplo de uso:**
        ```bash
        curl -X GET "http://localhost:5000/api/users/1"
        ```
        
        **Resposta de sucesso:**
        ```json
        {
          "id": 1,
          "name": "Administrador",
          "email": "admin@teste.com",
          "group": "admin",
          "status": "active",
          "created_at": "2024-01-01T00:00:00Z",
          "last_login": "2024-01-15T10:30:00Z"
        }
        ```
        """
        try:
            if not current_user.is_authenticated:
                return {
                    'success': False,
                    'message': 'Usuário não autenticado'
                }, 401
            
            user = User.query.get_or_404(user_id)
            
            return {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'group': user.group,
                'status': user.status,
                'created_at': user.created_at.isoformat() if user.created_at else None,
                'last_login': user.last_login.isoformat() if user.last_login else None
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': 'Erro ao obter usuário',
                'error': str(e)
            }, 500

    @users_ns.expect(user_update_model, validate=True)
    @users_ns.marshal_with(user_model)
    @users_ns.doc('update_user',
                  description='Atualizar dados de um usuário',
                  responses={
                      200: 'Usuário atualizado com sucesso',
                      400: 'Dados inválidos',
                      401: 'Usuário não autenticado',
                      403: 'Acesso negado',
                      404: 'Usuário não encontrado',
                      500: 'Erro interno do servidor'
                  })
    def put(self, user_id):
        """
        Atualizar dados de um usuário
        
        Este endpoint permite atualizar os dados de um usuário existente.
        
        **Exemplo de uso:**
        ```bash
        curl -X PUT "http://localhost:5000/api/users/1" \
             -H "Content-Type: application/json" \
             -d '{
               "name": "Nome Atualizado",
               "group": "admin",
               "status": "active"
             }'
        ```
        """
        try:
            if not current_user.is_authenticated:
                return {
                    'success': False,
                    'message': 'Usuário não autenticado'
                }, 401
            
            # Verificar permissões
            if current_user.group != 'admin' and current_user.id != user_id:
                return {
                    'success': False,
                    'message': 'Acesso negado. Você só pode editar seus próprios dados.'
                }, 403
            
            user = User.query.get_or_404(user_id)
            data = request.get_json()
            
            # Atualizar campos fornecidos
            if 'name' in data:
                user.name = data['name']
            if 'email' in data:
                # Verificar se email já existe
                existing_user = User.query.filter_by(email=data['email']).first()
                if existing_user and existing_user.id != user_id:
                    return {
                        'success': False,
                        'message': 'Email já cadastrado'
                    }, 400
                user.email = data['email']
            if 'group' in data and current_user.group == 'admin':
                user.group = data['group']
            if 'status' in data and current_user.group == 'admin':
                user.status = data['status']
            
            db.session.commit()
            
            return {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'group': user.group,
                'status': user.status,
                'created_at': user.created_at.isoformat() if user.created_at else None,
                'last_login': user.last_login.isoformat() if user.last_login else None
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'message': 'Erro ao atualizar usuário',
                'error': str(e)
            }, 500

    @users_ns.marshal_with(success_response)
    @users_ns.doc('delete_user',
                  description='Excluir um usuário',
                  responses={
                      200: 'Usuário excluído com sucesso',
                      401: 'Usuário não autenticado',
                      403: 'Acesso negado',
                      404: 'Usuário não encontrado',
                      500: 'Erro interno do servidor'
                  })
    def delete(self, user_id):
        """
        Excluir um usuário
        
        Este endpoint permite excluir um usuário do sistema.
        
        **Exemplo de uso:**
        ```bash
        curl -X DELETE "http://localhost:5000/api/users/1"
        ```
        """
        try:
            if not current_user.is_authenticated:
                return {
                    'success': False,
                    'message': 'Usuário não autenticado'
                }, 401
            
            # Verificar permissões
            if current_user.group != 'admin':
                return {
                    'success': False,
                    'message': 'Acesso negado. Apenas administradores podem excluir usuários.'
                }, 403
            
            # Não permitir excluir a si mesmo
            if current_user.id == user_id:
                return {
                    'success': False,
                    'message': 'Você não pode excluir sua própria conta.'
                }, 400
            
            user = User.query.get_or_404(user_id)
            
            db.session.delete(user)
            db.session.commit()
        
            return {
                'success': True,
                'message': 'Usuário excluído com sucesso'
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'message': 'Erro ao excluir usuário',
                'error': str(e)
            }, 500