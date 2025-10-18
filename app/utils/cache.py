"""
Sistema de Cache para o Projeto Aduaneiro
Implementa cache Redis com fallback para memória local
"""

import json
import pickle
import hashlib
from typing import Any, Optional, Union, Callable
from functools import wraps
from datetime import datetime, timedelta
import redis
from flask import current_app
import logging

logger = logging.getLogger(__name__)

class CacheManager:
    """Gerenciador de cache com Redis e fallback para memória local"""
    
    def __init__(self, app=None):
        self.redis_client = None
        self.memory_cache = {}
        self.app = app
        
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        """Inicializa o cache com a aplicação Flask"""
        self.app = app
        
        # Configurações do Redis
        redis_host = app.config.get('REDIS_HOST', 'localhost')
        redis_port = app.config.get('REDIS_PORT', 6379)
        redis_db = app.config.get('REDIS_DB', 0)
        redis_password = app.config.get('REDIS_PASSWORD')
        
        try:
            # Tentar conectar ao Redis
            self.redis_client = redis.Redis(
                host=redis_host,
                port=redis_port,
                db=redis_db,
                password=redis_password,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5
            )
            # Testar conexão
            self.redis_client.ping()
            logger.info("Cache Redis conectado com sucesso")
        except Exception as e:
            logger.warning(f"Redis não disponível, usando cache em memória: {e}")
            self.redis_client = None
    
    def _generate_key(self, key: str, prefix: str = "aduaneiro") -> str:
        """Gera uma chave única para o cache"""
        return f"{prefix}:{key}"
    
    def _serialize(self, data: Any) -> str:
        """Serializa dados para armazenamento"""
        try:
            return json.dumps(data, default=str)
        except (TypeError, ValueError):
            # Fallback para pickle se JSON falhar
            return pickle.dumps(data).hex()
    
    def _deserialize(self, data: str) -> Any:
        """Deserializa dados do cache"""
        try:
            return json.loads(data)
        except (TypeError, ValueError, json.JSONDecodeError):
            try:
                # Tentar deserializar com pickle
                return pickle.loads(bytes.fromhex(data))
            except Exception:
                return data
    
    def get(self, key: str, default: Any = None) -> Any:
        """Recupera dados do cache"""
        cache_key = self._generate_key(key)
        
        # Tentar Redis primeiro
        if self.redis_client:
            try:
                data = self.redis_client.get(cache_key)
                if data:
                    return self._deserialize(data)
            except Exception as e:
                logger.warning(f"Erro ao recuperar do Redis: {e}")
        
        # Fallback para memória local
        return self.memory_cache.get(cache_key, default)
    
    def set(self, key: str, value: Any, timeout: int = 3600) -> bool:
        """Armazena dados no cache"""
        cache_key = self._generate_key(key)
        serialized_data = self._serialize(value)
        
        # Tentar Redis primeiro
        if self.redis_client:
            try:
                self.redis_client.setex(cache_key, timeout, serialized_data)
                return True
            except Exception as e:
                logger.warning(f"Erro ao armazenar no Redis: {e}")
        
        # Fallback para memória local
        self.memory_cache[cache_key] = {
            'value': value,
            'expires': datetime.now() + timedelta(seconds=timeout)
        }
        return True
    
    def delete(self, key: str) -> bool:
        """Remove dados do cache"""
        cache_key = self._generate_key(key)
        
        # Tentar Redis primeiro
        if self.redis_client:
            try:
                self.redis_client.delete(cache_key)
            except Exception as e:
                logger.warning(f"Erro ao deletar do Redis: {e}")
        
        # Fallback para memória local
        self.memory_cache.pop(cache_key, None)
        return True
    
    def clear(self) -> bool:
        """Limpa todo o cache"""
        # Tentar Redis primeiro
        if self.redis_client:
            try:
                self.redis_client.flushdb()
            except Exception as e:
                logger.warning(f"Erro ao limpar Redis: {e}")
        
        # Fallback para memória local
        self.memory_cache.clear()
        return True
    
    def exists(self, key: str) -> bool:
        """Verifica se uma chave existe no cache"""
        cache_key = self._generate_key(key)
        
        # Tentar Redis primeiro
        if self.redis_client:
            try:
                return bool(self.redis_client.exists(cache_key))
            except Exception as e:
                logger.warning(f"Erro ao verificar existência no Redis: {e}")
        
        # Fallback para memória local
        if cache_key in self.memory_cache:
            item = self.memory_cache[cache_key]
            if item['expires'] > datetime.now():
                return True
            else:
                del self.memory_cache[cache_key]
        
        return False
    
    def get_or_set(self, key: str, func: Callable, timeout: int = 3600) -> Any:
        """Recupera do cache ou executa função e armazena resultado"""
        cached_value = self.get(key)
        if cached_value is not None:
            return cached_value
        
        # Executar função e armazenar resultado
        result = func()
        self.set(key, result, timeout)
        return result

# Instância global do cache
cache_manager = CacheManager()

def cache_key(*args, **kwargs) -> str:
    """Gera chave de cache baseada nos argumentos"""
    key_data = {
        'args': args,
        'kwargs': sorted(kwargs.items())
    }
    key_string = json.dumps(key_data, sort_keys=True, default=str)
    return hashlib.md5(key_string.encode()).hexdigest()

def cached(timeout: int = 3600, key_prefix: str = "func"):
    """Decorator para cache de funções"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Gerar chave única baseada na função e argumentos
            key = f"{key_prefix}:{func.__name__}:{cache_key(*args, **kwargs)}"
            
            # Tentar recuperar do cache
            cached_result = cache_manager.get(key)
            if cached_result is not None:
                logger.debug(f"Cache hit para {func.__name__}")
                return cached_result
            
            # Executar função e armazenar resultado
            logger.debug(f"Cache miss para {func.__name__}, executando função")
            result = func(*args, **kwargs)
            cache_manager.set(key, result, timeout)
            return result
        
        return wrapper
    return decorator

def cache_invalidate(pattern: str):
    """Invalida cache baseado em padrão"""
    if cache_manager.redis_client:
        try:
            keys = cache_manager.redis_client.keys(f"aduaneiro:{pattern}*")
            if keys:
                cache_manager.redis_client.delete(*keys)
                logger.info(f"Cache invalidado para padrão: {pattern}")
        except Exception as e:
            logger.warning(f"Erro ao invalidar cache: {e}")
    
    # Invalidar cache em memória local
    keys_to_remove = [k for k in cache_manager.memory_cache.keys() if pattern in k]
    for key in keys_to_remove:
        del cache_manager.memory_cache[key]
    
    if keys_to_remove:
        logger.info(f"Cache em memória invalidado para padrão: {pattern}")

# Funções de conveniência
def get_cache_stats() -> dict:
    """Retorna estatísticas do cache"""
    stats = {
        'redis_available': cache_manager.redis_client is not None,
        'memory_cache_size': len(cache_manager.memory_cache)
    }
    
    if cache_manager.redis_client:
        try:
            info = cache_manager.redis_client.info()
            stats.update({
                'redis_used_memory': info.get('used_memory_human', 'N/A'),
                'redis_connected_clients': info.get('connected_clients', 0),
                'redis_keyspace_hits': info.get('keyspace_hits', 0),
                'redis_keyspace_misses': info.get('keyspace_misses', 0)
            })
        except Exception as e:
            stats['redis_error'] = str(e)
    
    return stats
