"""
Testes E2E para dashboard
"""
import pytest
from playwright.sync_api import Page, expect


@pytest.mark.e2e
class TestDashboardE2E:
    """Testes E2E para dashboard"""
    
    def test_dashboard_loads_successfully(self, page: Page, live_server):
        """Testar carregamento do dashboard"""
        page.goto(f"{live_server.url}/dashboard")
        
        # Verificar se redirecionou para login
        expect(page).to_have_url(f"{live_server.url}/login")
        
        # Fazer login
        page.fill('input[name="email"]', 'admin@teste.com')
        page.fill('input[name="password"]', 'admin123')
        page.click('button[type="submit"]')
        
        # Verificar se foi redirecionado para dashboard
        expect(page).to_have_url(f"{live_server.url}/dashboard")
        
        # Verificar elementos principais do dashboard
        expect(page.locator('h1')).to_contain_text('Bem-vindo(a)')
        expect(page.locator('.stat-card')).to_be_visible()
    
    def test_dashboard_statistics_display(self, page: Page, live_server):
        """Testar exibição de estatísticas no dashboard"""
        # Login
        page.goto(f"{live_server.url}/login")
        page.fill('input[name="email"]', 'admin@teste.com')
        page.fill('input[name="password"]', 'admin123')
        page.click('button[type="submit"]')
        
        # Aguardar carregamento das estatísticas
        page.wait_for_timeout(2000)
        
        # Verificar se os cards de estatísticas estão visíveis
        stats_cards = page.locator('.stat-card')
        expect(stats_cards).to_have_count(4)  # Usuários, Veículos, Entidades, Processos
        
        # Verificar se os valores não são NaN
        for i in range(4):
            card = stats_cards.nth(i)
            value = card.locator('h3').text_content()
            assert value != 'NaN'
            assert value.isdigit() or value == '0'
    
    def test_dashboard_navigation(self, page: Page, live_server):
        """Testar navegação no dashboard"""
        # Login
        page.goto(f"{live_server.url}/login")
        page.fill('input[name="email"]', 'admin@teste.com')
        page.fill('input[name="password"]', 'admin123')
        page.click('button[type="submit"]')
        
        # Testar navegação para diferentes seções
        nav_items = [
            ('Cadastros', '/cadastros'),
            ('Relatórios', '/relatorios'),
            ('Web Cliente', '/web-clientes'),
            ('Faturamento', '/faturamento')
        ]
        
        for nav_text, expected_url in nav_items:
            # Clicar no item de navegação
            page.click(f'text={nav_text}')
            
            # Verificar se foi redirecionado
            expect(page).to_have_url(f"{live_server.url}{expected_url}")
            
            # Voltar para dashboard
            page.click('text=Home')
            expect(page).to_have_url(f"{live_server.url}/dashboard")
    
    def test_dashboard_responsive_design(self, page: Page, live_server):
        """Testar design responsivo do dashboard"""
        # Login
        page.goto(f"{live_server.url}/login")
        page.fill('input[name="email"]', 'admin@teste.com')
        page.fill('input[name="password"]', 'admin123')
        page.click('button[type="submit"]')
        
        # Testar diferentes tamanhos de tela
        viewports = [
            (1920, 1080),  # Desktop
            (1024, 768),   # Tablet
            (375, 667)     # Mobile
        ]
        
        for width, height in viewports:
            page.set_viewport_size({"width": width, "height": height})
            page.wait_for_timeout(500)
            
            # Verificar se elementos principais estão visíveis
            expect(page.locator('.sidebar')).to_be_visible()
            expect(page.locator('.main-content')).to_be_visible()
            
            # Verificar se não há overflow horizontal
            body_width = page.evaluate("document.body.scrollWidth")
            viewport_width = page.viewport_size["width"]
            assert body_width <= viewport_width + 10  # Margem de erro
    
    def test_dashboard_logout(self, page: Page, live_server):
        """Testar logout do dashboard"""
        # Login
        page.goto(f"{live_server.url}/login")
        page.fill('input[name="email"]', 'admin@teste.com')
        page.fill('input[name="password"]', 'admin123')
        page.click('button[type="submit"]')
        
        # Fazer logout
        page.click('text=Sair')
        
        # Verificar se foi redirecionado para login
        expect(page).to_have_url(f"{live_server.url}/login")
        
        # Tentar acessar dashboard sem login
        page.goto(f"{live_server.url}/dashboard")
        expect(page).to_have_url(f"{live_server.url}/login")


