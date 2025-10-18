"""
Namespace de estatísticas da API
"""
from flask_restx import Namespace, Resource, fields
from flask import request, jsonify
from app.models.user import User
from app.models.veiculo import Veiculo
from app.models.entidade import Entidade
# from app.api.models import (
#     stats_model, detailed_stats_model, success_response, error_response
# )

stats_ns = Namespace('stats', description='Operações de estatísticas')

@stats_ns.route('/')
class Statistics(Resource):
    # @stats_ns.marshal_with(stats_model)
    @stats_ns.doc('get_statistics',
                  description='Obter estatísticas básicas do sistema',
                  responses={
                      200: 'Estatísticas obtidas com sucesso',
                      500: 'Erro interno do servidor'
                  })
    def get(self):
        """
        Obter estatísticas básicas do sistema
        
        Este endpoint retorna estatísticas gerais do sistema, incluindo
        contadores de usuários, veículos, entidades e processos.
        
        **Exemplo de uso:**
        ```bash
        curl -X GET "http://localhost:5000/api/stats/"
        ```
        
        **Resposta de sucesso:**
        ```json
        {
          "users": 15,
          "vehicles": 42,
          "entities": 8,
          "processes": 156
        }
        ```
        
        **Notas:**
        - Este endpoint é público e não requer autenticação
        - Os dados são atualizados em tempo real
        - O campo 'processes' sempre retorna 0 (não implementado)
        """
        try:
            # Contar registros
            users_count = User.query.count()
            vehicles_count = Veiculo.query.count()
            entities_count = Entidade.query.count()
            processes_count = 0  # Não implementado ainda
            
            return {
                'users': users_count,
                'vehicles': vehicles_count,
                'entities': entities_count,
                'processes': processes_count
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': 'Erro ao obter estatísticas',
                'error': str(e)
            }, 500

@stats_ns.route('/detailed')
class DetailedStatistics(Resource):
    # @stats_ns.marshal_with(detailed_stats_model)
    @stats_ns.doc('get_detailed_statistics',
                  description='Obter estatísticas detalhadas do sistema',
                  responses={
                      200: 'Estatísticas detalhadas obtidas com sucesso',
                      401: 'Usuário não autenticado',
                      500: 'Erro interno do servidor'
                  })
    def get(self):
        """
        Obter estatísticas detalhadas do sistema
        
        Este endpoint retorna estatísticas detalhadas do sistema, incluindo
        breakdowns por status, grupos e outras categorias.
        
        **Exemplo de uso:**
        ```bash
        curl -X GET "http://localhost:5000/api/stats/detailed" \
             -H "Authorization: Bearer <token>"
        ```
        
        **Resposta de sucesso:**
        ```json
        {
          "users": {
            "total": 15,
            "active": 12,
            "blocked": 3,
            "by_group": [
              {"group": "admin", "count": 2},
              {"group": "user", "count": 10},
              {"group": "operator", "count": 3}
            ]
          },
          "vehicles": {
            "total": 42,
            "active": 38,
            "inactive": 4
          },
          "entities": {
            "total": 8,
            "active": 7,
            "inactive": 1
          },
          "processes": 156
        }
        ```
        
        **Notas:**
        - Este endpoint requer autenticação
        - Os dados são atualizados em tempo real
        - Inclui breakdowns detalhados por categoria
        """
        try:
            from flask_login import current_user
            
            if not current_user.is_authenticated:
                return {
                    'success': False,
                    'message': 'Usuário não autenticado'
                }, 401
            
            # Estatísticas de usuários
            users_total = User.query.count()
            users_active = User.query.filter_by(status='active').count()
            users_blocked = User.query.filter_by(status='blocked').count()
            
            # Usuários por grupo
            from app import db
            users_by_group = db.session.query(
                User.group,
                db.func.count(User.id)
            ).group_by(User.group).all()
            
            users_stats = {
                'total': users_total,
                'active': users_active,
                'blocked': users_blocked,
                'by_group': [{'group': group, 'count': count} for group, count in users_by_group]
            }
            
            # Estatísticas de veículos
            vehicles_total = Veiculo.query.count()
            vehicles_active = Veiculo.query.filter_by(status='ativo').count()
            vehicles_inactive = Veiculo.query.filter_by(status='inativo').count()
            
            vehicles_stats = {
                'total': vehicles_total,
                'active': vehicles_active,
                'inactive': vehicles_inactive
            }
            
            # Estatísticas de entidades
            entities_total = Entidade.query.count()
            entities_active = Entidade.query.filter_by(status='ativo').count()
            entities_inactive = Entidade.query.filter_by(status='inativo').count()
            
            entities_stats = {
                'total': entities_total,
                'active': entities_active,
                'inactive': entities_inactive
            }
            
            return {
                'users': users_stats,
                'vehicles': vehicles_stats,
                'entities': entities_stats,
                'processes': 0  # Não implementado ainda
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': 'Erro ao obter estatísticas detalhadas',
                'error': str(e)
            }, 500

