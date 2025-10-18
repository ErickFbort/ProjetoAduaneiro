"""
Testes unitários para utilitários
"""
import pytest
from app.security.input_validation import (
    validate_email, validate_cnpj, validate_plate, 
    sanitize_input, validate_json_input
)


@pytest.mark.unit
class TestInputValidation:
    """Testes para validação de entrada"""
    
    def test_validate_email_valid(self):
        """Testar validação de email válido"""
        valid_emails = [
            'test@example.com',
            'user.name@domain.co.uk',
            'admin+test@company.org',
            'user123@test-domain.com'
        ]
        
        for email in valid_emails:
            assert validate_email(email) is True
    
    def test_validate_email_invalid(self):
        """Testar validação de email inválido"""
        invalid_emails = [
            'invalid-email',
            '@domain.com',
            'user@',
            'user@domain',
            'user..name@domain.com',
            'user@domain..com'
        ]
        
        for email in invalid_emails:
            assert validate_email(email) is False
    
    def test_validate_cnpj_valid(self):
        """Testar validação de CNPJ válido"""
        valid_cnpjs = [
            '11.222.333/0001-81',
            '11222333000181',
            '12.345.678/0001-90'
        ]
        
        for cnpj in valid_cnpjs:
            assert validate_cnpj(cnpj) is True
    
    def test_validate_cnpj_invalid(self):
        """Testar validação de CNPJ inválido"""
        invalid_cnpjs = [
            '11.222.333/0001-80',  # Dígito verificador inválido
            '12345678901234',      # Muito longo
            '1234567890123',       # Muito curto
            '11.222.333/0001-8',   # Formato inválido
            '00000000000000'       # Todos zeros
        ]
        
        for cnpj in invalid_cnpjs:
            assert validate_cnpj(cnpj) is False
    
    def test_validate_plate_valid(self):
        """Testar validação de placa válida"""
        valid_plates = [
            'ABC-1234',
            'XYZ-9876',
            'ABC1234',
            'XYZ9876'
        ]
        
        for plate in valid_plates:
            assert validate_plate(plate) is True
    
    def test_validate_plate_invalid(self):
        """Testar validação de placa inválida"""
        invalid_plates = [
            'ABC-123',     # Muito curta
            'ABC-12345',   # Muito longa
            '123-ABCD',    # Formato inválido
            'ABC-12A4',    # Caractere inválido
            'AB-1234'      # Muito curta
        ]
        
        for plate in invalid_plates:
            assert validate_plate(plate) is False
    
    def test_sanitize_input(self):
        """Testar sanitização de entrada"""
        # Teste com HTML malicioso
        malicious_input = {
            'name': '<script>alert("xss")</script>João',
            'email': 'test@example.com',
            'description': 'Texto normal'
        }
        
        sanitized = sanitize_input(malicious_input)
        
        assert '<script>' not in sanitized['name']
        assert 'João' in sanitized['name']
        assert sanitized['email'] == 'test@example.com'
        assert sanitized['description'] == 'Texto normal'
    
    def test_sanitize_input_empty(self):
        """Testar sanitização de entrada vazia"""
        empty_input = {}
        sanitized = sanitize_input(empty_input)
        assert sanitized == {}
    
    def test_validate_json_input_valid(self):
        """Testar validação de JSON válido"""
        valid_json = {
            'name': 'João Silva',
            'email': 'joao@example.com',
            'age': 30
        }
        
        result = validate_json_input(valid_json, required_fields=['name', 'email'])
        assert result['valid'] is True
        assert 'errors' not in result
    
    def test_validate_json_input_missing_fields(self):
        """Testar validação de JSON com campos obrigatórios ausentes"""
        invalid_json = {
            'name': 'João Silva'
            # email ausente
        }
        
        result = validate_json_input(invalid_json, required_fields=['name', 'email'])
        assert result['valid'] is False
        assert 'email' in result['errors']
    
    def test_validate_json_input_invalid_types(self):
        """Testar validação de JSON com tipos inválidos"""
        invalid_json = {
            'name': 'João Silva',
            'email': 'joao@example.com',
            'age': 'trinta'  # Deveria ser número
        }
        
        result = validate_json_input(
            invalid_json, 
            required_fields=['name', 'email'],
            field_types={'age': int}
        )
        assert result['valid'] is False
        assert 'age' in result['errors']
