# 🚀 Deploy Rápido - Projeto Aduaneiro

## 🎯 **Opções de Deploy (Escolha uma)**

---

## **1. 🥇 HEROKU (Mais Fácil - Recomendado)**

### **Passo a Passo:**

**1.1 Preparar o Projeto:**
```bash
# Os arquivos já estão criados:
# ✅ Procfile
# ✅ runtime.txt
# ✅ gunicorn.conf.py
# ✅ railway.json
```

**1.2 Instalar Heroku CLI:**
- Windows: [Download](https://devcenter.heroku.com/articles/heroku-cli)
- Linux/Mac: `curl https://cli-assets.heroku.com/install.sh | sh`

**1.3 Deploy:**
```bash
# Login no Heroku
heroku login

# Criar app
heroku create projeto-aduaneiro-seu-nome

# Adicionar banco PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Adicionar Redis
heroku addons:create heroku-redis:hobby-dev

# Configurar variáveis
heroku config:set SECRET_KEY="sua-chave-super-secreta-123456"
heroku config:set FLASK_ENV=production

# Deploy
git add .
git commit -m "Deploy para Heroku"
git push heroku main

# Executar migrações
heroku run python -c "from app import create_app, db; app = create_app(); app.app_context().push(); db.create_all()"

# Abrir no navegador
heroku open
```

**✅ Pronto! Seu site estará online em: `https://projeto-aduaneiro-seu-nome.herokuapp.com`**

---

## **2. 🥈 RAILWAY (Alternativa Moderna)**

### **Passo a Passo:**

**2.1 Acessar Railway:**
- Vá para [railway.app](https://railway.app)
- Faça login com GitHub

**2.2 Conectar Repositório:**
- Clique em "New Project"
- Selecione "Deploy from GitHub repo"
- Escolha seu repositório

**2.3 Configurar Variáveis:**
- Vá em "Variables"
- Adicione:
  ```
  SECRET_KEY=sua-chave-super-secreta-123456
  FLASK_ENV=production
  ```

**2.4 Deploy Automático:**
- Railway fará o deploy automaticamente
- Aguarde alguns minutos

**✅ Pronto! Seu site estará online na URL fornecida pelo Railway**

---

## **3. 🥉 DIGITAL OCEAN (VPS Completo)**

### **Passo a Passo:**

**3.1 Criar Droplet:**
- Acesse [Digital Ocean](https://digitalocean.com)
- Crie um droplet Ubuntu 22.04
- Escolha o plano $12/mês (2GB RAM)

**3.2 Conectar via SSH:**
```bash
ssh root@seu-ip
```

**3.3 Instalar Dependências:**
```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar Python, Node.js, PostgreSQL, Redis
apt install python3.11 python3.11-venv python3-pip nginx redis-server postgresql postgresql-contrib git -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
```

**3.4 Configurar Aplicação:**
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

**3.5 Configurar Nginx:**
```bash
# Criar arquivo de configuração
cat > /etc/nginx/sites-available/projeto-aduaneiro << EOF
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /static/ {
        alias /root/ProjetoAduaneiro/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Ativar site
ln -s /etc/nginx/sites-available/projeto-aduaneiro /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

**3.6 Executar Aplicação:**
```bash
# Usar Gunicorn
gunicorn --config gunicorn.conf.py main:app

# Ou usar PM2 para gerenciar processo
npm install -g pm2
pm2 start gunicorn --name "projeto-aduaneiro" -- --config gunicorn.conf.py main:app
pm2 save
pm2 startup
```

**✅ Pronto! Seu site estará online em: `http://seu-ip`**

---

## **🔧 Configurações Importantes**

### **Variáveis de Ambiente:**
```bash
# Copie o arquivo env.example para .env
cp env.example .env

# Edite as variáveis necessárias
nano .env
```

### **Principais Variáveis:**
- `SECRET_KEY`: Chave secreta para sessões
- `DATABASE_URL`: URL do banco de dados
- `REDIS_URL`: URL do Redis (opcional)
- `FLASK_ENV`: production

---

## **📊 Comparação das Opções**

| Opção | Dificuldade | Custo | Controle | Performance |
|-------|-------------|-------|----------|-------------|
| **Heroku** | ⭐ Fácil | $7-25/mês | Baixo | Boa |
| **Railway** | ⭐ Fácil | $5-20/mês | Médio | Boa |
| **Digital Ocean** | ⭐⭐⭐ Difícil | $12-24/mês | Alto | Excelente |

---

## **🚀 Próximos Passos Após Deploy**

1. **Testar a aplicação** - Verificar se tudo funciona
2. **Configurar domínio** - Apontar seu domínio para o servidor
3. **Configurar SSL** - Usar Let's Encrypt para HTTPS
4. **Configurar backup** - Executar `./backup.sh` regularmente
5. **Monitorar** - Verificar logs e performance

---

## **🆘 Solução de Problemas**

### **Erro de Dependências:**
```bash
pip install -r requirements.txt
npm install
```

### **Erro de Banco:**
```bash
python -c "from app import create_app, db; app = create_app(); app.app_context().push(); db.create_all()"
```

### **Erro de Build React:**
```bash
npm run build
```

### **Verificar Logs:**
```bash
# Heroku
heroku logs --tail

# Digital Ocean
tail -f logs/application.log
```

---

## **✅ Checklist de Deploy**

- [ ] Repositório atualizado no GitHub
- [ ] Arquivos de configuração criados
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados configurado
- [ ] Build do React executado
- [ ] Aplicação testada
- [ ] Domínio configurado (opcional)
- [ ] SSL configurado (opcional)
- [ ] Backup configurado

---

**🎉 Parabéns! Seu Projeto Aduaneiro está online!** 🚀
