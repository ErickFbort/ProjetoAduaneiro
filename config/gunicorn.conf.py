# Configuração do Gunicorn para Produção
import os

# Configurações básicas
bind = f"0.0.0.0:{os.environ.get('PORT', 5000)}"
workers = int(os.environ.get('WEB_CONCURRENCY', 4))
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 100

# Configurações de logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Configurações de segurança
forwarded_allow_ips = "*"
secure_scheme_headers = {
    'X-FORWARDED-PROTOCOL': 'ssl',
    'X-FORWARDED-PROTO': 'https',
    'X-FORWARDED-SSL': 'on'
}

# Configurações de performance
preload_app = True
worker_tmp_dir = "/dev/shm"
