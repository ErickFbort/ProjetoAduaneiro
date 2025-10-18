# 🚀 Guia de Deploy - Projeto Aduaneiro

## 📋 Visão Geral

Este guia apresenta as melhores opções para hospedar o Projeto Aduaneiro na web, considerando a arquitetura híbrida Flask + React e os requisitos de performance e segurança.

---

## 🎯 **Opções de Hospedagem Recomendadas**

### **1. 🥇 HEROKU (Recomendado para Início)**

#### **Vantagens:**
- ✅ **Deploy simples** com Git
- ✅ **Suporte nativo** para Python/Flask
- ✅ **Add-ons** para Redis e PostgreSQL
- ✅ **SSL automático**
- ✅ **Escalabilidade** fácil

#### **Configuração:**

**1.1 Preparar o Projeto:**
```bash
# Criar Procfile
echo "web: gunicorn main:app" > Procfile

# Criar runtime.txt
echo "python-3.11.0" > runtime.txt

# Atualizar requirements.txt para produção
echo "psycopg2-binary==2.9.9" >> requirements.txt
```

**1.2 Arquivos de Configuração:**
```python
# config.py - Adicionar configuração Heroku
class HerokuConfig(ProductionConfig):
    """Configuração para Heroku"""
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    REDIS_URL = os.environ.get('REDIS_URL')
    RATELIMIT_STORAGE_URL = os.environ.get('REDIS_URL', 'memory://')
```

**1.3 Deploy:**
```bash
# Instalar Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Criar app
heroku create projeto-aduaneiro

# Adicionar add-ons
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev

# Configurar variáveis
heroku config:set SECRET_KEY="sua-chave-super-secreta"
heroku config:set FLASK_ENV=production
heroku config:set CACHE_TYPE=redis

# Deploy
git add .
git commit -m "Deploy para Heroku"
git push heroku main

# Executar migrações
heroku run python -c "from app import create_app, db; app = create_app(); app.app_context().push(); db.create_all()"
```

**1.4 Build do React:**
```bash
# Adicionar ao package.json
{
  "scripts": {
    "heroku-postbuild": "npm install && npm run build"
  }
}
```

---

### **2. 🥈 RAILWAY (Alternativa Moderna)**

#### **Vantagens:**
- ✅ **Deploy automático** do GitHub
- ✅ **Suporte nativo** para Python e Node.js
- ✅ **Banco PostgreSQL** incluído
- ✅ **Redis** disponível
- ✅ **Preço competitivo**

#### **Configuração:**

**2.1 Preparar o Projeto:**
```yaml
# railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "gunicorn main:app",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**2.2 Deploy:**
1. Conectar repositório GitHub
2. Configurar variáveis de ambiente
3. Deploy automático

---

### **3. 🥉 DIGITAL OCEAN (VPS Completo)**

#### **Vantagens:**
- ✅ **Controle total** do servidor
- ✅ **Performance** superior
- ✅ **Custo-benefício** para projetos grandes
- ✅ **Flexibilidade** máxima

#### **Configuração:**

**3.1 Droplet Setup:**
```bash
# Ubuntu 22.04 LTS
# 2GB RAM, 1 CPU, 50GB SSD (mínimo)

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install python3.11 python3.11-venv python3-pip nginx redis-server postgresql postgresql-contrib git -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**3.2 Configurar Aplicação:**
```bash
# Clonar repositório
git clone https://github.com/ErickFbort/ProjetoAduaneiro.git
cd ProjetoAduaneiro

# Criar ambiente virtual
python3.11 -m venv venv
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
npm install

# Build do React
npm run build

# Configurar banco
sudo -u postgres createdb projeto_aduaneiro
sudo -u postgres psql -c "CREATE USER aduaneiro WITH PASSWORD 'senha_segura';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE projeto_aduaneiro TO aduaneiro;"
```

**3.3 Configurar Nginx:**
```nginx
# /etc/nginx/sites-available/projeto-aduaneiro
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /path/to/ProjetoAduaneiro/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**3.4 Configurar Gunicorn:**
```bash
# gunicorn.conf.py
bind = "127.0.0.1:5000"
workers = 4
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 100
```

**3.5 Configurar Systemd:**
```ini
# /etc/systemd/system/projeto-aduaneiro.service
[Unit]
Description=Projeto Aduaneiro
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/ProjetoAduaneiro
Environment=PATH=/path/to/ProjetoAduaneiro/venv/bin
ExecStart=/path/to/ProjetoAduaneiro/venv/bin/gunicorn --config gunicorn.conf.py main:app
Restart=always

