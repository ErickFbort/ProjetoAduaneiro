#!/usr/bin/env python3
"""
Teste simples para verificar se a aplicação está funcionando
"""

import urllib.request
import urllib.error

def test_simple():
    """Teste simples da aplicação"""
    try:
        # Testar página de login
        response = urllib.request.urlopen('http://localhost:5000/login')
        print(f"✅ Login page: {response.getcode()}")
        
        # Testar página de cadastros (deve redirecionar para login)
        try:
            response = urllib.request.urlopen('http://localhost:5000/cadastros')
            print(f"✅ Cadastros page: {response.getcode()}")
        except urllib.error.HTTPError as e:
            if e.code == 302:
                print(f"✅ Cadastros redirecionando (esperado): {e.code}")
            else:
                print(f"❌ Erro inesperado em cadastros: {e.code}")
        
        # Testar rota de debug
        try:
            response = urllib.request.urlopen('http://localhost:5000/cadastros-debug')
            print(f"✅ Debug page: {response.getcode()}")
        except urllib.error.HTTPError as e:
            if e.code == 302:
                print(f"✅ Debug redirecionando (esperado): {e.code}")
            else:
                print(f"❌ Erro inesperado em debug: {e.code}")
                
    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == '__main__':
    test_simple()
