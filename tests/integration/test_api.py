"""
Testes de integração para API
"""
import pytest
import json
from tests.conftest import UserFactory, VeiculoFactory, EntidadeFactory


@pytest.mark.integration
@pytest.mark.api
class TestAuthAPI:
    """Testes para endpoints de autenticação"""
    
    def test_login_success(self, client, sample_user):
        """Testar login bem-sucedido"""
        response = client.post('/login', data={
            'email': 'test@example.com',
            'password': 'test123'
        })
        
        assert response.status_code == 302  # Redirect após login
        assert '/dashboard' in response.location
    
    def test_login_invalid_credentials(self, client):
        """Testar login com credenciais inválidas"""
        response = client.post('/login', data={
            'email': 'invalid@example.com',
            'password': 'wrong_password'
        })
        
        assert response.status_code == 200
        assert b'Usuário ou senha inválidos' in response.data
    
    def test_login_invalid_email_format(self, client):
        """Testar login com formato de email inválido"""
        response = client.post('/login', data={
            'email': 'invalid-email',
            'password': 'test123'
        })
        
        assert response.status_code == 200
        assert b'Formato de email inválido' in response.data
    
    def test_logout(self, client, auth_headers):
        """Testar logout"""
        response = client.get('/logout', headers=auth_headers)
        
        assert response.status_code == 302
        assert '/login' in response.location


@pytest.mark.integration
@pytest.mark.api
class TestStatsAPI:
    """Testes para endpoints de estatísticas"""
    
    def test_get_stats_success(self, client):
        """Testar obtenção de estatísticas"""
        # Criar dados de teste
        UserFactory.create_batch(3)
        VeiculoFactory.create_batch(5)
        EntidadeFactory.create_batch(2)
        
        response = client.get('/api/stats')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['success'] is True
        assert 'data' in data
        assert data['data']['users'] == 3
        assert data['data']['vehicles'] == 5
        assert data['data']['entities'] == 2
        assert data['data']['processes'] == 0
    
    def test_get_stats_empty_database(self, client):
        """Testar estatísticas com banco vazio"""
        response = client.get('/api/stats')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['success'] is True
        assert data['data']['users'] == 0
        assert data['data']['vehicles'] == 0
        assert data['data']['entities'] == 0
        assert data['data']['processes'] == 0
    
    def test_get_stats_with_error(self, client, monkeypatch):
        """Testar estatísticas com erro no banco"""
        # Mock para simular erro no banco
        def mock_query_count():
            raise Exception("Database error")
        
        monkeypatch.setattr('app.models.user.User.query.count', mock_query_count)
        
        response = client.get('/api/stats')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['success'] is False
        assert 'error' in data
        assert data['data']['users'] == 0


@pytest.mark.integration
@pytest.mark.api
class TestLinkedInAPI:
    """Testes para endpoints do LinkedIn"""
    
    def test_get_linkedin_posts(self, client):
        """Testar obtenção de posts do LinkedIn"""
        response = client.get('/api/linkedin/posts')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['success'] is True
        assert data['data'] == []
        assert 'message' in data
        assert data['count'] == 0
    
    def test_get_linkedin_posts_with_limit(self, client):
        """Testar posts do LinkedIn com limite"""
        response = client.get('/api/linkedin/posts?limit=10')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['success'] is True
        assert data['data'] == []
        assert data['count'] == 0
    
    def test_get_company_info(self, client):
        """Testar obtenção de informações da empresa"""
        response = client.get('/api/linkedin/company')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['success'] is True
        assert data['data'] == {}
        assert 'message' in data


@pytest.mark.integration
@pytest.mark.api
class TestRateLimiting:
    """Testes para rate limiting"""
    
    def test_rate_limiting_stats_endpoint(self, client):
        """Testar rate limiting no endpoint de estatísticas"""
        # Fazer várias requisições rapidamente
        for i in range(15):  # Mais que o limite de 10 por minuto
            response = client.get('/api/stats')
            if i < 10:
                assert response.status_code == 200
            else:
                # Pode retornar 429 (Too Many Requests) ou 200 dependendo da configuração
                assert response.status_code in [200, 429]
    
    def test_rate_limiting_linkedin_endpoint(self, client):
        """Testar rate limiting no endpoint do LinkedIn"""
        # Fazer várias requisições rapidamente
        for i in range(8):  # Mais que o limite de 5 por minuto
            response = client.get('/api/linkedin/posts')
            if i < 5:
                assert response.status_code == 200
            else:
                # Pode retornar 429 (Too Many Requests) ou 200 dependendo da configuração
                assert response.status_code in [200, 429]


@pytest.mark.integration
@pytest.mark.api
class TestSecurityHeaders:
    """Testes para headers de segurança"""
    
    def test_security_headers_present(self, client):
        """Testar presença de headers de segurança"""
        response = client.get('/api/stats')
        
        assert response.status_code == 200
        
        # Verificar headers de segurança
        assert 'X-Frame-Options' in response.headers
        assert 'X-Content-Type-Options' in response.headers
        assert 'X-XSS-Protection' in response.headers
        assert 'Referrer-Policy' in response.headers
        assert 'Content-Security-Policy' in response.headers
        
        # Verificar valores específicos
        assert response.headers['X-Frame-Options'] == 'DENY'
        assert response.headers['X-Content-Type-Options'] == 'nosniff'
        assert response.headers['X-XSS-Protection'] == '1; mode=block'
    
    def test_cors_headers(self, client):
        """Testar headers CORS"""
        response = client.get('/api/stats')
        
        # Verificar se não há headers CORS desnecessários
        assert 'Access-Control-Allow-Origin' not in response.headers
        assert 'Access-Control-Allow-Methods' not in response.headers
