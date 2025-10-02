"""
Rotas de Web Cliente
"""

from flask import Blueprint, render_template
from flask_login import login_required, current_user

web_clientes_bp = Blueprint('web_clientes', __name__)

@web_clientes_bp.route('/web-clientes')
@login_required
def web_clientes():
    """Página principal de Web Cliente com sub-menus"""
    return render_template('web_clientes/web_clientes_main.html', user=current_user)

@web_clientes_bp.route('/web-clientes/processos')
@login_required
def web_clientes_processos():
    """Página de Processos - Web Cliente"""
    return render_template('web_clientes/processos.html', user=current_user)

@web_clientes_bp.route('/web-clientes/dape-sem-carga')
@login_required
def web_clientes_dape_sem_carga():
    """Página de DAPE sem carga - Web Cliente"""
    return render_template('web_clientes/dape_sem_carga.html', user=current_user)

@web_clientes_bp.route('/web-clientes/agendamento-carregamento')
@login_required
def web_clientes_agendamento_carregamento():
    """Página de Agendamento de carregamento - Web Cliente"""
    return render_template('web_clientes/agendamento_carregamento.html', user=current_user)

@web_clientes_bp.route('/web-clientes/agendamento-vistorias')
@login_required
def web_clientes_agendamento_vistorias():
    """Página de Agendamento de vistorias - Web Cliente"""
    return render_template('web_clientes/agendamento_vistorias.html', user=current_user)
