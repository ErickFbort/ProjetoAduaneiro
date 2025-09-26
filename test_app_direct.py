#!/usr/bin/env python3
"""
Teste direto da aplicação Flask
"""

from app import app, db, User

def test_app():
    """Testa a aplicação diretamente"""
    with app.test_client() as client:
        print("🧪 Testando aplicação Flask...")
        
        # Testar página de login
        response = client.get('/login')
        print(f"✅ Login: {response.status_code}")
        
        # Testar página de cadastros (deve redirecionar)
        response = client.get('/cadastros')
        print(f"✅ Cadastros: {response.status_code}")
        
        # Testar rota de debug
        response = client.get('/cadastros-debug')
        print(f"✅ Debug: {response.status_code}")
        
        # Testar login
        response = client.post('/login', data={
            'email': 'admin@teste.com',
            'password': '1234'
        }, follow_redirects=True)
        print(f"✅ Login POST: {response.status_code}")
        
        # Testar cadastros após login
        response = client.get('/cadastros')
        print(f"✅ Cadastros após login: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Página de cadastros carregou com sucesso!")
            # Verificar se há conteúdo
            content = response.get_data(as_text=True)
            if 'Cadastro de Usuário' in content:
                print("✅ Título encontrado na página")
            if 'ADM' in content:
                print("✅ Dados de usuário encontrados")
            else:
                print("❌ Dados de usuário não encontrados")
        else:
            print(f"❌ Erro na página de cadastros: {response.status_code}")

if __name__ == '__main__':
    test_app()
