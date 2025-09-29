from flask import Blueprint, render_template, request, jsonify, current_app
from flask_login import login_required, current_user
from app import db
from app.models.user import User
from app.models.veiculo import Veiculo
from app.models.entidade import Entidade
from sqlalchemy import func, text
from datetime import datetime, timedelta
import json

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/relatorios')
@login_required
def relatorios_main():
    """Página principal de relatórios"""
    return render_template('reports/relatorios_main.html', user=current_user)

@reports_bp.route('/relatorios/configuracao')
@login_required
def relatorios_configuracao():
    """Relatórios de Configuração"""
    return render_template('reports/relatorios_configuracao.html', user=current_user)

@reports_bp.route('/relatorios/comercial')
@login_required
def relatorios_comercial():
    """Relatórios Comerciais"""
    return render_template('reports/relatorios_comercial.html', user=current_user)

@reports_bp.route('/relatorios/faturamento')
@login_required
def relatorios_faturamento():
    """Relatórios de Faturamento"""
    return render_template('reports/relatorios_faturamento.html', user=current_user)

@reports_bp.route('/relatorios/financeiro')
@login_required
def relatorios_financeiro():
    """Relatórios Financeiros"""
    return render_template('reports/relatorios_financeiro.html', user=current_user)

@reports_bp.route('/relatorios/gerencial')
@login_required
def relatorios_gerencial():
    """Relatórios Gerenciais"""
    return render_template('reports/relatorios_gerencial.html', user=current_user)

@reports_bp.route('/relatorios/operacional')
@login_required
def relatorios_operacional():
    """Relatórios Operacionais"""
    return render_template('reports/relatorios_operacional.html', user=current_user)

# ========================================
# ROTAS DE CONFIGURAÇÃO DE RELATÓRIOS
# ========================================

@reports_bp.route('/relatorios/configuracao/<submenu>')
@login_required
def configuracao_submenu(submenu):
    """Página de configuração de relatórios por submenu"""
    submenu_titles = {
        'comercial': 'Comercial',
        'faturamento': 'Faturamento',
        'gerencial': 'Gerencial',
        'operacional': 'Operacional',
        'financeiro': 'Financeiro'
    }
    
    if submenu not in submenu_titles:
        return "Submenu não encontrado", 404
    
    return render_template(f'reports/configuracao_{submenu}.html', 
                         user=current_user, 
                         submenu_title=submenu_titles[submenu])

