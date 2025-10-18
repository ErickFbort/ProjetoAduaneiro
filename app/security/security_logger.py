"""
Sistema de logging de segurança
"""
import logging
import json
from datetime import datetime
from flask import request, current_app
from functools import wraps

# Configurar logger de segurança
security_logger = logging.getLogger('security')
security_logger.setLevel(logging.INFO)

# Handler para arquivo de log
file_handler = logging.FileHandler('logs/security.log')
file_handler.setLevel(logging.INFO)

# Formatter para logs de segurança
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
file_handler.setFormatter(formatter)

security_logger.addHandler(file_handler)

def log_security_event(event_type, details=None, user_id=None, ip_address=None):
    """
    Registra eventos de segurança
    
    Args:
        event_type: Tipo do evento (login, failed_login, suspicious_activity, etc.)
        details: Detalhes adicionais do evento
        user_id: ID do usuário (se aplicável)
        ip_address: Endereço IP (se não fornecido, usa o da requisição)
    """
    if not ip_address:
        ip_address = request.remote_addr if request else 'unknown'
    
    log_data = {
        'timestamp': datetime.utcnow().isoformat(),
        'event_type': event_type,
        'user_id': user_id,
        'ip_address': ip_address,
        'user_agent': request.headers.get('User-Agent') if request else None,
        'details': details or {}
    }
    
    security_logger.info(json.dumps(log_data))

def log_failed_login(email, reason='invalid_credentials'):
    """Registra tentativa de login falhada"""
    log_security_event(
        'failed_login',
        {'email': email, 'reason': reason}
    )

def log_successful_login(user_id, email):
    """Registra login bem-sucedido"""
    log_security_event(
        'successful_login',
        {'email': email},
        user_id=user_id
    )

def log_suspicious_activity(activity_type, details):
    """Registra atividade suspeita"""
    log_security_event(
        'suspicious_activity',
        {'activity_type': activity_type, 'details': details}
    )

def log_rate_limit_exceeded(endpoint, ip_address):
    """Registra excedência de rate limit"""
    log_security_event(
        'rate_limit_exceeded',
        {'endpoint': endpoint},
        ip_address=ip_address
    )

def log_input_validation_error(field, error, data):
    """Registra erro de validação de entrada"""
    log_security_event(
        'input_validation_error',
        {'field': field, 'error': error, 'data': str(data)[:100]}
    )

def log_csrf_violation(endpoint, ip_address):
    """Registra violação de CSRF"""
    log_security_event(
        'csrf_violation',
        {'endpoint': endpoint},
        ip_address=ip_address
    )

def monitor_security(f):
    """
    Decorator para monitorar endpoints sensíveis
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            result = f(*args, **kwargs)
            
            # Log de acesso bem-sucedido
            log_security_event(
                'endpoint_access',
                {
                    'endpoint': request.endpoint,
                    'method': request.method,
                    'status': 'success'
                }
            )
            
            return result
        except Exception as e:
            # Log de erro
            log_security_event(
                'endpoint_error',
                {
                    'endpoint': request.endpoint,
                    'method': request.method,
                    'error': str(e),
                    'status': 'error'
                }
            )
            raise
    
    return decorated_function

def detect_anomalies():
    """
    Detecta anomalias nos logs de segurança
    """
    # Implementar lógica de detecção de anomalias
    # Por exemplo: muitas tentativas de login falhadas, acessos suspeitos, etc.
    pass
