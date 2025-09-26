#!/usr/bin/env python3
"""
Script de inicialização rápida para o Projeto Aduaneiro
"""

import os
import sys
import subprocess
import webbrowser
import time
from threading import Timer

def open_browser():
    """Abre o navegador após 2 segundos"""
    time.sleep(2)
    webbrowser.open('http://localhost:5000')

def main():
    print("🚀 Iniciando Projeto Aduaneiro...")
    print("=" * 50)
    
    # Verificar se as dependências estão instaladas
    try:
        import flask
        import flask_sqlalchemy
        import flask_login
        print("✅ Dependências encontradas!")
    except ImportError as e:
        print(f"❌ Dependência não encontrada: {e}")
        print("💡 Execute: pip install -r requirements.txt")
        return False
    
    # Criar diretórios necessários
    os.makedirs('static/uploads', exist_ok=True)
    
    # Abrir navegador automaticamente
    Timer(2.0, open_browser).start()
    
    print("🌐 Aplicação será aberta em: http://localhost:5000")
    print("👤 Credenciais padrão:")
    print("   Email: admin@teste.com")
    print("   Senha: 1234")
    print("\n⏹️  Pressione Ctrl+C para parar o servidor")
    print("=" * 50)
    
    try:
        # Executar a aplicação
        from app import app, db
        with app.app_context():
            db.create_all()
            
            # Criar usuário admin se não existir
            from app import User
            if not User.query.filter_by(email='admin@teste.com').first():
                admin = User(
                    name='ADM',
                    cpf='000.000.000-00',
                    email='admin@teste.com',
                    status='active',
                    permissions='["all"]'
                )
                admin.set_password('1234')
                db.session.add(admin)
                db.session.commit()
                print("✅ Usuário administrador criado!")
        
        app.run(debug=True, host='0.0.0.0', port=5000)
        
    except KeyboardInterrupt:
        print("\n👋 Servidor parado pelo usuário")
    except Exception as e:
        print(f"❌ Erro ao iniciar servidor: {e}")
        return False
    
    return True

if __name__ == '__main__':
    main()