@pytest.mark.e2e
class TestLoginE2E:
    """Testes E2E para login"""
    
    def test_login_success(self, page: Page, live_server):
        """Testar login bem-sucedido"""
        page.goto(f"{live_server.url}/login")
        
        # Preencher formulário
        page.fill('input[name="email"]', 'admin@teste.com')
        page.fill('input[name="password"]', 'admin123')
        
        # Submeter formulário
        page.click('button[type="submit"]')
        
        # Verificar redirecionamento
        expect(page).to_have_url(f"{live_server.url}/dashboard")
    
    def test_login_invalid_credentials(self, page: Page, live_server):
        """Testar login com credenciais inválidas"""
        page.goto(f"{live_server.url}/login")
        
        # Preencher com credenciais inválidas
        page.fill('input[name="email"]', 'invalid@example.com')
        page.fill('input[name="password"]', 'wrongpassword')
        
        # Submeter formulário
        page.click('button[type="submit"]')
        
        # Verificar que permaneceu na página de login
        expect(page).to_have_url(f"{live_server.url}/login")
        
        # Verificar mensagem de erro
        expect(page.locator('.alert, .error, [class*="error"]')).to_be_visible()
    
    def test_login_form_validation(self, page: Page, live_server):
        """Testar validação do formulário de login"""
        page.goto(f"{live_server.url}/login")
        
        # Tentar submeter formulário vazio
        page.click('button[type="submit"]')
        
        # Verificar validação HTML5
        email_input = page.locator('input[name="email"]')
        password_input = page.locator('input[name="password"]')
        
        expect(email_input).to_have_attribute('required')
        expect(password_input).to_have_attribute('required')
    
    def test_login_csrf_protection(self, page: Page, live_server):
        """Testar proteção CSRF no login"""
        page.goto(f"{live_server.url}/login")
        
        # Verificar se há token CSRF
        csrf_token = page.locator('input[name="csrf_token"]')
        expect(csrf_token).to_be_visible()
        expect(csrf_token).to_have_attribute('value')


@pytest.mark.e2e
class TestAPIE2E:
    """Testes E2E para API"""
    
    def test_api_stats_endpoint(self, page: Page, live_server):
        """Testar endpoint de estatísticas via API"""
        # Fazer requisição para API
        response = page.request.get(f"{live_server.url}/api/stats")
        
        # Verificar resposta
        assert response.status == 200
        
        data = response.json()
        assert data['success'] is True
        assert 'data' in data
        assert 'users' in data['data']
        assert 'vehicles' in data['data']
        assert 'entities' in data['data']
        assert 'processes' in data['data']
    
    def test_api_linkedin_endpoints(self, page: Page, live_server):
        """Testar endpoints do LinkedIn"""
        # Testar posts
        posts_response = page.request.get(f"{live_server.url}/api/linkedin/posts")
        assert posts_response.status == 200
        
        posts_data = posts_response.json()
        assert posts_data['success'] is True
        assert posts_data['data'] == []
        
        # Testar company info
        company_response = page.request.get(f"{live_server.url}/api/linkedin/company")
        assert company_response.status == 200
        
        company_data = company_response.json()
        assert company_data['success'] is True
        assert company_data['data'] == {}
    
    def test_api_security_headers(self, page: Page, live_server):
        """Testar headers de segurança da API"""
        response = page.request.get(f"{live_server.url}/api/stats")
        
        # Verificar headers de segurança
        headers = response.headers
        
        assert 'x-frame-options' in headers
        assert 'x-content-type-options' in headers
        assert 'x-xss-protection' in headers
        assert 'referrer-policy' in headers
        assert 'content-security-policy' in headers
        
        assert headers['x-frame-options'] == 'DENY'
        assert headers['x-content-type-options'] == 'nosniff'
        assert headers['x-xss-protection'] == '1; mode=block'
