"""
Configuração global dos testes
"""
import pytest
import os
import tempfile
from app import create_app, db
from app.models.user import User
from app.models.veiculo import Veiculo
from app.models.entidade import Entidade
from factory import Factory, Faker, Sequence
from werkzeug.security import generate_password_hash


class UserFactory(Factory):
    class Meta:
        model = User
    
    id = Sequence(lambda n: n)
    name = Faker('name')
    email = Faker('email')
    password = Faker('password')
    group = Faker('random_element', elements=['admin', 'user', 'operator'])
    status = Faker('random_element', elements=['active', 'blocked'])


class VeiculoFactory(Factory):
    class Meta:
        model = Veiculo
    
    id = Sequence(lambda n: n)
    placa = Faker('license_plate')
    modelo = Faker('vehicle_make_model')
    cor = Faker('color_name')
    ano = Faker('year')
    status = Faker('random_element', elements=['ativo', 'inativo'])


class EntidadeFactory(Factory):
    class Meta:
        model = Entidade
    
    id = Sequence(lambda n: n)
    nome = Faker('company')
    cnpj = Faker('cnpj')
    endereco = Faker('address')
    telefone = Faker('phone_number')
    email = Faker('email')
    status = Faker('random_element', elements=['ativo', 'inativo'])


@pytest.fixture(scope='session')
def app():
    """Criar aplicação Flask para testes"""
    # Configuração de teste
    os.environ['FLASK_ENV'] = 'testing'
    os.environ['TESTING'] = 'True'
    
    # Criar arquivo temporário para banco de dados
    db_fd, db_path = tempfile.mkstemp()
    
    app = create_app({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': f'sqlite:///{db_path}',
        'WTF_CSRF_ENABLED': False,  # Desabilitar CSRF para testes
        'SECRET_KEY': 'test-secret-key',
        'CACHE_TYPE': 'simple',  # Cache simples para testes
        'RATELIMIT_ENABLED': False,  # Desabilitar rate limiting para testes
    })
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()
    
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def client(app):
    """Cliente de teste Flask"""
    return app.test_client()


@pytest.fixture
def runner(app):
    """Runner de comandos Flask"""
    return app.test_cli_runner()


@pytest.fixture
def auth_headers(client):
    """Headers de autenticação para testes"""
    # Criar usuário de teste
    user = UserFactory.create(
        email='test@example.com',
        password=generate_password_hash('test123')
    )
    db.session.add(user)
    db.session.commit()
    
    # Fazer login
    response = client.post('/login', data={
        'email': 'test@example.com',
        'password': 'test123'
    })
    
    # Retornar headers com sessão
    return {
        'Cookie': response.headers.get('Set-Cookie', '')
    }


@pytest.fixture
def sample_user():
    """Usuário de exemplo para testes"""
    return UserFactory.create(
        name='Test User',
        email='test@example.com',
        password=generate_password_hash('test123'),
        group='admin',
        status='active'
    )


@pytest.fixture
def sample_veiculo():
    """Veículo de exemplo para testes"""
    return VeiculoFactory.create(
        placa='ABC-1234',
        modelo='Ford Focus',
        cor='Branco',
        ano=2020,
        status='ativo'
    )


@pytest.fixture
def sample_entidade():
    """Entidade de exemplo para testes"""
    return EntidadeFactory.create(
        nome='Empresa Teste',
        cnpj='12.345.678/0001-90',
        endereco='Rua Teste, 123',
        telefone='(11) 99999-9999',
        email='contato@empresa.com',
        status='ativo'
    )


@pytest.fixture(autouse=True)
def clean_db(app):
    """Limpar banco de dados após cada teste"""
    with app.app_context():
        db.session.rollback()
        # Limpar todas as tabelas
        for table in reversed(db.metadata.sorted_tables):
            db.session.execute(table.delete())
        db.session.commit()
        yield
        db.session.rollback()
        for table in reversed(db.metadata.sorted_tables):
            db.session.execute(table.delete())
        db.session.commit()
