# API do Projeto Aduaneiro

## Endpoints Disponíveis

### Autenticação

#### `POST /login`
Realiza login do usuário.

**Parâmetros:**
- `email` (string): Email do usuário
- `password` (string): Senha do usuário

**Resposta:**
- Sucesso: Redirecionamento para `/dashboard`
- Erro: Página de login com mensagem de erro

---

### Dashboard

#### `GET /dashboard`
Página principal do sistema (requer autenticação).

**Resposta:**
- HTML: Dashboard principal

---

### Cadastros

#### `GET /cadastros`
Página de gerenciamento de usuários (requer autenticação).

**Resposta:**
- HTML: Página de cadastros com lista de usuários

---

### API de Usuários

#### `GET /api/users`
Lista todos os usuários cadastrados.

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "João da Silva",
    "cpf": "123.456.789-00",
    "email": "joao@email.com",
    "status": "active",
    "permissions": "[\"cadastrar-processo\", \"editar-processo\"]"
  }
]
```

#### `POST /api/users`
Cria um novo usuário.

**Parâmetros:**
```json
{
  "name": "Nome Completo",
  "cpf": "123.456.789-00",
  "email": "email@exemplo.com",
  "password": "senha123",
  "status": "active",
  "permissions": "[\"cadastrar-processo\", \"editar-processo\"]"
}
```

**Resposta:**
- Sucesso (201): `{"message": "Usuário criado com sucesso"}`
- Erro (400): `{"error": "Mensagem de erro"}`

#### `PUT /api/users/<id>`
Atualiza um usuário existente.

**Parâmetros:**
```json
{
  "name": "Nome Atualizado",
  "cpf": "123.456.789-00",
  "email": "email@exemplo.com",
  "password": "nova_senha", // Opcional
  "status": "active",
  "permissions": "[\"cadastrar-processo\"]"
}
```

**Resposta:**
- Sucesso (200): `{"message": "Usuário atualizado com sucesso"}`
- Erro (400): `{"error": "Mensagem de erro"}`

#### `DELETE /api/users/<id>`
Remove um usuário.

**Resposta:**
- Sucesso (200): `{"message": "Usuário removido com sucesso"}`
- Erro (404): `{"error": "Usuário não encontrado"}`

---

### Logout

#### `GET /logout`
Realiza logout do usuário.

**Resposta:**
- Redirecionamento para `/login`

---

## Códigos de Status HTTP

- `200`: Sucesso
- `201`: Criado com sucesso
- `302`: Redirecionamento
- `400`: Erro na requisição
- `401`: Não autorizado
- `404`: Não encontrado
- `500`: Erro interno do servidor

---

## Exemplos de Uso

### Criar um novo usuário

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "cpf": "987.654.321-00",
    "email": "maria@email.com",
    "password": "senha123",
    "status": "active",
    "permissions": "[\"visualizar-processo\"]"
  }'
```

### Listar usuários

```bash
curl http://localhost:5000/api/users
```

### Atualizar usuário

```bash
curl -X PUT http://localhost:5000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva Santos",
    "cpf": "987.654.321-00",
    "email": "maria@email.com",
    "status": "active",
    "permissions": "[\"visualizar-processo\", \"editar-processo\"]"
  }'
```

### Deletar usuário

```bash
curl -X DELETE http://localhost:5000/api/users/1
```

---

## Permissões Disponíveis

- `cadastrar-processo`: Permite cadastrar novos processos
- `editar-processo`: Permite editar processos existentes
- `visualizar-processo`: Permite visualizar processos
- `cancelar-processo`: Permite cancelar processos
- `alterar-senha`: Permite alterar senha
- `all`: Todas as permissões (administrador)

---

## Autenticação

A aplicação usa Flask-Login para gerenciamento de sessões. As rotas protegidas requerem que o usuário esteja logado.

Para acessar as APIs, é necessário estar autenticado através do sistema de login da aplicação web.


