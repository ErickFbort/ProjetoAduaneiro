#!/usr/bin/env python3
"""
Rotas da API para dados externos
"""

from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.services.linkedin_service import LinkedInService
from app.utils.cache import cached, cache_invalidate, cache_manager
from app.utils.database_optimization import (
    get_user_stats, get_vehicle_stats, get_entity_stats, 
    get_monthly_stats, invalidate_related_cache
)
from app.security.input_validation import validate_json_input, sanitize_input
from app.security.rate_limiter import limiter
import json

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/linkedin/posts')
@limiter.limit("5 per minute")
def get_linkedin_posts():
    """
    Endpoint para buscar publicações do LinkedIn da Pac Log
    Por enquanto retorna apenas uma mensagem informativa
    """
    return jsonify({
        'success': True,
        'data': [],
        'message': 'Integração com LinkedIn ainda não configurada. Nenhuma informação disponível no momento.',
        'count': 0
    })

@api_bp.route('/linkedin/company')
@limiter.limit("10 per minute")
def get_company_info():
    """
    Endpoint para buscar informações da empresa
    Por enquanto retorna apenas uma mensagem informativa
    """
    return jsonify({
        'success': True,
        'data': {},
        'message': 'Informações da empresa ainda não configuradas. Nenhuma informação disponível no momento.'
    })

@api_bp.route('/linkedin/clear-cache', methods=['POST'])
@login_required
def clear_linkedin_cache():
    """
    Endpoint para limpar o cache do LinkedIn
    """
    try:
        linkedin_service = LinkedInService()
        linkedin_service.clear_cache()
        
        # Invalidar cache relacionado ao LinkedIn
        cache_invalidate("linkedin_posts")
        cache_invalidate("linkedin_company")
        
        return jsonify({
            'success': True,
            'message': 'Cache do LinkedIn limpo com sucesso'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@api_bp.route('/linkedin/force-refresh', methods=['POST'])
@login_required
def force_refresh_linkedin():
    """
    Endpoint para forçar atualização dos posts do LinkedIn
    """
    try:
        linkedin_service = LinkedInService()
        # Limpar cache e buscar novos dados
        linkedin_service.clear_cache()
        
        # Invalidar cache relacionado
        cache_invalidate("linkedin_posts")
        cache_invalidate("linkedin_company")
        
        posts = linkedin_service.get_linkedin_posts(limit=5)
        
        return jsonify({
            'success': True,
            'data': posts,
            'count': len(posts),
            'message': 'Posts atualizados com sucesso'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'data': []
        }), 500

@api_bp.route('/stats')
@limiter.limit("10 per minute")
def get_system_stats():
    """
    Endpoint para buscar estatísticas do sistema (público)
    """
    try:
        from app.models.user import User
        from app.models.veiculo import Veiculo
        from app.models.entidade import Entidade
        
        # Buscar estatísticas diretamente do banco
        stats = {
            'users': User.query.count(),
            'vehicles': Veiculo.query.count(),
            'entities': Entidade.query.count(),
            'processes': 0  # Placeholder para processos futuros
        }
        
        return jsonify({
            'success': True,
            'data': stats
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'data': {
                'users': 0,
                'vehicles': 0,
                'entities': 0,
                'processes': 0
            }
        }), 500

@api_bp.route('/stats/detailed')
@login_required
@cached(timeout=300, key_prefix="system_stats_detailed")  # Cache por 5 minutos
def get_detailed_system_stats():
    """
    Endpoint para buscar estatísticas detalhadas do sistema (requer login)
    """
    try:
        # Usar funções otimizadas com cache
        user_stats = get_user_stats()
        vehicle_stats = get_vehicle_stats()
        entity_stats = get_entity_stats()
        
        stats = {
            'users': user_stats['total'],
            'vehicles': vehicle_stats['total'],
            'entities': entity_stats['total'],
            'processes': 0,  # Placeholder para processos futuros
            'details': {
                'users': user_stats,
                'vehicles': vehicle_stats,
                'entities': entity_stats
            }
        }
        
        return jsonify({
            'success': True,
            'data': stats
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'data': {
                'users': 0,
                'vehicles': 0,
                'entities': 0,
                'processes': 0
            }
        }), 500

@api_bp.route('/cache/stats')
@login_required
def get_cache_stats():
    """
    Endpoint para buscar estatísticas do cache
    """
    try:
        from app.utils.cache import get_cache_stats
        
        stats = get_cache_stats()
        
        return jsonify({
            'success': True,
            'data': stats
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'data': {}
        }), 500

@api_bp.route('/cache/clear', methods=['POST'])
@login_required
def clear_all_cache():
    """
    Endpoint para limpar todo o cache
    """
    try:
        cache_manager.clear()
        
        return jsonify({
            'success': True,
            'message': 'Cache limpo com sucesso'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@api_bp.route('/performance/database')
@login_required
def get_database_performance():
    """
    Endpoint para buscar estatísticas de performance do banco
    """
    try:
        from app.utils.database_optimization import get_database_performance_stats
        
        stats = get_database_performance_stats()
        
        return jsonify({
            'success': True,
            'data': stats
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'data': {}
        }), 500

@api_bp.route('/performance/optimize', methods=['POST'])
@login_required
def optimize_database():
    """
    Endpoint para otimizar o banco de dados
    """
    try:
        from app.utils.database_optimization import create_database_indexes
        
        success = create_database_indexes()
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Banco de dados otimizado com sucesso'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Erro ao otimizar banco de dados'
            }), 500
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
