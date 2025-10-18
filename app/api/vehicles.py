"""
Namespace de veículos da API
"""
from flask_restx import Namespace, Resource, fields, reqparse
from flask import request, jsonify
from flask_login import current_user, login_required
from app.models.veiculo import Veiculo
from app import db
from app.api.models import (
    vehicle_model, vehicle_create_model, vehicle_update_model,
    success_response, error_response, paginated_response
)

vehicles_ns = Namespace('vehicles', description='Operações de veículos')

# Parser para parâmetros de query
parser = reqparse.RequestParser()
parser.add_argument('page', type=int, default=1, help='Número da página')
parser.add_argument('per_page', type=int, default=10, help='Itens por página')
parser.add_argument('search', type=str, help='Termo de busca (placa ou modelo)')
parser.add_argument('status', type=str, help='Filtrar por status (ativo, inativo)')
parser.add_argument('year', type=int, help='Filtrar por ano')
parser.add_argument('color', type=str, help='Filtrar por cor')
parser.add_argument('sort', type=str, default='id', help='Campo para ordenação')
parser.add_argument('order', type=str, default='asc', help='Ordem da classificação')

@vehicles_ns.route('/')
class VehicleList(Resource):
    @vehicles_ns.expect(parser)
    @vehicles_ns.marshal_with(paginated_response)
    @vehicles_ns.doc('list_vehicles',
                     description='Listar veículos com paginação e filtros',
                     responses={
                         200: 'Lista de veículos obtida com sucesso',
                         401: 'Usuário não autenticado',
                         500: 'Erro interno do servidor'
                     })
    def get(self):
        """
        Listar veículos
        
        Este endpoint retorna uma lista paginada de veículos com opções de
        filtro e busca.
        
        **Parâmetros de query:**
        - `page` (int): Número da página (padrão: 1)
        - `per_page` (int): Itens por página (padrão: 10)
        - `search` (string): Termo de busca (placa ou modelo)
        - `status` (string): Filtrar por status (ativo, inativo)
        - `year` (int): Filtrar por ano
        - `color` (string): Filtrar por cor
        - `sort` (string): Campo para ordenação (padrão: id)
        - `order` (string): Ordem da classificação (asc, desc)
        
        **Exemplo de uso:**
        ```bash
        curl -X GET "http://localhost:5000/api/vehicles/?page=1&per_page=5&search=ABC&status=ativo"
        ```
        
        **Resposta de sucesso:**
        ```json
        {
          "success": true,
          "data": [
            {
              "id": 1,
              "placa": "ABC-1234",
              "modelo": "Ford Focus",
              "cor": "Branco",
              "ano": 2020,
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
            query = Veiculo.query
            
            # Aplicar filtros
            if args['search']:
                search_term = f"%{args['search']}%"
                query = query.filter(
                    (Veiculo.placa.ilike(search_term)) | 
                    (Veiculo.modelo.ilike(search_term))
                )
            
            if args['status']:
                query = query.filter(Veiculo.status == args['status'])
            
            if args['year']:
                query = query.filter(Veiculo.ano == args['year'])
            
            if args['color']:
                query = query.filter(Veiculo.cor.ilike(f"%{args['color']}%"))
            
            # Aplicar ordenação
            sort_field = getattr(Veiculo, args['sort'], Veiculo.id)
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
            
            vehicles = []
            for vehicle in pagination.items:
                vehicles.append({
                    'id': vehicle.id,
                    'placa': vehicle.placa,
                    'modelo': vehicle.modelo,
                    'cor': vehicle.cor,
                    'ano': vehicle.ano,
                    'status': vehicle.status,
                    'created_at': vehicle.created_at.isoformat() if vehicle.created_at else None
                })
            
            return {
                'success': True,
                'data': vehicles,
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
                'message': 'Erro ao listar veículos',
                'error': str(e)
            }, 500

    @vehicles_ns.expect(vehicle_create_model, validate=True)
    @vehicles_ns.marshal_with(vehicle_model)
    @vehicles_ns.doc('create_vehicle',
                     description='Criar novo veículo',
                     responses={
                         201: 'Veículo criado com sucesso',
                         400: 'Dados inválidos',
                         401: 'Usuário não autenticado',
                         500: 'Erro interno do servidor'
                     })
    def post(self):
        """
        Criar novo veículo
        
        Este endpoint permite criar um novo veículo no sistema.
        
        **Exemplo de uso:**
        ```bash
        curl -X POST "http://localhost:5000/api/vehicles/" \
             -H "Content-Type: application/json" \
             -d '{
               "placa": "XYZ-9876",
               "modelo": "Honda Civic",
               "cor": "Azul",
               "ano": 2021,
               "status": "ativo"
             }'
        ```
        
        **Resposta de sucesso:**
        ```json
        {
          "id": 16,
          "placa": "XYZ-9876",
          "modelo": "Honda Civic",
          "cor": "Azul",
          "ano": 2021,
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
            
            # Verificar se placa já existe
            existing_vehicle = Veiculo.query.filter_by(placa=data['placa']).first()
            if existing_vehicle:
                return {
                    'success': False,
                    'message': 'Placa já cadastrada'
                }, 400
            
            # Criar veículo
            vehicle = Veiculo(
                placa=data['placa'],
                modelo=data['modelo'],
                cor=data['cor'],
                ano=data['ano'],
                status=data.get('status', 'ativo')
            )
            
            db.session.add(vehicle)
            db.session.commit()
            
            return {
                'id': vehicle.id,
                'placa': vehicle.placa,
                'modelo': vehicle.modelo,
                'cor': vehicle.cor,
                'ano': vehicle.ano,
                'status': vehicle.status,
                'created_at': vehicle.created_at.isoformat() if vehicle.created_at else None
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'message': 'Erro ao criar veículo',
                'error': str(e)
            }, 500

@vehicles_ns.route('/<int:vehicle_id>')
class VehicleDetail(Resource):
    @vehicles_ns.marshal_with(vehicle_model)
    @vehicles_ns.doc('get_vehicle',
                     description='Obter dados de um veículo específico',
                     responses={
                         200: 'Dados do veículo obtidos com sucesso',
                         401: 'Usuário não autenticado',
                         404: 'Veículo não encontrado',
                         500: 'Erro interno do servidor'
                     })
    def get(self, vehicle_id):
        """
        Obter dados de um veículo específico
        
        Este endpoint retorna os dados de um veículo específico pelo ID.
        
        **Exemplo de uso:**
        ```bash
        curl -X GET "http://localhost:5000/api/vehicles/1"
        ```
        
        **Resposta de sucesso:**
        ```json
        {
          "id": 1,
          "placa": "ABC-1234",
          "modelo": "Ford Focus",
          "cor": "Branco",
          "ano": 2020,
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
            
            vehicle = Veiculo.query.get_or_404(vehicle_id)
            
            return {
                'id': vehicle.id,
                'placa': vehicle.placa,
                'modelo': vehicle.modelo,
                'cor': vehicle.cor,
                'ano': vehicle.ano,
                'status': vehicle.status,
                'created_at': vehicle.created_at.isoformat() if vehicle.created_at else None
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': 'Erro ao obter veículo',
                'error': str(e)
            }, 500

    @vehicles_ns.expect(vehicle_update_model, validate=True)
    @vehicles_ns.marshal_with(vehicle_model)
    @vehicles_ns.doc('update_vehicle',
                     description='Atualizar dados de um veículo',
                     responses={
                         200: 'Veículo atualizado com sucesso',
                         400: 'Dados inválidos',
                         401: 'Usuário não autenticado',
                         404: 'Veículo não encontrado',
                         500: 'Erro interno do servidor'
                     })
    def put(self, vehicle_id):
        """
        Atualizar dados de um veículo
        
        Este endpoint permite atualizar os dados de um veículo existente.
        
        **Exemplo de uso:**
        ```bash
        curl -X PUT "http://localhost:5000/api/vehicles/1" \
             -H "Content-Type: application/json" \
             -d '{
               "modelo": "Ford Focus 2021",
               "cor": "Prata",
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
            
            vehicle = Veiculo.query.get_or_404(vehicle_id)
            data = request.get_json()
            
            # Atualizar campos fornecidos
            if 'placa' in data:
                # Verificar se placa já existe
                existing_vehicle = Veiculo.query.filter_by(placa=data['placa']).first()
                if existing_vehicle and existing_vehicle.id != vehicle_id:
                    return {
                        'success': False,
                        'message': 'Placa já cadastrada'
                    }, 400
                vehicle.placa = data['placa']
            
            if 'modelo' in data:
                vehicle.modelo = data['modelo']
            if 'cor' in data:
                vehicle.cor = data['cor']
            if 'ano' in data:
                vehicle.ano = data['ano']
            if 'status' in data:
                vehicle.status = data['status']
            
            db.session.commit()
            
            return {
                'id': vehicle.id,
                'placa': vehicle.placa,
                'modelo': vehicle.modelo,
                'cor': vehicle.cor,
                'ano': vehicle.ano,
                'status': vehicle.status,
                'created_at': vehicle.created_at.isoformat() if vehicle.created_at else None
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'message': 'Erro ao atualizar veículo',
                'error': str(e)
            }, 500

    @vehicles_ns.marshal_with(success_response)
    @vehicles_ns.doc('delete_vehicle',
                     description='Excluir um veículo',
                     responses={
                         200: 'Veículo excluído com sucesso',
                         401: 'Usuário não autenticado',
                         404: 'Veículo não encontrado',
                         500: 'Erro interno do servidor'
                     })
    def delete(self, vehicle_id):
        """
        Excluir um veículo
        
        Este endpoint permite excluir um veículo do sistema.
        
        **Exemplo de uso:**
        ```bash
        curl -X DELETE "http://localhost:5000/api/vehicles/1"
        ```
        """
        try:
            if not current_user.is_authenticated:
                return {
                    'success': False,
                    'message': 'Usuário não autenticado'
                }, 401
            
            vehicle = Veiculo.query.get_or_404(vehicle_id)
            
            db.session.delete(vehicle)
            db.session.commit()
            
            return {
                'success': True,
                'message': 'Veículo excluído com sucesso'
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'message': 'Erro ao excluir veículo',
                'error': str(e)
            }, 500
