#!/usr/bin/env python3
"""
Script para executar a aplicação Flask do Projeto Aduaneiro
"""

from app import app, db

if __name__ == '__main__':
    with app.app_context():
        # Criar todas as tabelas do banco de dados
        db.create_all()
        
        # Verificar se existe usuário admin
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
            print("✅ Usuário administrador criado:")
            print("   Email: admin@teste.com")
            print("   Senha: 1234")
    
    print("🚀 Iniciando servidor Flask...")
    print("📱 Acesse: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)

