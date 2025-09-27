#!/usr/bin/env python3
"""
Teste de imports da nova estrutura
"""

try:
    print("Testando imports...")
    
    print("1. Importando app...")
    from app import create_app, db
    print("   OK: app importado")
    
    print("2. Criando aplicação...")
    app = create_app()
    print("   OK: aplicação criada")
    
    print("3. Testando contexto da aplicação...")
    with app.app_context():
        print("   OK: contexto funcionando")
        
        print("4. Testando criação de tabelas...")
        db.create_all()
        print("   OK: tabelas criadas")
        
        print("5. Testando modelos...")
        from app.models.user import User
        from app.models.veiculo import Veiculo
        from app.models.entidade import Entidade
        print("   OK: modelos importados")
        
        print("6. Testando rotas...")
        from app.routes.auth import auth_bp
        from app.routes.main import main_bp
        from app.routes.cadastros import cadastros_bp
        print("   OK: rotas importadas")
        
        print("7. Testando APIs...")
        from app.api.users import users_bp
        from app.api.veiculos import veiculos_bp
        from app.api.entidades import entidades_bp
        print("   OK: APIs importadas")
    
    print("\n🎉 TODOS OS IMPORTS FUNCIONANDO!")
    
except Exception as e:
    print(f"ERRO: {e}")
    import traceback
    traceback.print_exc()
