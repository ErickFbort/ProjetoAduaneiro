"""
Sistema Aduaneiro - Aplicação Flask
"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from config import config
import os

# Inicializar extensões
db = SQLAlchemy()
login_manager = LoginManager()

def create_app(config_name=None):
    """Factory function para criar a aplicação Flask"""
    app = Flask(__name__, template_folder='../templates', static_folder='../static')
    
    # Configuração
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    app.config.from_object(config[config_name])
    
    # Inicializar extensões com app
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Por favor, faça login para acessar esta página.'
    login_manager.login_message_category = 'info'
    
    # Registrar blueprints
    from app.routes.auth import auth_bp
    from app.routes.main import main_bp
    from app.routes.cadastros import cadastros_bp
    from app.routes.reports import reports_bp
    from app.routes.web_clientes import web_clientes_bp
    from app.routes.faturamento import faturamento_bp
    from app.routes.api import api_bp
    from app.api.users import users_bp
    from app.api.veiculos import veiculos_bp
    from app.api.entidades import entidades_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(cadastros_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(web_clientes_bp)
    app.register_blueprint(faturamento_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(users_bp, url_prefix='/api')
    app.register_blueprint(veiculos_bp, url_prefix='/api')
    app.register_blueprint(entidades_bp, url_prefix='/api')
    
    return app
