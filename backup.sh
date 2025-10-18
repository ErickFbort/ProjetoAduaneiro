#!/bin/bash
# Script de Backup - Projeto Aduaneiro

set -e

# Configurações
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/projeto-aduaneiro"
PROJECT_DIR=$(pwd)

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] AVISO: $1${NC}"
}

log "Iniciando backup do Projeto Aduaneiro..."

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup do banco de dados
log "Fazendo backup do banco de dados..."
if [ ! -z "$DATABASE_URL" ]; then
    # PostgreSQL
    pg_dump $DATABASE_URL > $BACKUP_DIR/database_$DATE.sql
    log "Backup do banco PostgreSQL criado: database_$DATE.sql"
else
    # SQLite
    if [ -f "instance/projeto_aduaneiro.db" ]; then
        cp instance/projeto_aduaneiro.db $BACKUP_DIR/database_$DATE.db
        log "Backup do banco SQLite criado: database_$DATE.db"
    else
        warning "Banco de dados não encontrado"
    fi
fi

# Backup dos uploads
log "Fazendo backup dos uploads..."
if [ -d "static/uploads" ]; then
    tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz static/uploads/
    log "Backup dos uploads criado: uploads_$DATE.tar.gz"
else
    warning "Diretório de uploads não encontrado"
fi

# Backup dos logs
log "Fazendo backup dos logs..."
if [ -d "logs" ]; then
    tar -czf $BACKUP_DIR/logs_$DATE.tar.gz logs/
    log "Backup dos logs criado: logs_$DATE.tar.gz"
else
    warning "Diretório de logs não encontrado"
fi

# Backup da configuração
log "Fazendo backup da configuração..."
tar -czf $BACKUP_DIR/config_$DATE.tar.gz config.py .env* requirements.txt package.json

# Backup do código (opcional)
log "Fazendo backup do código..."
git archive --format=tar.gz --output=$BACKUP_DIR/code_$DATE.tar.gz HEAD

# Limpar backups antigos (manter últimos 7 dias)
log "Limpando backups antigos..."
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

# Mostrar estatísticas
log "Backup concluído com sucesso!"
echo ""
echo "📊 Estatísticas do backup:"
echo "Diretório: $BACKUP_DIR"
echo "Data: $DATE"
echo ""

# Listar arquivos criados
echo "📁 Arquivos criados:"
ls -lh $BACKUP_DIR/*$DATE* 2>/dev/null || echo "Nenhum arquivo encontrado"

echo ""
echo "💾 Tamanho total do backup:"
du -sh $BACKUP_DIR

echo ""
echo "✅ Backup do Projeto Aduaneiro concluído!"
