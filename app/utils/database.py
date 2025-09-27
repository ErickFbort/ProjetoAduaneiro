"""
Utilitários para banco de dados
"""

from app import db
from app.models.user import User
from app.models.veiculo import Veiculo
from app.models.entidade import Entidade

def init_database():
    """Inicializa o banco de dados com dados padrão"""
    # Criar todas as tabelas
    db.create_all()
    
    # Verificar se já existem dados
    user_count = User.query.count()
    veiculo_count = Veiculo.query.count()
    entidade_count = Entidade.query.count()
    
    print(f"Status do banco de dados:")
    print(f"   - Usuários: {user_count}")
    print(f"   - Veículos: {veiculo_count}")
    print(f"   - Entidades: {entidade_count}")
    
    # Criar usuário admin se não existir
    if user_count == 0:
        print("Criando usuário administrador...")
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
                'lastname': 'Silva',
                'cpf': '123.456.789-00',
                'email': 'joao.silva@email.com',
                'password': '123456',
                'group': 'Paclog Operacional'
            },
            {
                'name': 'Maria',
                'lastname': 'Santos',
                'cpf': '987.654.321-00',
                'email': 'maria.santos@email.com',
                'password': '123456',
                'group': 'Paclog Faturamento'
            },
            {
                'name': 'Pedro',
                'lastname': 'Oliveira',
                'cpf': '456.789.123-00',
                'email': 'pedro.oliveira@email.com',
                'password': '123456',
                'group': 'Paclog ADM'
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
                permissions='["read", "write"]'
            )
            user.set_password(user_data['password'])
            db.session.add(user)
        
        print("Usuários criados com sucesso!")
    
    # Criar alguns veículos de exemplo se não existirem
    if veiculo_count == 0:
        print("Criando veículos de exemplo...")
        veiculos_example = [
            {
                'motorista_responsavel': 'Carlos Silva',
                'cpf_motorista': '111.222.333-44',
                'placa': 'ABC-1234',
                'renavam': '12345678901',
                'tipo': 'Cavalo',
                'estado': 'SP',
                'municipio': 'São Paulo',
                'observacoes': 'Veículo em bom estado'
            },
            {
                'motorista_responsavel': 'Ana Costa',
                'cpf_motorista': '555.666.777-88',
                'placa': 'XYZ-9876',
                'renavam': '98765432109',
                'tipo': 'Carreta',
                'estado': 'RJ',
                'municipio': 'Rio de Janeiro',
                'observacoes': 'Carreta refrigerada'
            },
            {
                'motorista_responsavel': 'Roberto Lima',
                'cpf_motorista': '999.888.777-66',
                'placa': 'DEF-5678',
                'renavam': '11223344556',
                'tipo': 'Truck',
                'estado': 'MG',
                'municipio': 'Belo Horizonte',
                'observacoes': 'Truck para cargas pesadas'
            }
        ]
        
        for veiculo_data in veiculos_example:
            veiculo = Veiculo(**veiculo_data)
            db.session.add(veiculo)
        
        print("Veículos criados com sucesso!")
    
    # Criar algumas entidades de exemplo se não existirem
    if entidade_count == 0:
        print("Criando entidades de exemplo...")
        entidades_example = [
            {
                'razao_social': 'Empresa ABC Ltda',
                'cpf_cnpj': '12.345.678/0001-90',
                'nome_fantasia': 'ABC Logística',
                'inscricao_estadual': '123456789',
                'tipo_cliente': 'Juridica',
                'pagamento': '002',
                'retencao': True,
                'valor_retencao': 1000.00,
                'prazo_retencao': 15,
                'relatorio_nd': True,
                'email_faturamento': 'faturamento@abclog.com',
                'email_operacional': 'operacional@abclog.com',
                'email_despachante': 'despachante@abclog.com',
                'telefone': '(11) 99999-9999',
                'notificacoes': '["processo_aberto", "processo_aprovado"]',
                'tipos': '["cliente", "transportador_credenciado"]'
            },
            {
                'razao_social': 'João da Silva',
                'cpf_cnpj': '123.456.789-00',
                'nome_fantasia': 'João Silva',
                'tipo_cliente': 'Pessoa Fisica',
                'pagamento': '001',
                'retencao': False,
                'relatorio_nd': False,
                'email_faturamento': 'joao@email.com',
                'email_operacional': 'joao@email.com',
                'email_despachante': 'joao@email.com',
                'telefone': '(11) 88888-8888',
                'notificacoes': '["processo_encerrado"]',
                'tipos': '["cliente"]'
            }
        ]
        
        for entidade_data in entidades_example:
            entidade = Entidade(**entidade_data)
            db.session.add(entidade)
        
        print("Entidades criadas com sucesso!")
    
    # Commit todas as alterações
    db.session.commit()
    
    print("\nInicialização do banco de dados concluída!")
    print("Credenciais de acesso:")
    print("   - Email: admin@teste.com")
    print("   - Senha: 1234")
