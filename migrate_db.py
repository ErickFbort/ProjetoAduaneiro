#!/usr/bin/env python3
"""
Script para migrar o banco de dados com as novas colunas
"""

from app import app, db, User
from werkzeug.security import generate_password_hash

def migrate_database():
    """Migra o banco de dados para incluir as novas colunas"""
    with app.app_context():
        print("🔄 Iniciando migração do banco de dados...")
        
        # Recriar todas as tabelas
        db.drop_all()
        db.create_all()
        
        # Criar usuário admin com novos campos
        admin = User(
            name='ADM',
            lastname='Sistema',
            cpf='000.000.000-00',
            email='admin@teste.com',
            status='active',
            group='Paclog ADM',
            permissions='["all"]'
        )
        admin.set_password('1234')
        db.session.add(admin)
        
        # Criar alguns usuários de exemplo
        users_example = [
            {
                'name': 'João',
                'lastname': 'da Silva',
                'cpf': '123.456.789-00',
                'email': 'joao.silva@email.com',
                'group': 'Paclog Operacional',
                'permissions': '["visualizar-processo", "editar-processo"]'
            },
            {
                'name': 'Maria',
                'lastname': 'Santos',
                'cpf': '987.654.321-00',
                'email': 'maria.santos@email.com',
                'group': 'Paclog Faturamento',
                'permissions': '["visualizar-processo", "cadastrar-processo"]'
            },
            {
                'name': 'Pedro',
                'lastname': 'Oliveira',
                'cpf': '456.789.123-00',
                'email': 'pedro.oliveira@email.com',
                'group': 'Paclog ADM',
                'permissions': '["all"]'
            }
        ]
        
        for user_data in users_example:
            user = User(
                name=user_data['name'],
                lastname=user_data['lastname'],
                cpf=user_data['cpf'],
                email=user_data['email'],
                status='active',
                group=user_data['group'],
                permissions=user_data['permissions']
            )
            user.set_password('123456')
            db.session.add(user)
        
        db.session.commit()
        
        print("✅ Migração concluída com sucesso!")
        print("👤 Usuários criados:")
        print("   - admin@teste.com (Paclog ADM)")
        print("   - joao.silva@email.com (Paclog Operacional)")
        print("   - maria.santos@email.com (Paclog Faturamento)")
        print("   - pedro.oliveira@email.com (Paclog ADM)")
        print("🔑 Senhas padrão: 1234 (admin) / 123456 (outros)")

if __name__ == '__main__':
    migrate_database()
