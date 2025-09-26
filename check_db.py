#!/usr/bin/env python3
"""
Script para verificar o banco de dados
"""

from app import app, db, User

def check_database():
    """Verifica o estado do banco de dados"""
    with app.app_context():
        try:
            # Verificar se a tabela existe
            users = User.query.all()
            print(f"✅ Banco de dados funcionando!")
            print(f"📊 Total de usuários: {len(users)}")
            
            for user in users:
                print(f"👤 {user.name} {user.lastname} - {user.email} - {user.group}")
                
        except Exception as e:
            print(f"❌ Erro no banco de dados: {e}")

if __name__ == '__main__':
    check_database()
