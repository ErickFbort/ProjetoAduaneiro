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

@web_clientes_bp.route('/web-clientes/autorizacao-carregamento/editar/<int:autorizacao_id>')
@login_required
def web_clientes_editar_autorizacao(autorizacao_id):
    """Página de Edição de Autorização de Carregamento - Web Cliente"""
    # Aqui você buscaria os dados da autorização no banco de dados
    # Por enquanto, vamos simular dados de exemplo
    autorizacao_data = {
        'id': autorizacao_id,
        'entidade': '52401444000132 - VANESSA ALINE REBELLO DE OLIVEIRA',
        'numeroDocumento': 'AUT-2024-001',
        'data': '2024-01-15',
        'observacoes': 'Autorização para carregamento de mercadorias importadas',
        'importador': {
            'cnpj': '12.345.678/0001-90',
            'razaoSocial': 'EMPRESA IMPORTADORA LTDA',
            'documentoLiberatorio': 'DI: 1234567890',
            'exoneracaoICMS': True,
            'pagamentoICMS': False
        },
        'transportador': {
            'cnpjCpf': '98.765.432/0001-10',
            'razaoSocial': 'TRANSPORTADORA EXEMPLO LTDA'
        },
        'motoristas': [
            {'cnh': '12345678901', 'nome': 'João Silva'},
            {'cnh': '98765432109', 'nome': 'Maria Santos'}
        ],
        'representante': {
            'cpf': '123.456.789-00',
            'nome': 'Carlos Representante',
            'rg': '12.345.678-9',
            'orgaoExpedidor': 'SSP/SP',
            'dataEmissao': '15/01/2020',
            'telefone': '(11) 99999-9999',
            'celular': '(11) 88888-8888',
            'email': 'carlos@empresa.com'
        }
    }
    
    return render_template('web_clientes/cadastro_autorizacao.html', 
                         user=current_user, 
                         autorizacao_data=autorizacao_data,
                         modo_edicao=True)

@web_clientes_bp.route('/web-clientes/autorizacao-carregamento/visualizar/<int:autorizacao_id>')
@login_required
def web_clientes_visualizar_autorizacao(autorizacao_id):
    """Página de Visualização de Autorização de Carregamento - Web Cliente"""
    # Aqui você buscaria os dados da autorização no banco de dados
    # Por enquanto, vamos simular dados de exemplo
    autorizacao_data = {
        'id': autorizacao_id,
        'entidade': '52401444000132 - VANESSA ALINE REBELLO DE OLIVEIRA',
        'numeroDocumento': 'AUT-2024-001',
        'data': '2024-01-15',
        'observacoes': 'Autorização para carregamento de mercadorias importadas',
        'importador': {
            'cnpj': '12.345.678/0001-90',
            'razaoSocial': 'EMPRESA IMPORTADORA LTDA',
            'documentoLiberatorio': 'DI: 1234567890',
            'exoneracaoICMS': True,
            'pagamentoICMS': False
        },
        'transportador': {
            'cnpjCpf': '98.765.432/0001-10',
            'razaoSocial': 'TRANSPORTADORA EXEMPLO LTDA'
        },
        'motoristas': [
            {'cnh': '12345678901', 'nome': 'João Silva'},
            {'cnh': '98765432109', 'nome': 'Maria Santos'}
        ],
        'representante': {
            'cpf': '123.456.789-00',
            'nome': 'Carlos Representante',
            'rg': '12.345.678-9',
            'orgaoExpedidor': 'SSP/SP',
            'dataEmissao': '15/01/2020',
            'telefone': '(11) 99999-9999',
            'celular': '(11) 88888-8888',
            'email': 'carlos@empresa.com'
        }
    }
    
    return render_template('web_clientes/cadastro_autorizacao.html', 
                         user=current_user, 
                         autorizacao_data=autorizacao_data,
                         modo_visualizacao=True)

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