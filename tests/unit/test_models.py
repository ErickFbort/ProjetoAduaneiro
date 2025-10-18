"""
Testes unitários para modelos
"""
import pytest
from app.models.user import User
from app.models.veiculo import Veiculo
from app.models.entidade import Entidade
from werkzeug.security import check_password_hash


@pytest.mark.unit
class TestUserModel:
    """Testes para o modelo User"""
    
    def test_user_creation(self, sample_user):
        """Testar criação de usuário"""
        assert sample_user.name == 'Test User'
        assert sample_user.email == 'test@example.com'
        assert sample_user.group == 'admin'
        assert sample_user.status == 'active'
        assert sample_user.id is not None
    
    def test_user_password_hashing(self, sample_user):
        """Testar hash de senha"""
        assert check_password_hash(sample_user.password, 'test123')
        assert not check_password_hash(sample_user.password, 'wrong_password')
    
    def test_user_check_password(self, sample_user):
        """Testar verificação de senha"""
        assert sample_user.check_password('test123')
        assert not sample_user.check_password('wrong_password')
    
    def test_user_repr(self, sample_user):
        """Testar representação string do usuário"""
        expected = f"<User {sample_user.email}>"
        assert repr(sample_user) == expected
    
    def test_user_is_authenticated(self, sample_user):
        """Testar propriedade is_authenticated"""
        assert sample_user.is_authenticated is True
    
    def test_user_is_active(self, sample_user):
        """Testar propriedade is_active"""
        assert sample_user.is_active is True
        
        # Testar usuário bloqueado
        sample_user.status = 'blocked'
        assert sample_user.is_active is False
    
    def test_user_is_anonymous(self, sample_user):
        """Testar propriedade is_anonymous"""
        assert sample_user.is_anonymous is False
    
    def test_user_get_id(self, sample_user):
        """Testar método get_id"""
        assert sample_user.get_id() == str(sample_user.id)


@pytest.mark.unit
class TestVeiculoModel:
    """Testes para o modelo Veiculo"""
    
    def test_veiculo_creation(self, sample_veiculo):
        """Testar criação de veículo"""
        assert sample_veiculo.placa == 'ABC-1234'
        assert sample_veiculo.modelo == 'Ford Focus'
        assert sample_veiculo.cor == 'Branco'
        assert sample_veiculo.ano == 2020
        assert sample_veiculo.status == 'ativo'
        assert sample_veiculo.id is not None
    
    def test_veiculo_repr(self, sample_veiculo):
        """Testar representação string do veículo"""
        expected = f"<Veiculo {sample_veiculo.placa}>"
        assert repr(sample_veiculo) == expected
    
    def test_veiculo_placa_validation(self):
        """Testar validação de placa"""
        # Placa válida
        veiculo = VeiculoFactory.build(placa='ABC-1234')
        assert veiculo.placa == 'ABC-1234'
        
        # Placa com formato antigo
        veiculo = VeiculoFactory.build(placa='ABC1234')
        assert veiculo.placa == 'ABC1234'


@pytest.mark.unit
class TestEntidadeModel:
    """Testes para o modelo Entidade"""
    
    def test_entidade_creation(self, sample_entidade):
        """Testar criação de entidade"""
        assert sample_entidade.nome == 'Empresa Teste'
        assert sample_entidade.cnpj == '12.345.678/0001-90'
        assert sample_entidade.endereco == 'Rua Teste, 123'
        assert sample_entidade.telefone == '(11) 99999-9999'
        assert sample_entidade.email == 'contato@empresa.com'
        assert sample_entidade.status == 'ativo'
        assert sample_entidade.id is not None
    
    def test_entidade_repr(self, sample_entidade):
        """Testar representação string da entidade"""
        expected = f"<Entidade {sample_entidade.nome}>"
        assert repr(sample_entidade) == expected
    
    def test_entidade_cnpj_validation(self):
        """Testar validação de CNPJ"""
        # CNPJ válido
        entidade = EntidadeFactory.build(cnpj='12.345.678/0001-90')
        assert entidade.cnpj == '12.345.678/0001-90'
        
        # CNPJ sem formatação
        entidade = EntidadeFactory.build(cnpj='12345678000190')
        assert entidade.cnpj == '12345678000190'
