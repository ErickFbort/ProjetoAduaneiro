#!/usr/bin/env python3
"""
Script para testar o logout
"""

import requests

def test_logout():
    """Testa o logout da aplicação"""
    base_url = "http://localhost:5000"
    
    print("🧪 Testando logout da aplicação...")
    
    try:
        # Testar acesso à página de logout
        response = requests.get(f"{base_url}/logout", allow_redirects=False)
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 302:
            print("✅ Logout redirecionando corretamente!")
            print(f"Redirecionamento para: {response.headers.get('Location', 'N/A')}")
        else:
            print("❌ Logout não está funcionando corretamente")
            
    except requests.exceptions.ConnectionError:
        print("❌ Não foi possível conectar à aplicação")
        print("💡 Certifique-se de que a aplicação está rodando em http://localhost:5000")
    except Exception as e:
        print(f"❌ Erro ao testar logout: {e}")

if __name__ == '__main__':
    test_logout()
