"""
Namespace de entidades da API
"""
from flask_restx import Namespace, Resource, fields, reqparse
from flask import request, jsonify
from flask_login import current_user, login_required
from app.models.entidade import Entidade
from app import db
from app.api.models import (
    entity_model, entity_create_model, entity_update_model,
    success_response, error_response, paginated_response
)

entities_ns = Namespace('entities', description='Operações de entidades')

# Parser para parâmetros de query
parser = reqparse.RequestParser()
parser.add_argument('page', type=int, default=1, help='Número da página')
parser.add_argument('per_page', type=int, default=10, help='Itens por página')
parser.add_argument('search', type=str, help='Termo de busca (nome ou CNPJ)')
parser.add_argument('status', type=str, help='Filtrar por status (ativo, inativo)')
parser.add_argument('sort', type=str, default='id', help='Campo para ordenação')
parser.add_argument('order', type=str, default='asc', help='Ordem da classificação')

@entities_ns.route('/')
class EntityList(Resource):
    @entities_ns.expect(parser)
    @entities_ns.marshal_with(paginated_response)
    @entities_ns.doc('list_entities',
                     description='Listar entidades com paginação e filtros',
                     responses={
                         200: 'Lista de entidades obtida com sucesso',
                         401: 'Usuário não autenticado',
                         500: 'Erro interno do servidor'
                     })
    def get(self):
        """
        Listar entidades
        
        Este endpoint retorna uma lista paginada de entidades com opções de
        filtro e busca.
        
        **Parâmetros de query:**
        - `page` (int): Número da página (padrão: 1)
        - `per_page` (int): Itens por página (padrão: 10)
        - `search` (string): Termo de busca (nome ou CNPJ)
        - `status` (string): Filtrar por status (ativo, inativo)
        - `sort` (string): Campo para ordenação (padrão: id)
        - `order` (string): Ordem da classificação (asc, desc)
        
        **Exemplo de uso:**
        ```bash
        curl -X GET "http://localhost:5000/api/entities/?page=1&per_page=5&search=empresa&status=ativo"
        ```
        
        **Resposta de sucesso:**
        ```json
        {
          "success": true,
          "data": [
            {
              "id": 1,
              "nome": "Empresa Teste",
              "cnpj": "12.345.678/0001-90",
              "endereco": "Rua Teste, 123",
              "telefone": "(11) 99999-9999",
              "email": "contato@empresa.com",
              "status": "ativo",
              "created_at": "2024-01-01T00:00:00Z"
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
            query = Entidade.query
            
            # Aplicar filtros
            if args['search']:
                search_term = f"%{args['search']}%"
                query = query.filter(
                    (Entidade.nome.ilike(search_term)) | 
                    (Entidade.cnpj.ilike(search_term))
                )
            
            if args['status']:
                query = query.filter(Entidade.status == args['status'])
            
            # Aplicar ordenação
            sort_field = getattr(Entidade, args['sort'], Entidade.id)
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
            
            entities = []
            for entity in pagination.items:
                entities.append({
                    'id': entity.id,
                    'nome': entity.nome,
                    'cnpj': entity.cnpj,
                    'endereco': entity.endereco,
                    'telefone': entity.telefone,
                    'email': entity.email,
                    'status': entity.status,
                    'created_at': entity.created_at.isoformat() if entity.created_at else None
                })
            
            return {
                'success': True,
                'data': entities,
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
                'message': 'Erro ao listar entidades',
                'error': str(e)
            }, 500

    @entities_ns.expect(entity_create_model, validate=True)
    @entities_ns.marshal_with(entity_model)
    @entities_ns.doc('create_entity',
                     description='Criar nova entidade',
                     responses={
                         201: 'Entidade criada com sucesso',
                         400: 'Dados inválidos',
                         401: 'Usuário não autenticado',
                         500: 'Erro interno do servidor'
                     })
    def post(self):
        """
        Criar nova entidade
        
        Este endpoint permite criar uma nova entidade no sistema.
        
        **Exemplo de uso:**
        ```bash
        curl -X POST "http://localhost:5000/api/entities/" \
             -H "Content-Type: application/json" \
             -d '{
               "nome": "Nova Empresa",
               "cnpj": "98.765.432/0001-10",
               "endereco": "Rua Nova, 456",
               "telefone": "(11) 88888-8888",
               "email": "contato@novaempresa.com",
               "status": "ativo"
             }'
        ```
        
        **Resposta de sucesso:**
        ```json
        {
          "id": 16,
          "nome": "Nova Empresa",
          "cnpj": "98.765.432/0001-10",
          "endereco": "Rua Nova, 456",
          "telefone": "(11) 88888-8888",
          "email": "contato@novaempresa.com",
          "status": "ativo",
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
            
            data = request.get_json()
            
            # Verificar se CNPJ já existe
            existing_entity = Entidade.query.filter_by(cnpj=data['cnpj']).first()
            if existing_entity:
                return {
                    'success': False,
                    'message': 'CNPJ já cadastrado'
                }, 400
            
            # Criar entidade
            entity = Entidade(
                nome=data['nome'],
                cnpj=data['cnpj'],
                endereco=data['endereco'],
                telefone=data['telefone'],
                email=data['email'],
                status=data.get('status', 'ativo')
            )
            
            db.session.add(entity)
            db.session.commit()
            
            return {
                'id': entity.id,
                'nome': entity.nome,
                'cnpj': entity.cnpj,
                'endereco': entity.endereco,
                'telefone': entity.telefone,
                'email': entity.email,
                'status': entity.status,
                'created_at': entity.created_at.isoformat() if entity.created_at else None
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'message': 'Erro ao criar entidade',
                'error': str(e)
            }, 500

@entities_ns.route('/<int:entity_id>')
class EntityDetail(Resource):
    @entities_ns.marshal_with(entity_model)
    @entities_ns.doc('get_entity',
                     description='Obter dados de uma entidade específica',
                     responses={
                         200: 'Dados da entidade obtidos com sucesso',
                         401: 'Usuário não autenticado',
                         404: 'Entidade não encontrada',
                         500: 'Erro interno do servidor'
                     })
    def get(self, entity_id):
        """
        Obter dados de uma entidade específica
        
        Este endpoint retorna os dados de uma entidade específica pelo ID.
        
        **Exemplo de uso:**
        ```bash
        curl -X GET "http://localhost:5000/api/entities/1"
        ```
        
        **Resposta de sucesso:**
        ```json
        {
          "id": 1,
          "nome": "Empresa Teste",
          "cnpj": "12.345.678/0001-90",
          "endereco": "Rua Teste, 123",
          "telefone": "(11) 99999-9999",
          "email": "contato@empresa.com",
          "status": "ativo",
          "created_at": "2024-01-01T00:00:00Z"
        }
        ```
        """
        try:
            if not current_user.is_authenticated:
                return {
                    'success': False,
                    'message': 'Usuário não autenticado'
                }, 401
            
            entity = Entidade.query.get_or_404(entity_id)
            
            return {
                'id': entity.id,
                'nome': entity.nome,
                'cnpj': entity.cnpj,
                'endereco': entity.endereco,
                'telefone': entity.telefone,
                'email': entity.email,
                'status': entity.status,
                'created_at': entity.created_at.isoformat() if entity.created_at else None
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': 'Erro ao obter entidade',
                'error': str(e)
            }, 500

    @entities_ns.expect(entity_update_model, validate=True)
    @entities_ns.marshal_with(entity_model)
    @entities_ns.doc('update_entity',
                     description='Atualizar dados de uma entidade',
                     responses={
                         200: 'Entidade atualizada com sucesso',
                         400: 'Dados inválidos',
                         401: 'Usuário não autenticado',
                         404: 'Entidade não encontrada',
                         500: 'Erro interno do servidor'
                     })
    def put(self, entity_id):
        """
        Atualizar dados de uma entidade
        
        Este endpoint permite atualizar os dados de uma entidade existente.
        
        **Exemplo de uso:**
        ```bash
        curl -X PUT "http://localhost:5000/api/entities/1" \
             -H "Content-Type: application/json" \
             -d '{
               "nome": "Empresa Atualizada",
               "endereco": "Rua Atualizada, 789",
               "status": "ativo"
             }'
        ```
        """
        try:
            if not current_user.is_authenticated:
                return {
                    'success': False,
                    'message': 'Usuário não autenticado'
                }, 401
            
            entity = Entidade.query.get_or_404(entity_id)
            data = request.get_json()
            
            # Atualizar campos fornecidos
            if 'nome' in data:
                entity.nome = data['nome']
            if 'cnpj' in data:
                # Verificar se CNPJ já existe
                existing_entity = Entidade.query.filter_by(cnpj=data['cnpj']).first()
                if existing_entity and existing_entity.id != entity_id:
                    return {
                        'success': False,
                        'message': 'CNPJ já cadastrado'
                    }, 400
                entity.cnpj = data['cnpj']
            if 'endereco' in data:
                entity.endereco = data['endereco']
            if 'telefone' in data:
                entity.telefone = data['telefone']
            if 'email' in data:
                entity.email = data['email']
            if 'status' in data:
                entity.status = data['status']
            
            db.session.commit()
            
            return {
                'id': entity.id,
                'nome': entity.nome,
                'cnpj': entity.cnpj,
                'endereco': entity.endereco,
                'telefone': entity.telefone,
                'email': entity.email,
                'status': entity.status,
                'created_at': entity.created_at.isoformat() if entity.created_at else None
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'message': 'Erro ao atualizar entidade',
                'error': str(e)
            }, 500

    @entities_ns.marshal_with(success_response)
    @entities_ns.doc('delete_entity',
                     description='Excluir uma entidade',
                     responses={
                         200: 'Entidade excluída com sucesso',
                         401: 'Usuário não autenticado',
                         404: 'Entidade não encontrada',
                         500: 'Erro interno do servidor'
                     })
    def delete(self, entity_id):
        """
        Excluir uma entidade
        
        Este endpoint permite excluir uma entidade do sistema.
        
        **Exemplo de uso:**
        ```bash
        curl -X DELETE "http://localhost:5000/api/entities/1"
        ```
        """
        try:
            if not current_user.is_authenticated:
                return {
                    'success': False,
                    'message': 'Usuário não autenticado'
                }, 401
            
            entity = Entidade.query.get_or_404(entity_id)
            
            db.session.delete(entity)
            db.session.commit()
            
            return {
                'success': True,
                'message': 'Entidade excluída com sucesso'
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'message': 'Erro ao excluir entidade',
                'error': str(e)
            }, 500
