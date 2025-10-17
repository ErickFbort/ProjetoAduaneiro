# 🚀 Projeto Aduaneiro

Sistema web para gestão de processos aduaneiros desenvolvido em **Flask** com componentes **React** modernos.

## 📋 Visão Geral

O Projeto Aduaneiro é uma aplicação web completa para gerenciamento de processos aduaneiros, oferecendo uma interface moderna e intuitiva para usuários do setor aduaneiro.

### ✨ Características Principais

- **Backend**: Flask (Python) com SQLAlchemy
- **Frontend**: HTML/CSS/JavaScript + React (componentes modernos)
- **Banco de Dados**: SQLite (desenvolvimento) / PostgreSQL (produção)
- **Autenticação**: Flask-Login
- **Animações**: GSAP + React
- **Responsivo**: Bootstrap 5 + CSS customizado

## 🏗️ Arquitetura

### Backend (Flask)
```
app/
├── routes/          # Rotas da aplicação
├── models/          # Modelos de dados
├── api/            # Endpoints da API
├── services/       # Serviços de negócio
└── utils/          # Utilitários
```

### Frontend (React + Vanilla JS)
```
src/
├── components/     # Componentes React
│   ├── Cards/     # CardSwap e similares
│   ├── Layout/    # Componentes de layout
│   └── Common/    # Componentes comuns
├── types/         # Tipos TypeScript
├── constants/     # Constantes da aplicação
├── config/        # Configurações
└── hooks/         # Custom hooks (futuro)

static/
├── css/           # Estilos globais
├── js/            # JavaScript vanilla
├── img/           # Imagens
└── dist/          # Build do React
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Python 3.8+
- Node.js 16+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/ErickFbort/ProjetoAduaneiro.git
cd ProjetoAduaneiro
```

### 2. Configurar Backend (Flask)
```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Executar aplicação
python main.py
```

### 3. Configurar Frontend (React)
```bash
# Instalar dependências
npm install

# Modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🎯 Funcionalidades

### Módulos Principais
- **Dashboard**: Visão geral com favoritos personalizáveis
- **Cadastros**: Gestão de usuários, veículos e entidades
- **Relatórios**: Sistema completo de relatórios
- **Web Clientes**: Módulo para clientes externos

### Componentes React
- **CardSwap**: Animação 3D de cards de terminais
- **NewsTabs**: Sistema de notícias com abas e rotação automática
- **FloatingDock**: Dock flutuante para favoritos

### Recursos Avançados
- **Favoritos Personalizáveis**: Sistema de favoritos com layouts
- **Animações GSAP**: Animações suaves e profissionais
- **Responsividade**: Adaptação para mobile e tablet
- **Temas**: Suporte a temas claro/escuro

## 🛠️ Desenvolvimento

### Scripts Disponíveis

#### Backend
```bash
python main.py              # Executar servidor Flask
python -m pytest           # Executar testes
```

#### Frontend
```bash
npm run dev                # Servidor de desenvolvimento
npm run build              # Build para produção
npm run preview            # Preview do build
```

### Estrutura de Desenvolvimento

1. **Backend**: Desenvolvimento em Flask com hot reload
2. **Frontend**: Desenvolvimento em React com Vite
3. **Integração**: React é compilado e integrado ao Flask

### Migração para React

O projeto está em processo de migração gradual para React:

- ✅ **CardSwap**: Migrado com sucesso
- ✅ **NewsTabs**: Migrado com sucesso
- 🔄 **FloatingDock**: Planejado
- 🔄 **Dashboard**: Planejado

## 📚 Documentação

- [Migração CardSwap](docs/CARD_SWAP_MIGRATION.md) - Detalhes da migração
- [Migração NewsTabs](docs/NEWS_TABS_MIGRATION.md) - Detalhes da migração
- [API Documentation](API.md) - Documentação da API
- [Configuração](config.py) - Configurações do sistema

## 🧪 Testes

```bash
# Testes do backend
python -m pytest

# Testes do frontend (futuro)
npm test
```

## 🚀 Deploy

### Desenvolvimento
```bash
# Backend
python main.py

# Frontend
npm run dev
```

### Produção
```bash
# Build do React
npm run build

# Executar Flask
python main.py
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Erick Bortoloti** - *Desenvolvimento inicial* - [ErickFbort](https://github.com/ErickFbort)

## 🙏 Agradecimentos

- Flask Community
- React Community
- GSAP por suas incríveis animações
- Bootstrap por seu sistema de design

---

**Desenvolvido com ❤️ para o setor aduaneiro brasileiro**