"""
Configuração de Security Headers
"""
from flask import Flask, make_response
from functools import wraps

def security_headers(app: Flask):
    """Aplica headers de segurança a todas as respostas"""
    
    @app.after_request
    def add_security_headers(response):
        # Prevenir clickjacking
        response.headers['X-Frame-Options'] = 'DENY'
        
        # Prevenir MIME type sniffing
        response.headers['X-Content-Type-Options'] = 'nosniff'
        
        # Habilitar XSS protection
        response.headers['X-XSS-Protection'] = '1; mode=block'
        
        # Referrer Policy
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Content Security Policy - Versão mais permissiva para desenvolvimento
        csp = (
            "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://fonts.googleapis.com; "
            "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://fonts.googleapis.com; "
            "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; "
            "img-src 'self' data: blob: https:; "
            "connect-src 'self' https:; "
            "frame-src 'self'; "
            "object-src 'none'; "
            "base-uri 'self'; "
            "form-action 'self'"
        )
        response.headers['Content-Security-Policy'] = csp
        
        # Strict Transport Security (apenas em HTTPS)
        if app.config.get('HTTPS_ENABLED', False):
            response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        
        # Permissions Policy - Removido 'speaker' que não é reconhecido
        response.headers['Permissions-Policy'] = (
            "geolocation=(), "
            "microphone=(), "
            "camera=(), "
            "payment=(), "
            "usb=(), "
            "magnetometer=(), "
            "gyroscope=()"
        )
        
        return response

def require_https(f):
    """Decorator para forçar HTTPS"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        from flask import request, redirect, url_for
        if not request.is_secure and not request.headers.get('X-Forwarded-Proto') == 'https':
            return redirect(request.url.replace('http://', 'https://'))
        return f(*args, **kwargs)
    return decorated_function

def add_cors_headers(response):
    """Adiciona headers CORS apropriados"""
    response.headers['Access-Control-Allow-Origin'] = '*'  # Configurar adequadamente em produção
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-CSRFToken'
    response.headers['Access-Control-Max-Age'] = '3600'
    return response