[Install]
WantedBy=multi-user.target
```

---

## 🔧 **Configurações de Produção**

### **1. Variáveis de Ambiente**
```bash
# .env.production
FLASK_ENV=production
SECRET_KEY=sua-chave-super-secreta-aqui
DATABASE_URL=postgresql://usuario:senha@localhost:5432/projeto_aduaneiro
REDIS_URL=redis://localhost:6379/0
RATELIMIT_STORAGE_URL=redis://localhost:6379/1
HTTPS_ENABLED=true
WTF_CSRF_SSL_STRICT=true
```

### **2. Configuração de Segurança**
```python
# config.py - Produção
class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    WTF_CSRF_SSL_STRICT = True
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)
```

### **3. Configuração de Cache**
```python
# Redis para produção
CACHE_TYPE = 'redis'
CACHE_REDIS_URL = os.environ.get('REDIS_URL')
CACHE_DEFAULT_TIMEOUT = 3600
CACHE_KEY_PREFIX = 'aduaneiro_prod'
```

---

## 📊 **Monitoramento e Logs**

### **1. Logs Estruturados**
```python
# logging_config.py
import logging
from logging.handlers import RotatingFileHandler

def setup_logging(app):
    if not app.debug:
        file_handler = RotatingFileHandler('logs/projeto_aduaneiro.log', maxBytes=10240, backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('Projeto Aduaneiro startup')
```

### **2. Health Check**
```python
# app/routes/health.py
@app.route('/health')
def health_check():
    return {
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    }
```

---

## 🚀 **Scripts de Deploy**

### **1. Script de Deploy Automático**
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Iniciando deploy do Projeto Aduaneiro..."

# Atualizar código
git pull origin main

# Ativar ambiente virtual
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
npm install

# Build do React
npm run build

# Executar migrações
python -c "from app import create_app, db; app = create_app(); app.app_context().push(); db.create_all()"

# Reiniciar serviços
sudo systemctl restart projeto-aduaneiro
sudo systemctl reload nginx

echo "✅ Deploy concluído com sucesso!"
```

### **2. Script de Backup**
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/projeto-aduaneiro"

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup do banco
pg_dump projeto_aduaneiro > $BACKUP_DIR/database_$DATE.sql

# Backup dos uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz static/uploads/

# Backup dos logs
tar -czf $BACKUP_DIR/logs_$DATE.tar.gz logs/

echo "✅ Backup criado: $BACKUP_DIR"
```

---

## 🔒 **Configurações de Segurança**

### **1. SSL/TLS**
```bash
# Certbot para Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

### **2. Firewall**
```bash
# UFW
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### **3. Fail2Ban**
```bash
# Proteção contra ataques
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

---

## 📈 **Otimizações de Performance**

### **1. CDN (Cloudflare)**
- Configurar Cloudflare para assets estáticos
- Habilitar compressão
- Configurar cache rules

### **2. Database Optimization**
```sql
-- Índices para produção
CREATE INDEX CONCURRENTLY idx_user_email ON user (email);
CREATE INDEX CONCURRENTLY idx_user_status ON user (status);
CREATE INDEX CONCURRENTLY idx_veiculo_placa ON veiculo (placa);
CREATE INDEX CONCURRENTLY idx_entidade_cnpj ON entidade (cnpj);
```

### **3. Redis Configuration**
```conf
# redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

---

## 🎯 **Recomendação Final**

### **Para Iniciantes:**
1. **Heroku** - Deploy mais simples
2. **Railway** - Alternativa moderna

### **Para Produção:**
1. **Digital Ocean** - Controle total
2. **AWS/GCP** - Escalabilidade máxima

### **Custo Estimado:**
- **Heroku**: $7-25/mês
- **Railway**: $5-20/mês
- **Digital Ocean**: $12-24/mês
- **AWS/GCP**: $20-100+/mês

---

## 🚀 **Próximos Passos**

1. **Escolher** uma opção de hospedagem
2. **Configurar** variáveis de ambiente
3. **Fazer** o primeiro deploy
4. **Configurar** monitoramento
5. **Implementar** backup automático
6. **Otimizar** performance

**O Projeto Aduaneiro está pronto para produção!** 🎉
