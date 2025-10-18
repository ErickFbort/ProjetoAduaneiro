"""
Middleware de validação para rotas
"""
from functools import wraps
from flask import request, jsonify
from app.security.input_validation import validate_json_input, sanitize_input

def validate_json(required_fields=None, optional_fields=None):
    """
    Decorator para validar entrada JSON
    
    Args:
        required_fields: Lista de campos obrigatórios
        optional_fields: Lista de campos opcionais
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Validar entrada JSON
            result = validate_json_input(required_fields, optional_fields)
            
            if isinstance(result, tuple) and len(result) == 2:
                data, status_code = result
                if status_code != 200:
                    return jsonify(data), status_code
                
                # Adicionar dados validados ao request
                request.validated_data = data
                return f(*args, **kwargs)
            else:
                return jsonify({'error': 'Erro na validação'}), 400
        
        return decorated_function
    return decorator

def sanitize_request_data():
    """
    Decorator para sanitizar dados da requisição
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Sanitizar dados do request
            if request.is_json:
                request.json = sanitize_input(request.get_json() or {})
            elif request.form:
                request.form = sanitize_input(dict(request.form))
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def validate_file_upload(allowed_extensions=None, max_size=None):
    """
    Decorator para validar upload de arquivos
    
    Args:
        allowed_extensions: Lista de extensões permitidas
        max_size: Tamanho máximo em bytes
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'file' not in request.files:
                return jsonify({'error': 'Nenhum arquivo enviado'}), 400
            
            file = request.files['file']
            
            if file.filename == '':
                return jsonify({'error': 'Nome do arquivo vazio'}), 400
            
            # Validar extensão
            if allowed_extensions:
                if '.' not in file.filename or \
                   file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
                    return jsonify({
                        'error': f'Extensão não permitida. Use: {", ".join(allowed_extensions)}'
                    }), 400
            
            # Validar tamanho
            if max_size:
                file.seek(0, 2)  # Ir para o final do arquivo
                file_size = file.tell()
                file.seek(0)  # Voltar para o início
                
                if file_size > max_size:
                    return jsonify({
                        'error': f'Arquivo muito grande. Máximo: {max_size} bytes'
                    }), 400
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator
