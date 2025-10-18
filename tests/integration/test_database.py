"""
Testes de integração para banco de dados
"""
import pytest
from app import db
from app.models.user import User
from app.models.veiculo import Veiculo
from app.models.entidade import Entidade
from app.utils.database_optimization import (
    create_database_indexes, get_user_stats, 
    get_vehicle_stats, get_entity_stats
)


@pytest.mark.integration
@pytest.mark.database
class TestDatabaseOperations:
    """Testes para operações de banco de dados"""
    
    def test_user_crud_operations(self, app):
        """Testar operações CRUD de usuário"""
        with app.app_context():
            # Create
            user = User(
                name='Test User',
                email='test@example.com',
                password='hashed_password',
                group='admin',
                status='active'
            )
            db.session.add(user)
            db.session.commit()
            
            assert user.id is not None
            
            # Read
            found_user = User.query.get(user.id)
            assert found_user is not None
            assert found_user.name == 'Test User'
            assert found_user.email == 'test@example.com'
            
            # Update
            found_user.name = 'Updated User'
            db.session.commit()
            
            updated_user = User.query.get(user.id)
            assert updated_user.name == 'Updated User'
            
            # Delete
            db.session.delete(updated_user)
            db.session.commit()
            
            deleted_user = User.query.get(user.id)
            assert deleted_user is None
    
    def test_veiculo_crud_operations(self, app):
        """Testar operações CRUD de veículo"""
        with app.app_context():
            # Create
            veiculo = Veiculo(
                placa='ABC-1234',
                modelo='Ford Focus',
                cor='Branco',
                ano=2020,
                status='ativo'
            )
            db.session.add(veiculo)
            db.session.commit()
            
            assert veiculo.id is not None
            
            # Read
            found_veiculo = Veiculo.query.get(veiculo.id)
            assert found_veiculo is not None
            assert found_veiculo.placa == 'ABC-1234'
            assert found_veiculo.modelo == 'Ford Focus'
            
            # Update
            found_veiculo.cor = 'Azul'
            db.session.commit()
            
            updated_veiculo = Veiculo.query.get(veiculo.id)
            assert updated_veiculo.cor == 'Azul'
            
            # Delete
            db.session.delete(updated_veiculo)
            db.session.commit()
            
            deleted_veiculo = Veiculo.query.get(veiculo.id)
            assert deleted_veiculo is None
    
    def test_entidade_crud_operations(self, app):
        """Testar operações CRUD de entidade"""
        with app.app_context():
            # Create
            entidade = Entidade(
                nome='Empresa Teste',
                cnpj='12.345.678/0001-90',
                endereco='Rua Teste, 123',
                telefone='(11) 99999-9999',
                email='contato@empresa.com',
                status='ativo'
            )
            db.session.add(entidade)
            db.session.commit()
            
            assert entidade.id is not None
            
            # Read
            found_entidade = Entidade.query.get(entidade.id)
            assert found_entidade is not None
            assert found_entidade.nome == 'Empresa Teste'
            assert found_entidade.cnpj == '12.345.678/0001-90'
            
            # Update
            found_entidade.nome = 'Empresa Atualizada'
            db.session.commit()
            
            updated_entidade = Entidade.query.get(entidade.id)
            assert updated_entidade.nome == 'Empresa Atualizada'
            
            # Delete
            db.session.delete(updated_entidade)
            db.session.commit()
            
            deleted_entidade = Entidade.query.get(entidade.id)
            assert deleted_entidade is None


@pytest.mark.integration
@pytest.mark.database
class TestDatabaseOptimization:
    """Testes para otimizações de banco de dados"""
    
    def test_create_database_indexes(self, app):
        """Testar criação de índices"""
        with app.app_context():
            result = create_database_indexes()
            assert result is True
    
    def test_get_user_stats(self, app):
        """Testar estatísticas de usuários"""
        with app.app_context():
            # Criar usuários de teste
            UserFactory.create_batch(5, status='active')
            UserFactory.create_batch(2, status='blocked')
            UserFactory.create_batch(3, group='admin')
            UserFactory.create_batch(4, group='user')
            
            stats = get_user_stats()
            
            assert stats['total'] == 14
            assert stats['active'] == 5
            assert stats['blocked'] == 2
            assert len(stats['by_group']) == 2  # admin e user
    
    def test_get_vehicle_stats(self, app):
        """Testar estatísticas de veículos"""
        with app.app_context():
            # Criar veículos de teste
            VeiculoFactory.create_batch(8, status='ativo')
            VeiculoFactory.create_batch(2, status='inativo')
            
            stats = get_vehicle_stats()
            
            assert stats['total'] == 10
            assert stats['active'] == 8
            assert stats['inactive'] == 2
    
    def test_get_entity_stats(self, app):
        """Testar estatísticas de entidades"""
        with app.app_context():
            # Criar entidades de teste
            EntidadeFactory.create_batch(6, status='ativo')
            EntidadeFactory.create_batch(1, status='inativo')
            
            stats = get_entity_stats()
            
            assert stats['total'] == 7
            assert stats['active'] == 6
            assert stats['inactive'] == 1


@pytest.mark.integration
@pytest.mark.database
class TestDatabaseConstraints:
    """Testes para constraints de banco de dados"""
    
    def test_user_email_unique(self, app):
        """Testar constraint de email único"""
        with app.app_context():
            # Criar primeiro usuário
            user1 = User(
                name='User 1',
                email='test@example.com',
                password='password1',
                group='user',
                status='active'
            )
            db.session.add(user1)
            db.session.commit()
            
            # Tentar criar segundo usuário com mesmo email
            user2 = User(
                name='User 2',
                email='test@example.com',
                password='password2',
                group='user',
                status='active'
            )
            db.session.add(user2)
            
            # Deve falhar por email duplicado
            with pytest.raises(Exception):
                db.session.commit()
    
    def test_veiculo_placa_unique(self, app):
        """Testar constraint de placa única"""
        with app.app_context():
            # Criar primeiro veículo
            veiculo1 = Veiculo(
                placa='ABC-1234',
                modelo='Ford Focus',
                cor='Branco',
                ano=2020,
                status='ativo'
            )
            db.session.add(veiculo1)
            db.session.commit()
            
            # Tentar criar segundo veículo com mesma placa
            veiculo2 = Veiculo(
                placa='ABC-1234',
                modelo='Honda Civic',
                cor='Azul',
                ano=2021,
                status='ativo'
            )
            db.session.add(veiculo2)
            
            # Deve falhar por placa duplicada
            with pytest.raises(Exception):
                db.session.commit()
    
    def test_entidade_cnpj_unique(self, app):
        """Testar constraint de CNPJ único"""
        with app.app_context():
            # Criar primeira entidade
            entidade1 = Entidade(
                nome='Empresa 1',
                cnpj='12.345.678/0001-90',
                endereco='Rua 1',
                telefone='(11) 11111-1111',
                email='empresa1@test.com',
                status='ativo'
            )
            db.session.add(entidade1)
            db.session.commit()
            
            # Tentar criar segunda entidade com mesmo CNPJ
            entidade2 = Entidade(
                nome='Empresa 2',
                cnpj='12.345.678/0001-90',
                endereco='Rua 2',
                telefone='(11) 22222-2222',
                email='empresa2@test.com',
                status='ativo'
            )
            db.session.add(entidade2)
            
            # Deve falhar por CNPJ duplicado
            with pytest.raises(Exception):
                db.session.commit()
