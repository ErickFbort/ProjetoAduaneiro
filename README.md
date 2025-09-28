# Sistema Aduaneiro

Sistema web para gestão de processos aduaneiros desenvolvido em Flask.

## 🏗️ Estrutura do Projeto

```
ProjetoAduaneiro/
├── app/                    # Aplicação principal
│   ├── __init__.py        # Factory da aplicação
│   ├── models/            # Modelos do banco de dados
│   │   ├── __init__.py
│   │   ├── user.py        # Modelo de usuário
│   │   ├── veiculo.py     # Modelo de veículo
│   │   └── entidade.py    # Modelo de entidade
│   ├── routes/            # Rotas da aplicação
│   │   ├── __init__.py
│   │   ├── auth.py        # Autenticação
│   │   ├── main.py        # Rotas principais
│   │   └── cadastros.py   # Cadastros
│   ├── api/               # APIs REST
│   │   ├── __init__.py
│   │   ├── users.py       # API de usuários
│   │   ├── veiculos.py    # API de veículos
│   │   └── entidades.py   # API de entidades
│   └── utils/             # Utilitários
│       ├── __init__.py
│       └── database.py    # Inicialização do banco
├── templates/             # Templates HTML
├── static/               # Arquivos estáticos (CSS, JS, imagens)
├── instance/             # Banco de dados SQLite
├── main.py              # Arquivo principal
├── config.py            # Configurações
└── requirements.txt     # Dependências Python
```

## 🚀 Instalação e Execução

### 1. Instalar dependências
```bash
pip install -r requirements.txt
```

### 2. Executar aplicação
```bash
python main.py
```

### 3. Acessar sistema
- URL: http://localhost:5000
- Login: admin@teste.com
- Senha: 1234

## 📋 Funcionalidades

### 🔐 Autenticação
- Login/logout seguro
- Gerenciamento de sessões
- Proteção de rotas

### 👥 Gestão de Usuários
- Cadastro de usuários
- Grupos: Paclog Faturamento, Paclog ADM, Paclog Operacional
- Busca e filtros
- Edição e exclusão

### 🚛 Gestão de Veículos
- Cadastro de veículos
- Dados do motorista responsável
- Tipos: Reboque, Carreta, Cavalo, Truck, Outros
- Busca por placa, CPF, motorista

### 🏢 Gestão de Entidades
- Cadastro de entidades (clientes, fornecedores)
- Dados fiscais completos
- Configuração de notificações por email
- Tipos de entidade configuráveis

### 🎨 Interface
- Design responsivo com Bootstrap 5
- Barra lateral dinâmica
- Navegação intuitiva
- Formulários validados

## 🛠️ Tecnologias

- **Backend**: Python 3.13, Flask 3.0
- **Banco de Dados**: SQLite (desenvolvimento)
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Autenticação**: Flask-Login
- **ORM**: SQLAlchemy

## 📝 APIs Disponíveis

### Usuários
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `GET /api/users/<id>` - Obter usuário
- `PUT /api/users/<id>` - Atualizar usuário
- `DELETE /api/users/<id>` - Excluir usuário

### Veículos
- `GET /api/veiculos` - Listar veículos
- `POST /api/veiculos` - Criar veículo
- `GET /api/veiculos/<id>` - Obter veículo
- `PUT /api/veiculos/<id>` - Atualizar veículo
- `DELETE /api/veiculos/<id>` - Excluir veículo

### Entidades
- `GET /api/entidades` - Listar entidades
- `POST /api/entidades` - Criar entidade
- `GET /api/entidades/<id>` - Obter entidade
- `PUT /api/entidades/<id>` - Atualizar entidade
- `DELETE /api/entidades/<id>` - Excluir entidade

## 🔧 Desenvolvimento

### Estrutura Modular
O projeto foi organizado seguindo o padrão de **Blueprints** do Flask, separando:
- **Models**: Definições do banco de dados
- **Routes**: Rotas da aplicação web
- **API**: Endpoints REST
- **Utils**: Utilitários e helpers

### Banco de Dados
- SQLite para desenvolvimento
- Migração automática na inicialização
- Dados de exemplo incluídos

### Configuração
- Configurações por ambiente (dev/prod/test)
- Variáveis de ambiente suportadas
- Configuração centralizada em `config.py`

## 📚 Histórico de Desenvolvimento

### Conversão para Flask + Bootstrap
O projeto foi completamente convertido de HTML/CSS/JavaScript estático para uma aplicação web moderna usando Python Flask e Bootstrap.

#### Melhorias Implementadas

**🔧 Backend**
- **Flask**: Framework web moderno e flexível
- **SQLAlchemy**: ORM para banco de dados
- **Flask-Login**: Autenticação e sessões
- **Werkzeug**: Hash seguro de senhas
- **Configuração por ambiente**: Dev/Prod/Test

**🎨 Frontend**
- **Bootstrap 5**: Framework CSS moderno
- **Font Awesome**: Ícones profissionais
- **Responsividade**: Mobile-first design
- **Componentes**: Modais, tabelas, formulários
- **UX/UI**: Interface intuitiva e moderna

**🛡️ Segurança**
- **Hash de senhas**: Senhas nunca em texto plano
- **Sessões seguras**: Flask-Login
- **Validação**: Dados validados no backend
- **CSRF Protection**: Proteção contra ataques

**📊 Funcionalidades**
- **CRUD Completo**: Criar, ler, atualizar, deletar para todos os módulos
- **Sistema de Permissões**: Controle granular de usuários
- **Status de Registros**: Ativo/Bloqueado para todos os cadastros
- **Busca Avançada**: Pesquisa com filtros em todos os módulos
- **API REST**: Endpoints para integração
- **Validações Frontend**: CPF, CNPJ, Placa, Email em tempo real
- **Feedback Visual**: Loading states, alertas contextuais, validação visual

### Estrutura de Arquivos Otimizada

```
ProjetoAduaneiro/
├── app/                    # Aplicação principal modularizada
│   ├── models/            # Modelos do banco de dados
│   ├── routes/            # Rotas da aplicação web
│   ├── api/               # APIs REST
│   └── utils/             # Utilitários centralizados
├── templates/             # Templates HTML organizados
│   ├── partials/          # Componentes reutilizáveis
│   └── [módulos].html     # Templates específicos
├── static/                # Arquivos estáticos únicos
│   ├── css/               # Estilos centralizados
│   ├── js/                # JavaScript modularizado
│   └── img/               # Imagens do projeto
├── instance/              # Banco de dados SQLite
├── main.py               # Arquivo principal
├── config.py             # Configurações centralizadas
├── requirements.txt      # Dependências Python
├── .gitignore           # Controle de versão
└── README.md            # Documentação consolidada
```

### Benefícios da Reorganização

1. **Manutenibilidade**: Código centralizado e reutilizável
2. **Consistência**: Comportamento uniforme em toda a aplicação
3. **UX Melhorada**: Validações em tempo real e feedback visual
4. **Performance**: Eliminação de código duplicado
5. **Escalabilidade**: Estrutura preparada para futuras funcionalidades
6. **Debugging**: Código mais organizado e fácil de debugar

## 📄 Licença

Este projeto é de uso interno da empresa.