# 🔒 Melhorias de Segurança Implementadas

## 📋 Visão Geral

Este documento detalha as melhorias de segurança implementadas no Sistema Aduaneiro, incluindo validação de entrada, sanitização, rate limiting e proteção CSRF.

## 🛡️ Componentes de Segurança

### 1. **Validação de Entrada**

#### **Formulários WTForms**
- **Localização**: `app/security/input_validation.py`
- **Funcionalidades**:
  - Validação de email com regex
  - Validação de CNPJ com algoritmo
  - Validação de placa de veículo (padrão antigo e novo)
  - Validação de telefone
  - Formulários base para User, Vehicle e Entity

#### **Validação JSON**
```python
@validate_json(required_fields=['name', 'email'], optional_fields=['phone'])
def create_user():
    data = request.validated_data  # Dados já validados
    # ... lógica do endpoint
```

### 2. **Sanitização de Dados**

#### **Bleach para HTML**
- Remove tags HTML maliciosas
- Permite apenas tags seguras: `['b', 'i', 'u', 'em', 'strong', 'p', 'br']`
- Sanitização recursiva para objetos complexos

#### **Sanitização Automática**
```python
@sanitize_request_data()
def process_data():
    # Dados do request já sanitizados
    pass
```

### 3. **Rate Limiting**

#### **Flask-Limiter**
- **Configuração**: `app/security/rate_limiter.py`
- **Limites por endpoint**:
  - `/api/stats`: 10 requisições por minuto
  - `/api/linkedin/posts`: 5 requisições por minuto
  - `/api/linkedin/company`: 10 requisições por minuto
  - **Global**: 200 requisições por dia, 50 por hora

#### **Uso**
```python
@limiter.limit("10 per minute")
def api_endpoint():
    # Endpoint com rate limiting
    pass
```

### 4. **Proteção CSRF**

#### **Flask-WTF CSRF**
- **Configuração**: `app/security/csrf.py`
- **Funcionalidades**:
  - Proteção automática em formulários
  - Timeout de 1 hora para tokens
  - Exclusão de endpoints de API que não precisam de CSRF

#### **Configuração**
```python
# Excluir endpoints de API
csrf.exempt('api.get_system_stats')
csrf.exempt('api.get_linkedin_posts')
```

### 5. **Security Headers**

#### **Headers Implementados**
- **X-Frame-Options**: `DENY` - Previne clickjacking
- **X-Content-Type-Options**: `nosniff` - Previne MIME sniffing
- **X-XSS-Protection**: `1; mode=block` - Proteção XSS
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Content-Security-Policy**: Política restritiva de conteúdo
- **Strict-Transport-Security**: Para HTTPS (quando habilitado)

#### **CSP Policy**
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com;
style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self'
```

### 6. **Logging de Segurança**

#### **Eventos Monitorados**
- **Login falhado**: Email, motivo, IP
- **Login bem-sucedido**: User ID, email, IP
- **Atividade suspeita**: Tipo, detalhes
- **Rate limit excedido**: Endpoint, IP
- **Erro de validação**: Campo, erro, dados
- **Violação CSRF**: Endpoint, IP

#### **Arquivo de Log**
- **Localização**: `logs/security.log`
- **Formato**: JSON estruturado
- **Rotação**: Configurável

#### **Exemplo de Log**
```json
{
  "timestamp": "2025-10-17T20:30:00.000Z",
  "event_type": "failed_login",
  "user_id": null,
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "details": {
    "email": "test@example.com",
    "reason": "invalid_credentials"
  }
}
```

## 🔧 Configurações

### **Variáveis de Ambiente**
```bash
# Chave secreta (obrigatória em produção)
SECRET_KEY=your-secret-key-here

# Rate limiting
RATELIMIT_STORAGE_URL=redis://localhost:6379/1

# HTTPS
HTTPS_ENABLED=true

# CSRF
WTF_CSRF_ENABLED=true
WTF_CSRF_TIME_LIMIT=3600
```

### **Configurações de Desenvolvimento**
```python
# config.py
WTF_CSRF_SSL_STRICT = False  # Para desenvolvimento
RATELIMIT_STORAGE_URL = 'memory://'  # Para desenvolvimento
```

## 📊 Monitoramento

### **Métricas de Segurança**
- Tentativas de login falhadas por IP
- Acessos suspeitos
- Violações de rate limit
- Erros de validação
- Tentativas de CSRF

### **Alertas Recomendados**
- Mais de 5 tentativas de login falhadas por IP em 1 hora
- Mais de 100 requisições por minuto de um IP
- Tentativas de acesso a endpoints não existentes
- Padrões de atividade suspeita

## 🚀 Implementação

### **1. Instalação de Dependências**
```bash
pip install -r requirements.txt
```

### **2. Configuração de Logs**
```bash
mkdir logs
chmod 755 logs
```

### **3. Configuração de Produção**
```bash
# Definir variáveis de ambiente
export SECRET_KEY="your-production-secret-key"
export RATELIMIT_STORAGE_URL="redis://your-redis-server:6379/1"
export HTTPS_ENABLED="true"
```

### **4. Verificação de Segurança**
```bash
# Verificar logs de segurança
tail -f logs/security.log

# Testar rate limiting
curl -X GET http://localhost:5000/api/stats
```

## 🔍 Testes de Segurança

### **Teste de Rate Limiting**
```bash
# Fazer 11 requisições rapidamente
for i in {1..11}; do curl http://localhost:5000/api/stats; done
```

### **Teste de Validação**
```bash
# Testar validação de email
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email", "name": "Test"}'
```

### **Teste de CSRF**
```bash
# Tentar acessar endpoint sem token CSRF
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "test@example.com"}'
```

## 📈 Próximos Passos

### **Melhorias Futuras**
1. **Autenticação 2FA**: Implementar autenticação de dois fatores
2. **Criptografia**: Criptografar dados sensíveis no banco
3. **Auditoria**: Sistema de auditoria completo
4. **Detecção de Anomalias**: IA para detectar comportamentos suspeitos
5. **Backup Seguro**: Backup criptografado dos dados
6. **Penetration Testing**: Testes de penetração regulares

### **Monitoramento Avançado**
1. **Dashboard de Segurança**: Interface para monitorar eventos
2. **Alertas em Tempo Real**: Notificações por email/SMS
3. **Relatórios de Segurança**: Relatórios automáticos
4. **Integração SIEM**: Integração com sistemas SIEM

## ⚠️ Considerações Importantes

### **Desenvolvimento vs Produção**
- **Desenvolvimento**: Configurações mais permissivas para facilitar desenvolvimento
- **Produção**: Configurações restritivas e monitoramento ativo

### **Performance**
- Rate limiting pode impactar performance em alta carga
- Logs de segurança podem gerar muitos arquivos
- CSP pode quebrar funcionalidades se muito restritivo

### **Manutenção**
- Revisar logs de segurança regularmente
- Atualizar dependências de segurança
- Testar configurações após mudanças
- Monitorar métricas de segurança

---

**Sistema de Segurança implementado com sucesso!** 🛡️

Para mais informações, consulte os arquivos de configuração em `app/security/` e os logs em `logs/security.log`.
