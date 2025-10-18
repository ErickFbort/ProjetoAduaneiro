"""
Configuração de CSRF Protection
"""
from flask_wtf.csrf import CSRFProtect
from flask import current_app

csrf = CSRFProtect()

def init_csrf(app):
    """Inicializa a proteção CSRF"""
    csrf.init_app(app)
    
    # Configurações de CSRF
    app.config['WTF_CSRF_TIME_LIMIT'] = 3600  # 1 hora
    app.config['WTF_CSRF_SSL_STRICT'] = False  # Para desenvolvimento
    app.config['WTF_CSRF_CHECK_DEFAULT'] = True
    
    # Excluir endpoints de API que não precisam de CSRF
    csrf.exempt('api.get_system_stats')
    csrf.exempt('api.get_linkedin_posts')
    csrf.exempt('api.get_company_info')
    
    # Não excluir login - deve usar CSRF
    
    # Configurar CSRF para desenvolvimento
    app.config['WTF_CSRF_ENABLED'] = True
    app.config['WTF_CSRF_METHODS'] = ['POST', 'PUT', 'PATCH', 'DELETE']
    
    return csrf
