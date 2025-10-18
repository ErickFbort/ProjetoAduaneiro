#!/bin/bash
# Script de Deploy Automático - Projeto Aduaneiro

set -e  # Parar em caso de erro

echo "🚀 Iniciando deploy do Projeto Aduaneiro..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERRO: $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] AVISO: $1${NC}"
}

# Verificar se estamos no diretório correto
if [ ! -f "main.py" ]; then
    error "Execute este script no diretório raiz do projeto"
fi

# Verificar se o git está limpo
if [ -n "$(git status --porcelain)" ]; then
    warning "Existem mudanças não commitadas. Continuando mesmo assim..."
fi

log "Atualizando código do repositório..."
git pull origin main || error "Falha ao atualizar código"

log "Ativando ambiente virtual..."
if [ -d "venv" ]; then
    source venv/bin/activate
else
    error "Ambiente virtual não encontrado. Execute: python -m venv venv"
fi

log "Instalando dependências Python..."
pip install -r requirements.txt || error "Falha ao instalar dependências Python"

log "Instalando dependências Node.js..."
npm install || error "Falha ao instalar dependências Node.js"

log "Fazendo build do React..."
npm run build || error "Falha no build do React"

log "Executando migrações do banco de dados..."
python -c "
from app import create_app, db
app = create_app()
with app.app_context():
    db.create_all()
    print('Migrações executadas com sucesso')
" || error "Falha nas migrações do banco"

log "Verificando configurações..."
python -c "
from app import create_app
app = create_app()
print('Configurações carregadas com sucesso')
" || error "Falha ao carregar configurações"

# Verificar se é produção
if [ "$FLASK_ENV" = "production" ]; then
    log "Configurações de produção detectadas"
    
    # Verificar se o Gunicorn está instalado
    if ! command -v gunicorn &> /dev/null; then
        error "Gunicorn não encontrado. Instale com: pip install gunicorn"
    fi
    
    # Verificar se o Redis está rodando (se configurado)
    if [ ! -z "$REDIS_URL" ]; then
        log "Verificando conexão com Redis..."
        python -c "
import redis
import os
try:
    r = redis.from_url(os.environ.get('REDIS_URL'))
    r.ping()
    print('Redis conectado com sucesso')
except Exception as e:
    print(f'AVISO: Redis não disponível: {e}')
        "
    fi
fi

log "Deploy concluído com sucesso! 🎉"

# Mostrar próximos passos
echo ""
echo "📋 Próximos passos:"
echo "1. Reiniciar o servidor web (se necessário)"
echo "2. Verificar logs: tail -f logs/application.log"
echo "3. Testar a aplicação: curl http://localhost:5000/health"
echo "4. Verificar métricas de performance"

echo ""
echo "✅ Projeto Aduaneiro está online!"
