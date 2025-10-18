"""
Validação e sanitização de entrada
"""
import re
import bleach
from typing import Any, Dict, List, Optional
from flask import request, jsonify
from wtforms import Form, StringField, EmailField, IntegerField, TextAreaField
from wtforms.validators import DataRequired, Email, Length, NumberRange, Optional as OptionalValidator
from wtforms.validators import ValidationError

class BaseForm(Form):
    """Formulário base com validações comuns"""
    
    def validate_email(self, field):
        """Validação customizada de email"""
        if field.data:
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, field.data):
                raise ValidationError('Formato de email inválido')
    
    def validate_phone(self, field):
        """Validação customizada de telefone"""
        if field.data:
            phone_pattern = r'^[\d\s\(\)\-\+]+$'
            if not re.match(phone_pattern, field.data):
                raise ValidationError('Formato de telefone inválido')

class UserForm(BaseForm):
    """Formulário para validação de usuários"""
    name = StringField('Nome', validators=[
        DataRequired(message='Nome é obrigatório'),
        Length(min=2, max=100, message='Nome deve ter entre 2 e 100 caracteres')
    ])
    email = EmailField('Email', validators=[
        DataRequired(message='Email é obrigatório'),
        Email(message='Email inválido'),
        Length(max=255, message='Email muito longo')
    ])
    phone = StringField('Telefone', validators=[
        OptionalValidator(),
        Length(max=20, message='Telefone muito longo')
    ])

class VehicleForm(BaseForm):
    """Formulário para validação de veículos"""
    placa = StringField('Placa', validators=[
        DataRequired(message='Placa é obrigatória'),
        Length(min=7, max=8, message='Placa deve ter 7 ou 8 caracteres')
    ])
    tipo = StringField('Tipo', validators=[
        DataRequired(message='Tipo é obrigatório'),
        Length(max=50, message='Tipo muito longo')
    ])
    marca = StringField('Marca', validators=[
        OptionalValidator(),
        Length(max=50, message='Marca muito longa')
    ])
    modelo = StringField('Modelo', validators=[
        OptionalValidator(),
        Length(max=50, message='Modelo muito longo')
    ])

class EntityForm(BaseForm):
    """Formulário para validação de entidades"""
    nome = StringField('Nome', validators=[
        DataRequired(message='Nome é obrigatório'),
        Length(min=2, max=200, message='Nome deve ter entre 2 e 200 caracteres')
    ])
    cnpj = StringField('CNPJ', validators=[
        DataRequired(message='CNPJ é obrigatório'),
        Length(min=14, max=18, message='CNPJ deve ter entre 14 e 18 caracteres')
    ])
    tipo = StringField('Tipo', validators=[
        DataRequired(message='Tipo é obrigatório'),
        Length(max=50, message='Tipo muito longo')
    ])

def validate_input(data: Dict[str, Any], form_class: type) -> tuple[bool, Dict[str, Any], List[str]]:
    """
    Valida dados de entrada usando formulários WTForms
    
    Args:
        data: Dados a serem validados
        form_class: Classe do formulário para validação
    
    Returns:
        tuple: (is_valid, validated_data, errors)
    """
    form = form_class(data=data)
    
    if form.validate():
        return True, form.data, []
    else:
        errors = []
        for field, field_errors in form.errors.items():
            for error in field_errors:
                errors.append(f"{field}: {error}")
        return False, {}, errors

def sanitize_input(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Sanitiza dados de entrada removendo HTML malicioso
    
    Args:
        data: Dados a serem sanitizados
    
    Returns:
        dict: Dados sanitizados
    """
    sanitized = {}
    
    # Tags HTML permitidas
    allowed_tags = ['b', 'i', 'u', 'em', 'strong', 'p', 'br']
    allowed_attributes = {}
    
    for key, value in data.items():
        if isinstance(value, str):
            # Sanitizar strings removendo HTML malicioso
            sanitized[key] = bleach.clean(
                value, 
                tags=allowed_tags, 
                attributes=allowed_attributes,
                strip=True
            )
        elif isinstance(value, (int, float, bool)):
            # Manter números e booleanos como estão
            sanitized[key] = value
        elif isinstance(value, list):
            # Sanitizar listas recursivamente
            sanitized[key] = [sanitize_input({'item': item})['item'] if isinstance(item, str) else item for item in value]
        elif isinstance(value, dict):
            # Sanitizar dicionários recursivamente
            sanitized[key] = sanitize_input(value)
        else:
            # Manter outros tipos como estão
            sanitized[key] = value
    
    return sanitized

def validate_json_input(required_fields: List[str] = None, optional_fields: List[str] = None) -> Dict[str, Any]:
    """
    Valida entrada JSON da requisição
    
    Args:
        required_fields: Campos obrigatórios
        optional_fields: Campos opcionais
    
    Returns:
        dict: Dados validados e sanitizados
    """
    if not request.is_json:
        return {'error': 'Content-Type deve ser application/json'}, 400
    
    data = request.get_json()
    if not data:
        return {'error': 'Dados JSON inválidos'}, 400
    
    # Validar campos obrigatórios
    if required_fields:
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return {'error': f'Campos obrigatórios ausentes: {", ".join(missing_fields)}'}, 400
    
    # Validar campos permitidos
    all_fields = (required_fields or []) + (optional_fields or [])
    if all_fields:
        invalid_fields = [field for field in data.keys() if field not in all_fields]
        if invalid_fields:
            return {'error': f'Campos inválidos: {", ".join(invalid_fields)}'}, 400
    
    # Sanitizar dados
    sanitized_data = sanitize_input(data)
    
    return sanitized_data, 200

def validate_email(email: str) -> bool:
    """Valida formato de email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_cnpj(cnpj: str) -> bool:
    """Valida formato de CNPJ"""
    # Remove caracteres não numéricos
    cnpj = re.sub(r'[^0-9]', '', cnpj)
    
    if len(cnpj) != 14:
        return False
    
    # Verifica se todos os dígitos são iguais
    if cnpj == cnpj[0] * 14:
        return False
    
    # Validação do algoritmo do CNPJ
    def calculate_digit(cnpj_digits, weights):
        sum_result = sum(int(digit) * weight for digit, weight in zip(cnpj_digits, weights))
        remainder = sum_result % 11
        return 0 if remainder < 2 else 11 - remainder
    
    # Primeiro dígito verificador
    weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    digit1 = calculate_digit(cnpj[:12], weights1)
    
    # Segundo dígito verificador
    weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    digit2 = calculate_digit(cnpj[:13], weights2)
    
    return cnpj[12] == str(digit1) and cnpj[13] == str(digit2)

def validate_placa(placa: str) -> bool:
    """Valida formato de placa de veículo"""
    # Remove espaços e converte para maiúsculo
    placa = placa.replace(' ', '').upper()
    
    # Padrão antigo: 3 letras + 4 números
    pattern_old = r'^[A-Z]{3}[0-9]{4}$'
    # Padrão novo: 3 letras + 1 número + 1 letra + 2 números
    pattern_new = r'^[A-Z]{3}[0-9][A-Z][0-9]{2}$'
    
    return bool(re.match(pattern_old, placa) or re.match(pattern_new, placa))
