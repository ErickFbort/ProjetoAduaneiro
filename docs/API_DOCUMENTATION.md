# 📚 Documentação Completa da API - Projeto Aduaneiro

## 📋 Visão Geral

A API do Projeto Aduaneiro fornece endpoints para gerenciamento completo do sistema de gestão aduaneira, incluindo autenticação, usuários, veículos, entidades e estatísticas.

### **Informações Básicas**
- **Versão:** 1.0.0
- **Base URL:** `http://localhost:5000/api`
- **Formato:** JSON
- **Autenticação:** Sessão Flask-Login

### **Acesso à Documentação Interativa**
- **Swagger UI:** `http://localhost:5000/api/docs/`
- **Documentação HTML:** `http://localhost:5000/api-documentation`

## 🔐 Autenticação

### **Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@teste.com",
  "password": "admin123"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "name": "Administrador",
    "email": "admin@teste.com",
    "group": "admin",
    "status": "active"
  }
}
```

### **Logout**
```http
POST /api/auth/logout
```

### **Verificar Usuário Atual**
```http
GET /api/auth/me
```

### **Verificar Autenticação**
```http
GET /api/auth/check
```

## 📊 Estatísticas

### **Estatísticas Básicas (Público)**
```http
GET /api/stats/
```

**Resposta:**
```json
{
  "users": 15,
  "vehicles": 42,
  "entities": 8,
  "processes": 0
}
```

### **Estatísticas Detalhadas (Protegido)**
```http
GET /api/stats/detailed
Authorization: Required
```

**Resposta:**
```json
{
  "users": {
    "total": 15,
    "active": 12,
    "blocked": 3,
    "by_group": [
      {"group": "admin", "count": 2},
      {"group": "user", "count": 10},
      {"group": "operator", "count": 3}
    ]
  },
  "vehicles": {
    "total": 42,
    "active": 38,
    "inactive": 4
  },
  "entities": {
    "total": 8,
    "active": 7,
    "inactive": 1
  },
  "processes": 0
}
```

### **Estatísticas de Usuários**
```http
GET /api/stats/users
```

### **Estatísticas de Veículos**
```http
GET /api/stats/vehicles
```

## 👥 Usuários

### **Listar Usuários**
```http
GET /api/users/?page=1&per_page=10&search=admin&group=admin&status=active&sort=name&order=asc
Authorization: Required
```

**Parâmetros de Query:**
- `page` (int): Número da página (padrão: 1)
- `per_page` (int): Itens por página (padrão: 10, máximo: 100)
- `search` (string): Busca por nome ou email
- `group` (string): Filtrar por grupo (admin, user, operator)
- `status` (string): Filtrar por status (active, blocked)
- `sort` (string): Campo para ordenação (padrão: id)
- `order` (string): Ordem (asc, desc)

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Administrador",
      "email": "admin@teste.com",
      "group": "admin",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z",
      "last_login": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 1,
    "pages": 1,
    "has_prev": false,
    "has_next": false
  }
}
```

### **Criar Usuário**
```http
POST /api/users/
Content-Type: application/json
Authorization: Required (Admin only)

{
  "name": "Novo Usuário",
  "email": "novo@teste.com",
  "password": "senha123",
  "group": "user",
  "status": "active"
}
```

### **Obter Usuário**
```http
GET /api/users/{id}
Authorization: Required
```

### **Atualizar Usuário**
```http
PUT /api/users/{id}
Content-Type: application/json
Authorization: Required

{
  "name": "Nome Atualizado",
  "group": "admin",
  "status": "active"
}
```

### **Excluir Usuário**
```http
DELETE /api/users/{id}
Authorization: Required (Admin only)
```

## 🚗 Veículos

### **Listar Veículos**
```http
GET /api/vehicles/?page=1&per_page=10&search=ABC&status=ativo&year=2020&color=Branco&sort=placa&order=asc
Authorization: Required
```

**Parâmetros de Query:**
- `page` (int): Número da página
- `per_page` (int): Itens por página
- `search` (string): Busca por placa ou modelo
- `status` (string): Filtrar por status (ativo, inativo)
- `year` (int): Filtrar por ano
- `color` (string): Filtrar por cor
- `sort` (string): Campo para ordenação
- `order` (string): Ordem (asc, desc)

### **Criar Veículo**
```http
POST /api/vehicles/
Content-Type: application/json
Authorization: Required

{
  "placa": "XYZ-9876",
  "modelo": "Honda Civic",
  "cor": "Azul",
  "ano": 2021,
  "status": "ativo"
}
```

### **Obter Veículo**
```http
GET /api/vehicles/{id}
Authorization: Required
```

### **Atualizar Veículo**
```http
PUT /api/vehicles/{id}
Content-Type: application/json
Authorization: Required

{
  "modelo": "Honda Civic 2022",
  "cor": "Prata",
  "status": "ativo"
}
```

### **Excluir Veículo**
```http
DELETE /api/vehicles/{id}
Authorization: Required
```

## 🏢 Entidades

### **Listar Entidades**
```http
GET /api/entities/?page=1&per_page=10&search=empresa&status=ativo&sort=nome&order=asc
Authorization: Required
```

**Parâmetros de Query:**
- `page` (int): Número da página
- `per_page` (int): Itens por página
- `search` (string): Busca por nome ou CNPJ
- `status` (string): Filtrar por status (ativo, inativo)
- `sort` (string): Campo para ordenação
- `order` (string): Ordem (asc, desc)