@stats_ns.route('/users')
class UserStatistics(Resource):
    # @stats_ns.marshal_with(success_response)
    @stats_ns.doc('get_user_statistics',
                  description='Obter estatísticas específicas de usuários',
                  responses={
                      200: 'Estatísticas de usuários obtidas com sucesso',
                      500: 'Erro interno do servidor'
                  })
    def get(self):
        """
        Obter estatísticas específicas de usuários
        
        Este endpoint retorna estatísticas detalhadas sobre usuários do sistema.
        
        **Exemplo de uso:**
        ```bash
        curl -X GET "http://localhost:5000/api/stats/users"
        ```
        
        **Resposta de sucesso:**
        ```json
        {
          "success": true,
          "data": {
            "total": 15,
            "active": 12,
            "blocked": 3,
            "by_group": [
              {"group": "admin", "count": 2},
              {"group": "user", "count": 10},
              {"group": "operator", "count": 3}
            ],
            "recent_logins": 5,
            "new_this_month": 3
          }
        }
        ```
        """
        try:
            from app import db
            from datetime import datetime, timedelta
            
            # Estatísticas básicas
            total = User.query.count()
            active = User.query.filter_by(status='active').count()
            blocked = User.query.filter_by(status='blocked').count()
            
            # Usuários por grupo
            by_group = db.session.query(
                User.group,
                db.func.count(User.id)
            ).group_by(User.group).all()
            
            # Usuários novos este mês
            this_month = datetime.now().replace(day=1)
            new_this_month = User.query.filter(User.created_at >= this_month).count()
            
            # Logins recentes (últimos 7 dias)
            week_ago = datetime.now() - timedelta(days=7)
            recent_logins = User.query.filter(User.last_login >= week_ago).count()
            
            return {
                'success': True,
                'data': {
                    'total': total,
                    'active': active,
                    'blocked': blocked,
                    'by_group': [{'group': group, 'count': count} for group, count in by_group],
                    'recent_logins': recent_logins,
                    'new_this_month': new_this_month
                }
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': 'Erro ao obter estatísticas de usuários',
                'error': str(e)
            }, 500

@stats_ns.route('/vehicles')
class VehicleStatistics(Resource):
    # @stats_ns.marshal_with(success_response)
    @stats_ns.doc('get_vehicle_statistics',
                  description='Obter estatísticas específicas de veículos',
                  responses={
                      200: 'Estatísticas de veículos obtidas com sucesso',
                      500: 'Erro interno do servidor'
                  })
    def get(self):
        """
        Obter estatísticas específicas de veículos
        
        Este endpoint retorna estatísticas detalhadas sobre veículos do sistema.
        
        **Exemplo de uso:**
        ```bash
        curl -X GET "http://localhost:5000/api/stats/vehicles"
        ```
        
        **Resposta de sucesso:**
        ```json
        {
          "success": true,
          "data": {
            "total": 42,
            "active": 38,
            "inactive": 4,
            "by_year": [
              {"year": 2020, "count": 15},
              {"year": 2021, "count": 12},
              {"year": 2022, "count": 10},
              {"year": 2023, "count": 5}
            ],
            "by_color": [
              {"color": "Branco", "count": 18},
              {"color": "Prata", "count": 12},
              {"color": "Preto", "count": 8},
              {"color": "Azul", "count": 4}
            ]
          }
        }
        ```
        """
        try:
            from app import db
            
            # Estatísticas básicas
            total = Veiculo.query.count()
            active = Veiculo.query.filter_by(status='ativo').count()
            inactive = Veiculo.query.filter_by(status='inativo').count()
            
            # Veículos por ano
            by_year = db.session.query(
                Veiculo.ano,
                db.func.count(Veiculo.id)
            ).group_by(Veiculo.ano).order_by(Veiculo.ano.desc()).all()
            
            # Veículos por cor
            by_color = db.session.query(
                Veiculo.cor,
                db.func.count(Veiculo.id)
            ).group_by(Veiculo.cor).order_by(db.func.count(Veiculo.id).desc()).all()
            
            return {
                'success': True,
                'data': {
                    'total': total,
                    'active': active,
                    'inactive': inactive,
                    'by_year': [{'year': year, 'count': count} for year, count in by_year],
                    'by_color': [{'color': color, 'count': count} for color, count in by_color]
                }
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': 'Erro ao obter estatísticas de veículos',
                'error': str(e)
            }, 500
