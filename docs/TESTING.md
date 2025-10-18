# 🧪 Guia de Testes - Projeto Aduaneiro

Este documento descreve como executar e manter os testes automatizados do projeto.

## 📋 Visão Geral

O projeto possui três tipos de testes:

- **Testes Unitários**: Testam componentes individuais (Python + React/TypeScript)
- **Testes de Integração**: Testam interações entre componentes (API, banco de dados)
- **Testes E2E**: Testam fluxos completos do usuário (Playwright)

## 🚀 Execução Rápida

### Executar Todos os Testes
```bash
python run_tests.py
```

### Executar Testes Específicos

#### Testes Python
```bash
# Todos os testes Python
pytest

# Apenas testes unitários
pytest tests/unit/ -v

# Apenas testes de integração
pytest tests/integration/ -v

# Com cobertura
pytest --cov=app --cov-report=html
```

#### Testes E2E
```bash
# Todos os testes E2E
playwright test

# Com interface gráfica
playwright test --ui

# Apenas um navegador
playwright test --project=chromium
```

#### Testes React/TypeScript
```bash
# Executar testes
npm test

# Com cobertura
npm test -- --coverage

# Modo watch
npm test -- --watch
```

## 📁 Estrutura de Testes

```
tests/
├── conftest.py                 # Configuração global
├── unit/                      # Testes unitários
│   ├── test_models.py         # Testes de modelos
│   └── test_utils.py          # Testes de utilitários
├── integration/               # Testes de integração
│   ├── test_api.py            # Testes de API
│   └── test_database.py       # Testes de banco
├── e2e/                       # Testes E2E
│   └── test_dashboard.py      # Testes do dashboard
├── components/                # Testes de componentes React
│   └── CardSwap.test.tsx
├── hooks/                     # Testes de hooks React
│   └── useGlobalState.test.ts
└── setup.ts                   # Configuração Jest
```

## 🔧 Configuração

### Dependências

#### Python
```bash
pip install -r requirements-test.txt
```

#### Node.js
```bash
npm install
playwright install
```

### Variáveis de Ambiente

Crie um arquivo `.env.test`:
```env
FLASK_ENV=testing
TESTING=True
SQLALCHEMY_DATABASE_URI=sqlite:///:memory:
WTF_CSRF_ENABLED=False
SECRET_KEY=test-secret-key
```

## 📊 Cobertura de Código

### Python
- **Meta**: 80% de cobertura
- **Relatório**: `htmlcov/index.html`
- **Comando**: `pytest --cov=app --cov-report=html`

### React/TypeScript
- **Meta**: 80% de cobertura
- **Relatório**: `coverage/lcov-report/index.html`
- **Comando**: `npm test -- --coverage`

## 🎯 Tipos de Testes

### 1. Testes Unitários

Testam componentes individuais em isolamento.

**Exemplo - Modelo User:**
```python
def test_user_creation(self, sample_user):
    assert sample_user.name == 'Test User'
    assert sample_user.email == 'test@example.com'
```

**Exemplo - Hook React:**
```typescript
test('updates state correctly', () => {
  const { result } = renderHook(() => useGlobalState());
  
  act(() => {
    result.current.setState({ theme: 'dark' });
  });
  
  expect(result.current.state.theme).toBe('dark');
});
```

### 2. Testes de Integração

Testam interações entre componentes.

**Exemplo - API de Estatísticas:**
```python
def test_get_stats_success(self, client):
    response = client.get('/api/stats')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] is True
```

### 3. Testes E2E

Testam fluxos completos do usuário.

**Exemplo - Login:**
```python
def test_login_success(self, page: Page, live_server):
    page.goto(f"{live_server.url}/login")
    page.fill('input[name="email"]', 'admin@teste.com')
    page.fill('input[name="password"]', 'admin123')
    page.click('button[type="submit"]')
    expect(page).to_have_url(f"{live_server.url}/dashboard")
```

## 🏷️ Marcadores de Teste

Use marcadores para categorizar e filtrar testes:

```python
@pytest.mark.unit
@pytest.mark.integration
@pytest.mark.e2e
@pytest.mark.api
@pytest.mark.database
@pytest.mark.slow
@pytest.mark.auth
@pytest.mark.security
```

### Executar por Marcador

```bash
# Apenas testes unitários
pytest -m unit

# Apenas testes de API
pytest -m api

# Excluir testes lentos
pytest -m "not slow"
```

## 🏭 Factories

Use factories para criar dados de teste:

```python
# Criar usuário
user = UserFactory.create(email='test@example.com')

# Criar múltiplos usuários
users = UserFactory.create_batch(5)

# Criar com parâmetros específicos
user = UserFactory.create(
    email='admin@test.com',
    group='admin',
    status='active'
)
```

## 🔍 Debugging

### Python
```bash
# Executar com debug
pytest --pdb

# Executar teste específico
pytest tests/unit/test_models.py::TestUserModel::test_user_creation -v

# Com logs detalhados
pytest -s -v
```

### Playwright
```bash
# Modo debug
playwright test --debug

# Executar teste específico
playwright test tests/e2e/test_dashboard.py -g "login"

# Com trace
playwright test --trace on
```

## 📈 CI/CD

Os testes são executados automaticamente no GitHub Actions:

- **Push/PR**: Todos os testes
- **Cobertura**: Relatórios enviados para Codecov
- **Artefatos**: Relatórios HTML salvos

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de importação**
   ```bash
   # Verificar PYTHONPATH
   export PYTHONPATH="${PYTHONPATH}:$(pwd)"
   ```

2. **Banco de dados não limpo**
   ```bash
   # Limpar banco de teste
   rm instance/test.db
   ```

3. **Playwright não instalado**
   ```bash
   playwright install --with-deps
   ```

4. **Porta ocupada**
   ```bash
   # Usar porta diferente
   FLASK_RUN_PORT=5001 pytest
   ```

### Logs de Debug

```python
# Habilitar logs detalhados
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📚 Recursos Adicionais

- [Documentação Pytest](https://docs.pytest.org/)
- [Documentação Playwright](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/)

## 🤝 Contribuindo

Ao adicionar novos testes:

1. Siga a estrutura de pastas existente
2. Use nomes descritivos para testes
3. Adicione docstrings explicativas
4. Mantenha cobertura acima de 80%
5. Execute todos os testes antes do commit

---

**Lembre-se**: Testes são investimento, não custo! 🚀
