#!/usr/bin/env python3
"""
Script de teste para o Projeto Aduaneiro
"""

import unittest
from app import app, db, User
from flask import url_for

class TestProjetoAduaneiro(unittest.TestCase):
    """Testes para a aplicação"""
    
    def setUp(self):
        """Configuração para cada teste"""
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['WTF_CSRF_ENABLED'] = False
        
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        
        db.create_all()
    
    def tearDown(self):
        """Limpeza após cada teste"""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()
    
    def test_home_redirect(self):
        """Testa se a página inicial redireciona para login"""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 302)
    
    def test_login_page(self):
        """Testa se a página de login carrega"""
        response = self.app.get('/login')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Login', response.data)
    
    def test_user_creation(self):
        """Testa criação de usuário"""
        user = User(
            name='Teste',
            cpf='123.456.789-00',
            email='teste@teste.com',
            status='active'
        )
        user.set_password('123456')
        
        db.session.add(user)
        db.session.commit()
        
        # Verificar se o usuário foi criado
        created_user = User.query.filter_by(email='teste@teste.com').first()
        self.assertIsNotNone(created_user)
        self.assertEqual(created_user.name, 'Teste')
        self.assertTrue(created_user.check_password('123456'))
    
    def test_password_hashing(self):
        """Testa se as senhas são hashadas corretamente"""
        user = User(
            name='Teste',
            cpf='123.456.789-00',
            email='teste@teste.com'
        )
        user.set_password('123456')
        
        # Verificar se a senha não está em texto plano
        self.assertNotEqual(user.password_hash, '123456')
        self.assertTrue(user.check_password('123456'))
        self.assertFalse(user.check_password('senha_errada'))

def run_tests():
    """Executa todos os testes"""
    print("🧪 Executando testes do Projeto Aduaneiro...")
    print("=" * 50)
    
    # Configurar o test runner
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(TestProjetoAduaneiro)
    
    # Executar os testes
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Mostrar resultado
    if result.wasSuccessful():
        print("\n✅ Todos os testes passaram!")
        return True
    else:
        print(f"\n❌ {len(result.failures)} falha(s) e {len(result.errors)} erro(s)")
        return False

if __name__ == '__main__':
    run_tests()


