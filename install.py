#!/usr/bin/env python3
"""
Script de instalação para o Projeto Aduaneiro
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Executa um comando e mostra o resultado"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} - Concluído!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao {description.lower()}: {e}")
        print(f"   Saída: {e.stdout}")
        print(f"   Erro: {e.stderr}")
        return False

def main():
    print("🚀 Instalador do Projeto Aduaneiro")
    print("=" * 50)
    
    # Verificar se Python está instalado
    print("🔍 Verificando Python...")
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ é necessário!")
        print(f"   Versão atual: {sys.version}")
        return False
    
    print(f"✅ Python {sys.version.split()[0]} detectado!")
    
    # Criar ambiente virtual
    if not os.path.exists("venv"):
        if not run_command("python -m venv venv", "Criando ambiente virtual"):
            return False
    else:
        print("✅ Ambiente virtual já existe!")
    
    # Ativar ambiente virtual e instalar dependências
    if os.name == 'nt':  # Windows
        pip_command = "venv\\Scripts\\pip"
        python_command = "venv\\Scripts\\python"
    else:  # Linux/Mac
        pip_command = "venv/bin/pip"
        python_command = "venv/bin/python"
    
    # Atualizar pip
    if not run_command(f"{pip_command} install --upgrade pip", "Atualizando pip"):
        return False
    
    # Instalar dependências
    if not run_command(f"{pip_command} install -r requirements.txt", "Instalando dependências"):
        return False
    
    print("\n🎉 Instalação concluída com sucesso!")
    print("\n📋 Para executar a aplicação:")
    print("   python run.py")
    print("\n🌐 Acesse: http://localhost:5000")
    print("👤 Credenciais padrão:")
    print("   Email: admin@teste.com")
    print("   Senha: 1234")
    
    return True

if __name__ == "__main__":
    main()


