"""
Módulo de documentação da API
"""
from flask_restx import Api
from flask_cors import CORS

# Configuração do Swagger/OpenAPI
api = Api(
    title='Projeto Aduaneiro API',
    version='1.0.0',
    description='API completa para o sistema de gestão aduaneira',
    doc='/api/docs/',
    prefix='/api'
)

# Configuração CORS
cors = CORS()

def init_api(app):
    """Inicializar API e documentação"""
    api.init_app(app)
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-CSRFToken"]
        }
    })
    
    # Registrar namespaces
    from app.api.simple import simple_ns
    from app.api.stats import stats_ns
    from app.api.linkedin import linkedin_ns
    
    api.add_namespace(simple_ns)
    api.add_namespace(stats_ns)
    api.add_namespace(linkedin_ns)
    
    # Registrar namespaces principais (comentados temporariamente)
    # from app.api.auth import auth_ns
    # from app.api.users import users_ns
    # from app.api.vehicles import vehicles_ns
    # from app.api.entities import entities_ns
    
    # api.add_namespace(auth_ns)
    # api.add_namespace(users_ns)
    # api.add_namespace(vehicles_ns)
    # api.add_namespace(entities_ns)
    
    return api