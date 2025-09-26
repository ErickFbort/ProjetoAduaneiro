#!/usr/bin/env python3
"""
Script para testar a rota de cadastros
"""

import requests
import json

def test_cadastros():
    """Testa a rota de cadastros"""
    base_url = "http://localhost:5000"
    
    print("🧪 Testando rota de cadastros...")
    
    try:
        # Testar acesso à página de cadastros
        response = requests.get(f"{base_url}/cadastros", allow_redirects=False)
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ Página de cadastros carregando corretamente!")
            print(f"Tamanho da resposta: {len(response.text)} bytes")
        elif response.status_code == 302:
            print("⚠️ Redirecionamento detectado")
            print(f"Redirecionamento para: {response.headers.get('Location', 'N/A')}")
        else:
            print(f"❌ Erro na página de cadastros: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Não foi possível conectar à aplicação")
        print("💡 Certifique-se de que a aplicação está rodando em http://localhost:5000")
    except Exception as e:
        print(f"❌ Erro ao testar cadastros: {e}")

if __name__ == '__main__':
    test_cadastros()
