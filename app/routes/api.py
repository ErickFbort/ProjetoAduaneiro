#!/usr/bin/env python3
"""
Rotas da API para dados externos
"""

from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.services.linkedin_service import LinkedInService
import json

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/linkedin/posts')
@login_required
def get_linkedin_posts():
    """
    Endpoint para buscar publicações do LinkedIn da Pac Log
    """
    try:
        limit = request.args.get('limit', 5, type=int)
        force_simulated = request.args.get('force_simulated', 'false').lower() == 'true'
        
        if limit > 20:  # Limitar para evitar sobrecarga
            limit = 20
            
        linkedin_service = LinkedInService()
        posts = linkedin_service.get_linkedin_posts(limit=limit, force_simulated=force_simulated)
        
        return jsonify({
            'success': True,
            'data': posts,
            'count': len(posts),
            'source': 'simulated' if force_simulated else 'mixed'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'data': []
        }), 500

@api_bp.route('/linkedin/company')
@login_required
def get_company_info():
    """
    Endpoint para buscar informações da empresa
    """
    try:
        linkedin_service = LinkedInService()
        company_info = linkedin_service.get_company_info()
        
        return jsonify({
            'success': True,
            'data': company_info
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'data': {}
        }), 500

@api_bp.route('/linkedin/clear-cache', methods=['POST'])
@login_required
def clear_linkedin_cache():
    """
    Endpoint para limpar o cache do LinkedIn
    """
    try:
        linkedin_service = LinkedInService()
        linkedin_service.clear_cache()
        
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
@login_required
def get_system_stats():
    """
    Endpoint para buscar estatísticas do sistema
    """
    try:
        from app import db
        from app.models.user import User
        from app.models.veiculo import Veiculo
        from app.models.entidade import Entidade
        
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