### **Criar Entidade**
```http
POST /api/entities/
Content-Type: application/json
Authorization: Required

{
  "nome": "Nova Empresa",
  "cnpj": "98.765.432/0001-10",
  "endereco": "Rua Nova, 456",
  "telefone": "(11) 88888-8888",
  "email": "contato@novaempresa.com",
  "status": "ativo"
}
```

### **Obter Entidade**
```http
GET /api/entities/{id}
Authorization: Required
```

### **Atualizar Entidade**
```http
PUT /api/entities/{id}
Content-Type: application/json
Authorization: Required

{
  "nome": "Empresa Atualizada",
  "endereco": "Rua Atualizada, 789",
  "status": "ativo"
}
```

### **Excluir Entidade**
```http
DELETE /api/entities/{id}
Authorization: Required
```

## 💼 LinkedIn

### **Posts do LinkedIn**
```http
GET /api/linkedin/posts?limit=5&force_simulated=false
```

**Parâmetros de Query:**
- `limit` (int): Número máximo de posts (padrão: 5, máximo: 50)
- `force_simulated` (bool): Forçar dados simulados (padrão: false)

**Resposta:**
```json
{
  "success": true,
  "data": [],
  "message": "Integração com LinkedIn ainda não configurada. Nenhuma informação disponível no momento.",
  "count": 0
}
```

### **Informações da Empresa**
```http
GET /api/linkedin/company
```

### **Analytics do LinkedIn**
```http
GET /api/linkedin/analytics
Authorization: Required (Admin only)
```

## 📝 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Dados inválidos |
| 401 | Não autenticado |
| 403 | Acesso negado |
| 404 | Recurso não encontrado |
| 500 | Erro interno do servidor |

## 🔧 Formato de Resposta Padrão

### **Sucesso**
```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { ... }
}
```

### **Erro**
```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Detalhes técnicos do erro",
  "code": 400
}
```

### **Paginação**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 100,
    "pages": 10,
    "has_prev": false,
    "has_next": true
  }
}
```

## 🛠️ Exemplos de Uso

### **1. Autenticação e Listagem de Usuários**

```bash
# 1. Fazer login
curl -X POST "http://localhost:5000/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@teste.com",
       "password": "admin123"
     }'

# 2. Listar usuários (usar cookies de sessão)
curl -X GET "http://localhost:5000/api/users/?page=1&per_page=5" \
     -H "Cookie: session=..."

# 3. Obter estatísticas
curl -X GET "http://localhost:5000/api/stats/"
```

### **2. Gerenciamento de Veículos**

```bash
# 1. Criar veículo
curl -X POST "http://localhost:5000/api/vehicles/" \
     -H "Content-Type: application/json" \
     -H "Cookie: session=..." \
     -d '{
       "placa": "ABC-1234",
       "modelo": "Ford Focus",
       "cor": "Branco",
       "ano": 2020,
       "status": "ativo"
     }'

# 2. Buscar veículos por placa
curl -X GET "http://localhost:5000/api/vehicles/?search=ABC" \
     -H "Cookie: session=..."

# 3. Atualizar veículo
curl -X PUT "http://localhost:5000/api/vehicles/1" \
     -H "Content-Type: application/json" \
     -H "Cookie: session=..." \
     -d '{
       "cor": "Azul",
       "status": "ativo"
     }'
```

### **3. Gerenciamento de Entidades**

```bash
# 1. Criar entidade
curl -X POST "http://localhost:5000/api/entities/" \
     -H "Content-Type: application/json" \
     -H "Cookie: session=..." \
     -d '{
       "nome": "Empresa Teste",
       "cnpj": "12.345.678/0001-90",
       "endereco": "Rua Teste, 123",
       "telefone": "(11) 99999-9999",
       "email": "contato@empresa.com",
       "status": "ativo"
     }'

# 2. Buscar entidades por nome
curl -X GET "http://localhost:5000/api/entities/?search=empresa" \
     -H "Cookie: session=..."

# 3. Obter estatísticas de entidades
curl -X GET "http://localhost:5000/api/stats/entities" \
     -H "Cookie: session=..."
```

## 🔒 Segurança

### **Headers de Segurança**
A API inclui os seguintes headers de segurança:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy: ...`
- `Referrer-Policy: strict-origin-when-cross-origin`

### **Rate Limiting**
- **Endpoints públicos:** 200 requisições por dia, 50 por hora
- **Endpoints de API:** 10 requisições por minuto
- **Endpoints do LinkedIn:** 5 requisições por minuto

### **Validação de Entrada**
- Todos os dados de entrada são validados
- Sanitização automática de HTML malicioso
- Validação de formatos (email, CNPJ, placa)

## 📚 Recursos Adicionais

### **Documentação Interativa**
- **Swagger UI:** `http://localhost:5000/api/docs/`
- **Documentação HTML:** `http://localhost:5000/api-documentation`

### **Testes**
- **Testes unitários:** `pytest tests/unit/`
- **Testes de integração:** `pytest tests/integration/`
- **Testes E2E:** `playwright test`

### **Monitoramento**
- **Logs de segurança:** `logs/security.log`
- **Logs de aplicação:** Console do Flask
- **Métricas de performance:** Cache Redis

## 🤝 Suporte

Para dúvidas ou problemas com a API:

1. **Consulte a documentação interativa** no Swagger UI
2. **Verifique os logs** da aplicação
3. **Execute os testes** para verificar a integridade
4. **Consulte este documento** para exemplos de uso

---

**Versão da Documentação:** 1.0.0  
**Última Atualização:** Janeiro 2024  
**Mantenedor:** Equipe de Desenvolvimento
