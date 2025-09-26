# Projeto Aduaneiro - Flask

Sistema de gestão aduaneira desenvolvido em Python Flask com Bootstrap.

## Características

- **Backend**: Python Flask com SQLAlchemy
- **Frontend**: Bootstrap 5 + HTML5 + CSS3 + JavaScript
- **Autenticação**: Flask-Login
- **Banco de Dados**: SQLite (desenvolvimento)
- **Interface Responsiva**: Bootstrap para design moderno

## Funcionalidades

- Sistema de login seguro
- Dashboard principal
- Cadastro e gerenciamento de usuários
- Interface responsiva
- Sistema de permissões
- Navegação lateral colapsável

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd ProjetoAduaneiro
```

2. Crie um ambiente virtual:
```bash
python -m venv venv
```

3. Ative o ambiente virtual:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Instale as dependências:
```bash
pip install -r requirements.txt
```

5. Execute a aplicação:
```bash
python app.py
```

6. Acesse no navegador: `http://localhost:5000`

## Credenciais Padrão

- **Email**: admin@teste.com
- **Senha**: 1234

## Estrutura do Projeto

```
ProjetoAduaneiro/
├── app.py                 # Aplicação Flask principal
├── requirements.txt       # Dependências Python
├── templates/            # Templates Jinja2
│   ├── base.html         # Template base
│   ├── login.html        # Página de login
│   ├── dashboard.html    # Dashboard principal
│   └── cadastros.html    # Página de cadastros
├── static/               # Arquivos estáticos
│   ├── css/              # Estilos CSS
│   ├── js/               # Scripts JavaScript
│   └── img/              # Imagens
└── README.md             # Este arquivo
```

## Tecnologias Utilizadas

- **Python 3.8+**
- **Flask 2.3.3**
- **Bootstrap 5.3.0**
- **Font Awesome 6.0.0**
- **SQLAlchemy**
- **Flask-Login**

## Desenvolvimento

Para desenvolvimento, execute:
```bash
python app.py
```

A aplicação será executada em modo debug com recarga automática.

## Banco de Dados

O banco de dados SQLite será criado automaticamente na primeira execução. Um usuário administrador padrão será criado com as credenciais mencionadas acima.

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

Este projeto é uma aplicação web de exemplo para um sistema aduaneiro.

## Funcionalidades
- **Login:** Autenticação de usuário simulada.
- **Página Principal:** Navegação para diferentes seções do sistema.
- **Responsivo:** Layout adaptável para dispositivos móveis.

## Como Usar
Para executar o projeto, basta abrir o arquivo `login.html` no seu navegador.