"""
Rotas de faturamento
"""

from flask import Blueprint, render_template, request
from flask_login import login_required, current_user

faturamento_bp = Blueprint('faturamento', __name__)

@faturamento_bp.route('/faturamento')
@login_required
def faturamento():
    """Página principal do módulo de faturamento"""
    return render_template('faturamento/faturamento_main.html', user=current_user)

@faturamento_bp.route('/faturamento/processo')
@login_required
def faturamento_processo():
    """Página de gestão de processos de faturamento"""
    return render_template('faturamento/faturamento_processo.html', user=current_user)

@faturamento_bp.route('/faturamento/guias')
@login_required
def faturamento_guias():
    """Página de gestão de guias de faturamento"""
    return render_template('faturamento/faturamento_guias.html', user=current_user)

@faturamento_bp.route('/faturamento/descontos')
@login_required
def faturamento_descontos():
    """Página de gestão de descontos e promoções"""
    return render_template('faturamento/faturamento_descontos.html', user=current_user)
