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

@web_clientes_bp.route('/web-clientes/processos/cadastro')
@login_required
def web_clientes_cadastro_processo():
    """Página de Cadastro de Processo - Web Cliente"""
    return render_template('web_clientes/cadastro_processo.html', user=current_user)

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

@web_clientes_bp.route('/web-clientes/autorizacao-carregamento')
@login_required
def web_clientes_autorizacao_carregamento():
    """Página de Autorização de Carregamento - Web Cliente"""
    return render_template('web_clientes/autorizacao_carregamento.html', user=current_user)

@web_clientes_bp.route('/web-clientes/autorizacao-carregamento/cadastro')
@login_required
def web_clientes_cadastro_autorizacao():
    """Página de Cadastro de Autorização de Carregamento - Web Cliente"""
    return render_template('web_clientes/cadastro_autorizacao.html', user=current_user)

@web_clientes_bp.route('/web-clientes/perdimento')
@login_required
def web_clientes_perdimento():
    """Página de Perdimento - Web Cliente"""
    return render_template('web_clientes/perdimento.html', user=current_user)

@web_clientes_bp.route('/web-clientes/perdimento/detalhes')
@login_required
def web_clientes_detalhes_perdimento():
    """Página de Detalhes do Perdimento - Web Cliente"""
    return render_template('web_clientes/detalhes_perdimento.html', user=current_user)