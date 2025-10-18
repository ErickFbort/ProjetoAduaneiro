#!/usr/bin/env python3
"""
Sistema Aduaneiro - Aplicação Principal
"""

from app import create_app, db
from app.utils.database import init_database
from app.utils.database_optimization import create_database_indexes
from flask_login import LoginManager

# Criar aplicação
app = create_app()

# Configurar login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'
login_manager.login_message = 'Por favor, faça login para acessar esta página.'
login_manager.login_message_category = 'info'

@login_manager.user_loader
def load_user(user_id):
    """Carrega usuário para o Flask-Login"""
    from app.models.user import User
    return User.query.get(int(user_id))

def init_app():
    """Inicializa a aplicação"""
    with app.app_context():
        init_database()
        # Criar índices para otimização
        create_database_indexes()

if __name__ == '__main__':
    # Executar aplicação
    app.run(debug=True, host='0.0.0.0', port=5000)
