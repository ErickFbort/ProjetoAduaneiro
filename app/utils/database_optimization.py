"""
Otimizações de Banco de Dados para o Projeto Aduaneiro
Implementa índices, otimizações de queries e cache de consultas
"""

from app import db
from app.models.user import User
from app.models.veiculo import Veiculo
from app.models.entidade import Entidade
from app.utils.cache import cached, cache_invalidate
from sqlalchemy import Index, text
import logging

logger = logging.getLogger(__name__)

def create_database_indexes():
    """Cria índices para otimizar queries frequentes"""
    try:
        # Índices para User
        db.session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_user_email ON user (email);
        """))
        
        db.session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_user_status ON user (status);
        """))
        
        db.session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_user_group ON user (group);
        """))
        
        db.session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_user_created_at ON user (created_at);
        """))
        
        # Índices para Veiculo
        db.session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_veiculo_placa ON veiculo (placa);
        """))
        
        db.session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_veiculo_tipo ON veiculo (tipo);
        """))
        
        db.session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_veiculo_estado ON veiculo (estado);
        """))
        
        db.session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_veiculo_status ON veiculo (status);
        """))
        
        db.session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_veiculo_created_at ON veiculo (created_at);
        """))
        
        # Índices para Entidade
        db.session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_entidade_cnpj ON entidade (cnpj);
        """))
        
        db.session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_entidade_tipo ON entidade (tipo);
        """))
        
        db.session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_entidade_tipo_cliente ON entidade (tipo_cliente);
        """))
        
        db.session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_entidade_status ON entidade (status);
        """))
        
        db.session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_entidade_created_at ON entidade (created_at);
        """))
        
        # Índices compostos para queries complexas
        db.session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_user_status_group ON user (status, group);
        """))
        
        db.session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_veiculo_tipo_estado ON veiculo (tipo, estado);
        """))
        
        db.session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_entidade_tipo_status ON entidade (tipo, status);
        """))
        
        db.session.commit()
        logger.info("Índices de banco de dados criados com sucesso")
        return True
        
    except Exception as e:
        logger.error(f"Erro ao criar índices: {e}")
        db.session.rollback()
        return False

def get_user_stats():
    """Estatísticas de usuários com cache"""
    try:
        return {
            'total': User.query.count(),
            'active': User.query.filter_by(status='active').count(),
            'blocked': User.query.filter_by(status='blocked').count(),
            'by_group': db.session.query(
                User.group, 
                db.func.count(User.id)
            ).group_by(User.group).all()
        }
    except Exception as e:
        logger.error(f"Erro ao buscar estatísticas de usuários: {e}")
        return {
            'total': 0,
            'active': 0,
            'blocked': 0,
            'by_group': []
        }

def get_vehicle_stats():
    """Estatísticas de veículos com cache"""
    try:
        return {
            'total': Veiculo.query.count(),
            'active': Veiculo.query.filter_by(status='active').count(),
            'blocked': Veiculo.query.filter_by(status='blocked').count(),
            'by_type': db.session.query(
                Veiculo.tipo, 
                db.func.count(Veiculo.id)
            ).group_by(Veiculo.tipo).all()
        }
    except Exception as e:
        logger.error(f"Erro ao buscar estatísticas de veículos: {e}")
        return {
            'total': 0,
            'active': 0,
            'blocked': 0,
            'by_type': []
        }

def get_entity_stats():
    """Estatísticas de entidades com cache"""
    try:
        return {
            'total': Entidade.query.count(),
            'active': Entidade.query.filter_by(status='active').count(),
            'blocked': Entidade.query.filter_by(status='blocked').count(),
            'by_type': db.session.query(
                Entidade.tipo, 
                db.func.count(Entidade.id)
            ).group_by(Entidade.tipo).all()
        }
    except Exception as e:
        logger.error(f"Erro ao buscar estatísticas de entidades: {e}")
        return {
            'total': 0,
            'active': 0,
            'blocked': 0,
            'by_type': []
        }

@cached(timeout=600, key_prefix="reports")  # Cache por 10 minutos
def get_monthly_stats():
    """Estatísticas mensais com cache"""
    from datetime import datetime, timedelta
    
    twelve_months_ago = datetime.now() - timedelta(days=365)
    
    return {
        'users': db.session.query(
            db.func.strftime('%Y-%m', User.created_at).label('month'),
            db.func.count(User.id)
        ).filter(User.created_at >= twelve_months_ago).group_by('month').all(),
        
        'vehicles': db.session.query(
            db.func.strftime('%Y-%m', Veiculo.created_at).label('month'),
            db.func.count(Veiculo.id)
        ).filter(Veiculo.created_at >= twelve_months_ago).group_by('month').all(),
        
        'entities': db.session.query(
            db.func.strftime('%Y-%m', Entidade.created_at).label('month'),
            db.func.count(Entidade.id)
        ).filter(Entidade.created_at >= twelve_months_ago).group_by('month').all()
    }

def optimize_queries():
    """Aplica otimizações nas queries mais comuns"""
    return {
        'get_user_stats': get_user_stats,
        'get_vehicle_stats': get_vehicle_stats,
        'get_entity_stats': get_entity_stats,
        'get_monthly_stats': get_monthly_stats
    }

def get_optimized_user_query(filters=None, page=1, per_page=25):
    """Query otimizada para usuários com paginação e filtros"""
    query = User.query
    
    if filters:
        if filters.get('search'):
            search_term = f"%{filters['search']}%"
            query = query.filter(
                db.or_(
                    User.name.ilike(search_term),
                    User.email.ilike(search_term)
                )
            )
        
        if filters.get('group'):
            query = query.filter(User.group == filters['group'])
        
        if filters.get('status'):
            query = query.filter(User.status == filters['status'])
    
    # Ordenação otimizada
    query = query.order_by(User.created_at.desc())
    
    # Paginação
    return query.paginate(
        page=page, 
        per_page=per_page, 
        error_out=False
    )

def get_optimized_vehicle_query(filters=None, page=1, per_page=25):
    """Query otimizada para veículos com paginação e filtros"""
    query = Veiculo.query
    
    if filters:
        if filters.get('search'):
            search_term = f"%{filters['search']}%"
            query = query.filter(
                db.or_(
                    Veiculo.placa.ilike(search_term),
                    Veiculo.modelo.ilike(search_term),
                    Veiculo.motorista.ilike(search_term)
                )
            )
        
        if filters.get('tipo'):
            query = query.filter(Veiculo.tipo == filters['tipo'])
        
        if filters.get('estado'):
            query = query.filter(Veiculo.estado == filters['estado'])
        
        if filters.get('status'):
            query = query.filter(Veiculo.status == filters['status'])
    
    # Ordenação otimizada
    query = query.order_by(Veiculo.created_at.desc())
    
    # Paginação
    return query.paginate(
        page=page, 
        per_page=per_page, 
        error_out=False
    )

def get_optimized_entity_query(filters=None, page=1, per_page=25):
    """Query otimizada para entidades com paginação e filtros"""
    query = Entidade.query
    
    if filters:
        if filters.get('search'):
            search_term = f"%{filters['search']}%"
            query = query.filter(
                db.or_(
                    Entidade.nome.ilike(search_term),
                    Entidade.cnpj.ilike(search_term),
                    Entidade.razao_social.ilike(search_term)
                )
            )
        
        if filters.get('tipo'):
            query = query.filter(Entidade.tipo == filters['tipo'])
        
        if filters.get('tipo_cliente'):
            query = query.filter(Entidade.tipo_cliente == filters['tipo_cliente'])
        
        if filters.get('pagamento'):
            query = query.filter(Entidade.pagamento == filters['pagamento'])
        
        if filters.get('status'):
            query = query.filter(Entidade.status == filters['status'])
    
    # Ordenação otimizada
    query = query.order_by(Entidade.created_at.desc())
    
    # Paginação
    return query.paginate(
        page=page, 
        per_page=per_page, 
        error_out=False
    )

def invalidate_related_cache(model_name, record_id=None):
    """Invalida cache relacionado a mudanças nos dados"""
    patterns = [
        f"stats:{model_name}*",
        f"reports:*{model_name}*",
        f"query:{model_name}*"
    ]
    
    if record_id:
        patterns.append(f"record:{model_name}:{record_id}")
    
    for pattern in patterns:
        cache_invalidate(pattern)
    
    logger.info(f"Cache invalidado para {model_name} (ID: {record_id})")

def get_database_performance_stats():
    """Retorna estatísticas de performance do banco"""
    try:
        # Estatísticas de tabelas
        user_count = User.query.count()
        vehicle_count = Veiculo.query.count()
        entity_count = Entidade.query.count()
        
        # Verificar se índices existem
        indexes_query = text("""
            SELECT name FROM sqlite_master 
            WHERE type='index' AND name LIKE 'idx_%'
        """)
        indexes = db.session.execute(indexes_query).fetchall()
        
        return {
            'total_records': {
                'users': user_count,
                'vehicles': vehicle_count,
                'entities': entity_count
            },
            'indexes_count': len(indexes),
            'indexes': [idx[0] for idx in indexes],
            'database_size': db.session.execute(text("""
                SELECT page_count * page_size as size 
                FROM pragma_page_count(), pragma_page_size()
            """)).fetchone()[0] if db.engine.dialect.name == 'sqlite' else 'N/A'
        }
    except Exception as e:
        logger.error(f"Erro ao obter estatísticas de performance: {e}")
        return {'error': str(e)}
