# 📁 Estrutura do Projeto Aduaneiro

## 🏗️ Organização Geral

```
ProjetoAduaneiro/
├── 📁 app/                    # Backend Flask
│   ├── 📁 api/               # Endpoints da API
│   ├── 📁 middleware/        # Middlewares customizados
│   ├── 📁 models/           # Modelos de dados
│   ├── 📁 routes/           # Rotas da aplicação
│   ├── 📁 security/         # Módulos de segurança
│   ├── 📁 services/         # Serviços de negócio
│   └── 📁 utils/            # Utilitários
├── 📁 config/               # Configurações centralizadas
│   ├── base.py              # Configuração base
│   ├── production.py        # Configuração de produção
│   ├── gunicorn.conf.py     # Configuração do Gunicorn
│   └── pytest.ini          # Configuração de testes
├── 📁 docs/                 # Documentação
│   ├── 📁 migrations/       # Documentação de migrações
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOY_GUIDE.md
│   └── ...
├── 📁 scripts/              # Scripts utilitários
│   ├── backup.sh
│   ├── deploy.sh
│   ├── optimize_assets.py
│   └── run_tests.py
├── 📁 src/                  # Frontend React/TypeScript
│   ├── 📁 components/       # Componentes React
│   ├── 📁 hooks/           # Custom hooks
│   ├── 📁 stores/          # Estado global
│   ├── 📁 types/           # Definições TypeScript
│   └── 📁 utils/           # Utilitários frontend
├── 📁 static/              # Arquivos estáticos
├── 📁 templates/           # Templates HTML
├── 📁 tests/               # Testes
│   ├── 📁 frontend/        # Testes TypeScript/React
│   ├── 📁 e2e/            # Testes end-to-end
│   ├── 📁 integration/    # Testes de integração
│   └── 📁 unit/           # Testes unitários Python
└── 📁 logs/                # Logs da aplicação
```

## 🎯 Princípios de Organização

### 1. **Separação por Responsabilidade**
- **Backend**: Toda lógica Python/Flask em `app/`
- **Frontend**: Todo código React/TypeScript em `src/`
- **Configuração**: Arquivos de config centralizados em `config/`
- **Scripts**: Utilitários e automações em `scripts/`

### 2. **Agrupamento Lógico**
- **API**: Endpoints organizados por funcionalidade
- **Segurança**: Módulos de segurança agrupados
- **Testes**: Separação clara entre tipos de teste
- **Documentação**: Migrações separadas da documentação principal

### 3. **Eliminação de Duplicatas**
- ✅ Removidos arquivos duplicados (`entidades.py` vs `entities.py`)
- ✅ Consolidadas configurações espalhadas
- ✅ Removidas pastas vazias desnecessárias

### 4. **Estrutura de Testes**
```
tests/
├── frontend/           # Testes React/TypeScript
│   ├── components/     # Testes de componentes
│   └── hooks/         # Testes de hooks
├── e2e/               # Testes end-to-end
├── integration/       # Testes de integração
└── unit/              # Testes unitários Python
```

## 🚀 Benefícios da Nova Estrutura

1. **Navegação Intuitiva**: Fácil localização de arquivos
2. **Manutenibilidade**: Código organizado por responsabilidade
3. **Escalabilidade**: Estrutura preparada para crescimento
4. **Colaboração**: Estrutura clara para novos desenvolvedores
5. **Deploy**: Scripts centralizados e organizados

## 📋 Próximos Passos

- [ ] Atualizar documentação de deploy
- [ ] Revisar imports após reorganização
- [ ] Validar funcionamento de todos os módulos
- [ ] Atualizar guias de desenvolvimento
