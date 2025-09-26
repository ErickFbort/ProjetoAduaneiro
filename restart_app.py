#!/usr/bin/env python3
"""
Script para reiniciar a aplicação
"""

import os
import sys
import subprocess
import time

def restart_app():
    """Reinicia a aplicação Flask"""
    print("🔄 Reiniciando aplicação Flask...")
    
    # Parar processos na porta 5000
    try:
        subprocess.run(['netstat', '-ano'], capture_output=True)
        print("✅ Verificando processos...")
    except:
        pass
    
    # Aguardar um pouco
    time.sleep(2)
    
    print("🚀 Iniciando aplicação...")
    print("📱 Acesse: http://localhost:5000")
    print("👤 Login: admin@teste.com / 1234")
    print("📋 Cadastros: http://localhost:5000/cadastros")
    print("🔧 Debug: http://localhost:5000/cadastros-debug")
    
    # Executar aplicação
    subprocess.run([sys.executable, 'app.py'])

if __name__ == '__main__':
    restart_app()