@reports_bp.route('/api/reports/stats')
@login_required
def get_reports_stats():
    """API para obter estatísticas gerais"""
    try:
        # Estatísticas de usuários
        total_users = User.query.count()
        active_users = User.query.filter_by(status='active').count()
        blocked_users = User.query.filter_by(status='blocked').count()
        
        # Estatísticas de veículos
        total_vehicles = Veiculo.query.count()
        active_vehicles = Veiculo.query.filter_by(status='active').count()
        blocked_vehicles = Veiculo.query.filter_by(status='blocked').count()
        
        # Estatísticas de entidades
        total_entities = Entidade.query.count()
        active_entities = Entidade.query.filter_by(status='active').count()
        blocked_entities = Entidade.query.filter_by(status='blocked').count()
        
        # Usuários por grupo
        users_by_group = db.session.query(
            User.group, 
            func.count(User.id).label('count')
        ).group_by(User.group).all()
        
        # Veículos por tipo
        vehicles_by_type = db.session.query(
            Veiculo.tipo, 
            func.count(Veiculo.id).label('count')
        ).group_by(Veiculo.tipo).all()
        
        # Entidades por tipo
        entities_by_type = db.session.query(
            Entidade.tipo, 
            func.count(Entidade.id).label('count')
        ).group_by(Entidade.tipo).all()
        
        # Cadastros por mês (últimos 12 meses)
        twelve_months_ago = datetime.now() - timedelta(days=365)
        
        users_by_month = db.session.query(
            func.date_format(User.created_at, '%Y-%m').label('month'),
            func.count(User.id).label('count')
        ).filter(User.created_at >= twelve_months_ago).group_by('month').all()
        
        vehicles_by_month = db.session.query(
            func.date_format(Veiculo.created_at, '%Y-%m').label('month'),
            func.count(Veiculo.id).label('count')
        ).filter(Veiculo.created_at >= twelve_months_ago).group_by('month').all()
        
        entities_by_month = db.session.query(
            func.date_format(Entidade.created_at, '%Y-%m').label('month'),
            func.count(Entidade.id).label('count')
        ).filter(Entidade.created_at >= twelve_months_ago).group_by('month').all()
        
        return jsonify({
            'success': True,
            'data': {
                'users': {
                    'total': total_users,
                    'active': active_users,
                    'blocked': blocked_users,
                    'by_group': [{'group': g[0], 'count': g[1]} for g in users_by_group],
                    'by_month': [{'month': m[0], 'count': m[1]} for m in users_by_month]
                },
                'vehicles': {
                    'total': total_vehicles,
                    'active': active_vehicles,
                    'blocked': blocked_vehicles,
                    'by_type': [{'type': t[0], 'count': t[1]} for t in vehicles_by_type],
                    'by_month': [{'month': m[0], 'count': m[1]} for m in vehicles_by_month]
                },
                'entities': {
                    'total': total_entities,
                    'active': active_entities,
                    'blocked': blocked_entities,
                    'by_type': [{'type': t[0], 'count': t[1]} for t in entities_by_type],
                    'by_month': [{'month': m[0], 'count': m[1]} for m in entities_by_month]
                }
            }
        })
    except Exception as e:
        current_app.logger.error(f"Erro ao obter estatísticas: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@reports_bp.route('/api/reports/users')
@login_required
def get_users_report():
    """API para relatório detalhado de usuários"""
    try:
        # Parâmetros de filtro
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        group = request.args.get('group')
        status = request.args.get('status')
        
        # Query base
        query = User.query
        
        # Aplicar filtros
        if start_date:
            query = query.filter(User.created_at >= datetime.strptime(start_date, '%Y-%m-%d'))
        if end_date:
            query = query.filter(User.created_at <= datetime.strptime(end_date, '%Y-%m-%d'))
        if group:
            query = query.filter(User.group == group)
        if status:
            query = query.filter(User.status == status)
        
        # Ordenar por data de criação
        users = query.order_by(User.created_at.desc()).all()
        
        # Converter para dicionário
        users_data = []
        for user in users:
            users_data.append({
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'group': user.group,
                'job_title': user.job_title,
                'status': user.status,
                'created_at': user.created_at.strftime('%d/%m/%Y %H:%M'),
                'last_login': user.last_login.strftime('%d/%m/%Y %H:%M') if user.last_login else 'Nunca'
            })
        
        return jsonify({
            'success': True,
            'data': users_data,
            'total': len(users_data)
        })
    except Exception as e:
        current_app.logger.error(f"Erro ao obter relatório de usuários: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@reports_bp.route('/api/reports/vehicles')
@login_required
def get_vehicles_report():
    """API para relatório detalhado de veículos"""
    try:
        # Parâmetros de filtro
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        tipo = request.args.get('tipo')
        status = request.args.get('status')
        
        # Query base
        query = Veiculo.query
        
        # Aplicar filtros
        if start_date:
            query = query.filter(Veiculo.created_at >= datetime.strptime(start_date, '%Y-%m-%d'))
        if end_date:
            query = query.filter(Veiculo.created_at <= datetime.strptime(end_date, '%Y-%m-%d'))
        if tipo:
            query = query.filter(Veiculo.tipo == tipo)
        if status:
            query = query.filter(Veiculo.status == status)
        
        # Ordenar por data de criação
        vehicles = query.order_by(Veiculo.created_at.desc()).all()
        
        # Converter para dicionário
        vehicles_data = []
        for vehicle in vehicles:
            vehicles_data.append({
                'id': vehicle.id,
                'motorista': vehicle.motorista,
                'cpf': vehicle.cpf,
                'placa': vehicle.placa,
                'renavam': vehicle.renavam,
                'tipo': vehicle.tipo,
                'status': vehicle.status,
                'created_at': vehicle.created_at.strftime('%d/%m/%Y %H:%M')
            })
        
        return jsonify({
            'success': True,
            'data': vehicles_data,
            'total': len(vehicles_data)
        })
    except Exception as e:
        current_app.logger.error(f"Erro ao obter relatório de veículos: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@reports_bp.route('/api/reports/entities')
@login_required
def get_entities_report():
    """API para relatório detalhado de entidades"""
    try:
        # Parâmetros de filtro
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        tipo = request.args.get('tipo')
        status = request.args.get('status')
        
        # Query base
        query = Entidade.query
        
        # Aplicar filtros
        if start_date:
            query = query.filter(Entidade.created_at >= datetime.strptime(start_date, '%Y-%m-%d'))
        if end_date:
            query = query.filter(Entidade.created_at <= datetime.strptime(end_date, '%Y-%m-%d'))
        if tipo:
            query = query.filter(Entidade.tipo == tipo)
        if status:
            query = query.filter(Entidade.status == status)
        
        # Ordenar por data de criação
        entities = query.order_by(Entidade.created_at.desc()).all()
        
        # Converter para dicionário
        entities_data = []
        for entity in entities:
            entities_data.append({
                'id': entity.id,
                'nome': entity.nome,
                'cnpj': entity.cnpj,
                'tipo': entity.tipo,
                'status': entity.status,
                'created_at': entity.created_at.strftime('%d/%m/%Y %H:%M')
            })
        
        return jsonify({
            'success': True,
            'data': entities_data,
            'total': len(entities_data)
        })
    except Exception as e:
        current_app.logger.error(f"Erro ao obter relatório de entidades: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@reports_bp.route('/api/reports/export/<report_type>')
@login_required
def export_report(report_type):
    """API para exportar relatórios em diferentes formatos"""
    try:
        format_type = request.args.get('format', 'pdf')
        
        if report_type == 'users':
            data = get_users_report().get_json()
        elif report_type == 'vehicles':
            data = get_vehicles_report().get_json()
        elif report_type == 'entities':
            data = get_entities_report().get_json()
        else:
            return jsonify({'success': False, 'error': 'Tipo de relatório inválido'}), 400
        
        # Por enquanto, retornar JSON
        # TODO: Implementar geração de PDF/Excel
        return jsonify({
            'success': True,
            'message': f'Relatório {report_type} exportado com sucesso',
            'data': data
        })
    except Exception as e:
        current_app.logger.error(f"Erro ao exportar relatório: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500
