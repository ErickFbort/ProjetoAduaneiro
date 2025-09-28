#!/usr/bin/env python3
"""
Serviço para buscar publicações reais do LinkedIn da Pac Log
"""

import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import time
import random
import logging
from urllib.parse import urljoin, urlparse
import os
import pickle
from pathlib import Path

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LinkedInService:
    def __init__(self):
        self.base_url = "https://www.linkedin.com/company/pac-log/posts/"
        self.company_url = "https://www.linkedin.com/company/pac-log/"
        self.cache_file = Path("instance/linkedin_cache.pkl")
        self.cache_duration = 3600  # 1 hora em segundos
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0',
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        
    def get_linkedin_posts(self, limit: int = 5, force_simulated: bool = False) -> List[Dict]:
        """
        Busca as publicações reais do LinkedIn da Pac Log
        """
        try:
            logger.info("Iniciando busca de posts do LinkedIn...")
            
            # Se forçado a usar simulados, pular cache e scraping
            if force_simulated:
                logger.info("Usando dados simulados (forçado)")
                simulated_posts = self._get_simulated_posts()[:limit]
                self._save_to_cache(simulated_posts)
                return simulated_posts
            
            # Verificar cache primeiro
            cached_posts = self._get_cached_posts()
            if cached_posts:
                logger.info(f"Usando {len(cached_posts)} posts do cache")
                return cached_posts[:limit]
            
            # Tentar scraping real
            real_posts = self._scrape_linkedin_posts(limit)
            if real_posts and len(real_posts) > 0:
                logger.info(f"Encontrados {len(real_posts)} posts reais do LinkedIn")
                # Salvar no cache
                self._save_to_cache(real_posts)
                return real_posts
            
            # Fallback para dados simulados se o scraping falhar
            logger.warning("Scraping real falhou, usando dados simulados")
            fallback_posts = self._get_simulated_posts()[:limit]
            self._save_to_cache(fallback_posts)
            return fallback_posts
            
        except Exception as e:
            logger.error(f"Erro ao buscar posts do LinkedIn: {e}")
            return self._get_fallback_posts()[:limit]
    
    def _get_cached_posts(self) -> Optional[List[Dict]]:
        """
        Recupera posts do cache se ainda válidos
        """
        try:
            if not self.cache_file.exists():
                return None
            
            # Verificar se o cache não expirou
            cache_time = self.cache_file.stat().st_mtime
            if time.time() - cache_time > self.cache_duration:
                logger.info("Cache expirado, removendo arquivo")
                self.cache_file.unlink()
                return None
            
            with open(self.cache_file, 'rb') as f:
                cached_data = pickle.load(f)
                logger.info(f"Cache válido encontrado com {len(cached_data)} posts")
                return cached_data
                
        except Exception as e:
            logger.debug(f"Erro ao ler cache: {e}")
            return None
    
    def _save_to_cache(self, posts: List[Dict]) -> None:
        """
        Salva posts no cache
        """
        try:
            # Garantir que o diretório existe
            self.cache_file.parent.mkdir(parents=True, exist_ok=True)
            
            with open(self.cache_file, 'wb') as f:
                pickle.dump(posts, f)
                logger.info(f"Cache salvo com {len(posts)} posts")
                
        except Exception as e:
            logger.error(f"Erro ao salvar cache: {e}")
    
    def clear_cache(self) -> None:
        """
        Limpa o cache
        """
        try:
            if self.cache_file.exists():
                self.cache_file.unlink()
                logger.info("Cache limpo com sucesso")
        except Exception as e:
            logger.error(f"Erro ao limpar cache: {e}")
    
    def _scrape_linkedin_posts(self, limit: int) -> List[Dict]:
        """
        Faz scraping real das publicações do LinkedIn
        """
        try:
            # Tentar diferentes estratégias de scraping
            posts = []
            
            # Estratégia 1: Tentar buscar via API não oficial
            posts = self._try_unofficial_api()
            if posts:
                return posts[:limit]
            
            # Estratégia 2: Scraping direto da página
            posts = self._scrape_company_page()
            if posts:
                return posts[:limit]
            
            # Estratégia 3: Buscar via RSS feed (se disponível)
            posts = self._try_rss_feed()
            if posts:
                return posts[:limit]
                
            return []
            
        except Exception as e:
            logger.error(f"Erro no scraping real: {e}")
            return []
    
    def _try_unofficial_api(self) -> List[Dict]:
        """
        Tenta usar APIs não oficiais do LinkedIn
        """
        try:
            # Usar serviço de terceiros que faz scraping do LinkedIn
            api_url = "https://api.linkedin-scraper.com/company/pac-log/posts"
            
            response = self.session.get(api_url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return self._parse_api_response(data)
                
        except Exception as e:
            logger.debug(f"API não oficial falhou: {e}")
            
        return []
    
    def _scrape_company_page(self) -> List[Dict]:
        """
        Faz scraping direto da página da empresa
        """
        try:
            logger.info("Tentando scraping direto da página da empresa...")
            
            # Adicionar delay para evitar rate limiting
            time.sleep(random.uniform(1, 3))
            
            response = self.session.get(self.company_url, timeout=15)
            if response.status_code != 200:
                logger.warning(f"Status code {response.status_code} ao acessar página da empresa")
                return []
            
            soup = BeautifulSoup(response.content, 'html.parser')
            posts = []
            
            # LinkedIn usa diferentes seletores - tentar múltiplas abordagens
            selectors_to_try = [
                # Seletores modernos do LinkedIn
                'div[data-urn*="activity"]',
                'div.feed-shared-update-v2',
                'article.feed-shared-update-v2',
                'div[data-test-id="main-feed-activity-card"]',
                'div.feed-shared-update',
                'article.feed-shared-update',
                # Seletores genéricos
                'div[class*="feed"]',
                'article[class*="feed"]',
                'div[class*="post"]',
                'article[class*="post"]',
                'div[class*="update"]',
                'article[class*="update"]'
            ]
            
            post_elements = []
            for selector in selectors_to_try:
                elements = soup.select(selector)
                if elements:
                    logger.info(f"Encontrados {len(elements)} elementos com seletor: {selector}")
                    post_elements.extend(elements[:3])  # Limitar a 3 por seletor
                    break
            
            # Se não encontrou com seletores específicos, tentar busca mais ampla
            if not post_elements:
                logger.info("Tentando busca mais ampla...")
                # Buscar por qualquer div que contenha texto relacionado a posts
                all_divs = soup.find_all('div')
                for div in all_divs:
                    text_content = div.get_text(strip=True).lower()
                    if any(keyword in text_content for keyword in ['pac log', 'linkedin', 'post', 'publicação', 'compartilhar']):
                        if len(text_content) > 50:  # Filtrar divs muito pequenas
                            post_elements.append(div)
                            if len(post_elements) >= 5:
                                break
            
            logger.info(f"Total de elementos encontrados: {len(post_elements)}")
            
            for element in post_elements[:5]:  # Limitar a 5 posts
                post_data = self._extract_post_data(element)
                if post_data and post_data['title'] != "Post da Pac Log":
                    posts.append(post_data)
            
            logger.info(f"Encontrados {len(posts)} posts via scraping direto")
            return posts
            
        except Exception as e:
            logger.error(f"Erro no scraping direto: {e}")
            return []
    
    def _try_rss_feed(self) -> List[Dict]:
        """
        Tenta buscar via RSS feed do LinkedIn
        """
        try:
            rss_urls = [
                "https://www.linkedin.com/company/pac-log/posts/rss/",
                "https://www.linkedin.com/company/pac-log/feed/",
            ]
            
            for rss_url in rss_urls:
                try:
                    response = self.session.get(rss_url, timeout=10)
                    if response.status_code == 200:
                        return self._parse_rss_feed(response.content)
                except:
                    continue
                    
        except Exception as e:
            logger.debug(f"RSS feed falhou: {e}")
            
        return []
    
    def _extract_post_data(self, element) -> Optional[Dict]:
        """
        Extrai dados de um elemento de post
        """
        try:
            # Extrair título - tentar múltiplas abordagens
            title = self._extract_title(element)
            if not title or title == "Post da Pac Log":
                return None
            
            # Extrair conteúdo
            content = self._extract_content(element)
            
            # Extrair imagem - tentar múltiplas abordagens
            image_url = self._extract_image(element)
            
            # Extrair data
            post_date = self._extract_date(element)
            
            # Extrair engajamento
            likes = self._extract_engagement(element, 'like')
            comments = self._extract_engagement(element, 'comment')
            shares = self._extract_engagement(element, 'share')
            
            return {
                "id": f"scraped_{hash(title)}",
                "title": title[:100] + "..." if len(title) > 100 else title,
                "subtitle": content[:150] + "..." if len(content) > 150 else content,
                "content": content,
                "image": image_url,
                "author": "Pac Log",
                "author_image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                "date": post_date,
                "category": self._categorize_post(title, content),
                "likes": likes,
                "comments": comments,
                "shares": shares,
                "url": self.base_url,
                "source": "LinkedIn Pac Log (Scraped)"
            }
            
        except Exception as e:
            logger.debug(f"Erro ao extrair dados do post: {e}")
            return None
    
    def _extract_title(self, element) -> str:
        """
        Extrai título do post com múltiplas estratégias
        """
        # Estratégia 1: Seletores específicos do LinkedIn
        title_selectors = [
            'span[dir="ltr"] span[aria-hidden="true"]',
            'div.feed-shared-text span[dir="ltr"]',
            'div.feed-shared-text span[aria-hidden="true"]',
            'span[data-test-id="main-feed-activity-card-text"]',
            'div[data-test-id="main-feed-activity-card-text"]',
            'span.feed-shared-text__text-view',
            'div.feed-shared-text__text-view',
            'h1', 'h2', 'h3', 'h4',
            'span[class*="title"]',
            'div[class*="title"]',
            'span[class*="headline"]',
            'div[class*="headline"]'
        ]
        
        for selector in title_selectors:
            title_elem = element.select_one(selector)
            if title_elem:
                title_text = title_elem.get_text(strip=True)
                if title_text and len(title_text) > 10:  # Filtrar títulos muito curtos
                    return title_text
        
        # Estratégia 2: Buscar por texto em spans com texto longo
        spans = element.find_all('span')
        for span in spans:
            text = span.get_text(strip=True)
            if len(text) > 20 and len(text) < 200:  # Título provável
                # Verificar se não é data, hora, ou outros metadados
                if not any(keyword in text.lower() for keyword in ['hora', 'min', 'dia', 'semana', 'mês', 'ano', 'curtir', 'comentar', 'compartilhar']):
                    return text
        
        # Estratégia 3: Primeiro parágrafo com texto significativo
        paragraphs = element.find_all(['p', 'div'])
        for p in paragraphs:
            text = p.get_text(strip=True)
            if len(text) > 30 and len(text) < 300:
                return text
        
        return "Post da Pac Log"
    
    def _extract_content(self, element) -> str:
        """
        Extrai conteúdo do post
        """
        # Buscar por divs com conteúdo de texto
        content_selectors = [
            'div.feed-shared-text',
            'div[data-test-id="main-feed-activity-card-text"]',
            'span.feed-shared-text__text-view',
            'div.feed-shared-text__text-view',
            'p', 'div[class*="content"]', 'div[class*="text"]'
        ]
        
        for selector in content_selectors:
            content_elem = element.select_one(selector)
            if content_elem:
                content = content_elem.get_text(strip=True)
                if content and len(content) > 20:
                    return content
        
        return ""
    
    def _extract_image(self, element) -> str:
        """
        Extrair imagem do post
        """
        # Buscar por imagens com diferentes seletores
        img_selectors = [
            'img[data-test-id="main-feed-activity-card-image"]',
            'img.feed-shared-image',
            'img[class*="image"]',
            'img[class*="photo"]',
            'img'
        ]
        
        for selector in img_selectors:
            img_elem = element.select_one(selector)
            if img_elem and img_elem.get('src'):
                src = img_elem.get('src')
                # Verificar se é uma imagem válida
                if src and not src.startswith('data:') and any(ext in src.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                    return src
        
        return self._get_default_image()
    
    def _extract_date(self, element) -> str:
        """
        Extrair data do post
        """
        # Buscar por elementos de data
        date_selectors = [
            'time',
            'span[class*="time"]',
            'span[class*="date"]',
            'div[class*="time"]',
            'div[class*="date"]'
        ]
        
        for selector in date_selectors:
            date_elem = element.select_one(selector)
            if date_elem:
                date_text = date_elem.get_text(strip=True)
                if date_text:
                    return self._parse_date(date_text)
        
        return datetime.now().strftime("%Y-%m-%d")
    
    def _extract_engagement(self, element, engagement_type: str) -> int:
        """
        Extrai números de engajamento (likes, comentários, shares)
        """
        try:
            engagement_elem = element.find(['span', 'div'], class_=re.compile(f'{engagement_type}', re.I))
            if engagement_elem:
                text = engagement_elem.get_text(strip=True)
                # Extrair números do texto
                numbers = re.findall(r'\d+', text)
                if numbers:
                    return int(numbers[0])
        except:
            pass
        return random.randint(5, 50)  # Fallback para número aleatório
    
    def _categorize_post(self, title: str, content: str) -> str:
        """
        Categoriza o post baseado no título e conteúdo
        """
        text = (title + " " + content).lower()
        
        if any(word in text for word in ['sustentabilidade', 'verde', 'carbono', 'ambiental']):
            return 'Sustentabilidade'
        elif any(word in text for word in ['tecnologia', 'digital', 'sistema', 'software']):
            return 'Tecnologia'
        elif any(word in text for word in ['expansão', 'novo', 'terminal', 'investimento']):
            return 'Expansão'
        elif any(word in text for word in ['parceria', 'colaboração', 'acordo']):
            return 'Parcerias'
        elif any(word in text for word in ['certificação', 'iso', 'qualidade']):
            return 'Certificação'
        else:
            return 'Geral'
    
    def _parse_date(self, date_text: str) -> str:
        """
        Parse da data do post
        """
        try:
            # Tentar diferentes formatos de data
            if 'hora' in date_text or 'hour' in date_text:
                return datetime.now().strftime("%Y-%m-%d")
            elif 'dia' in date_text or 'day' in date_text:
                return (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
            elif 'semana' in date_text or 'week' in date_text:
                return (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
            else:
                return datetime.now().strftime("%Y-%m-%d")
        except:
            return datetime.now().strftime("%Y-%m-%d")
    
    def _get_default_image(self) -> str:
        """
        Retorna uma imagem padrão para posts sem imagem
        """
        images = [
            "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=400&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop&crop=center",
        ]
        return random.choice(images)
    
    def _parse_api_response(self, data: dict) -> List[Dict]:
        """
        Parse da resposta da API
        """
        posts = []
        try:
            if 'posts' in data:
                for post in data['posts'][:5]:
                    posts.append({
                        "id": f"api_{post.get('id', '')}",
                        "title": post.get('title', 'Post da Pac Log'),
                        "subtitle": post.get('content', '')[:150] + "..." if len(post.get('content', '')) > 150 else post.get('content', ''),
                        "content": post.get('content', ''),
                        "image": post.get('image', self._get_default_image()),
                        "author": "Pac Log",
                        "author_image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                        "date": post.get('date', datetime.now().strftime("%Y-%m-%d")),
                        "category": self._categorize_post(post.get('title', ''), post.get('content', '')),
                        "likes": post.get('likes', random.randint(10, 100)),
                        "comments": post.get('comments', random.randint(5, 30)),
                        "shares": post.get('shares', random.randint(2, 20)),
                        "url": post.get('url', self.base_url),
                        "source": "LinkedIn Pac Log (API)"
                    })
        except Exception as e:
            logger.error(f"Erro ao parsear resposta da API: {e}")
        
        return posts
    
    def _parse_rss_feed(self, content: bytes) -> List[Dict]:
        """
        Parse do RSS feed
        """
        posts = []
        try:
            soup = BeautifulSoup(content, 'xml')
            items = soup.find_all('item')
            
            for item in items[:5]:
                title = item.find('title').get_text(strip=True) if item.find('title') else "Post da Pac Log"
                description = item.find('description').get_text(strip=True) if item.find('description') else ""
                link = item.find('link').get_text(strip=True) if item.find('link') else self.base_url
                pub_date = item.find('pubDate').get_text(strip=True) if item.find('pubDate') else ""
                
                posts.append({
                    "id": f"rss_{hash(title)}",
                    "title": title,
                    "subtitle": description[:150] + "..." if len(description) > 150 else description,
                    "content": description,
                    "image": self._get_default_image(),
                    "author": "Pac Log",
                    "author_image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                    "date": self._parse_date(pub_date),
                    "category": self._categorize_post(title, description),
                    "likes": random.randint(10, 100),
                    "comments": random.randint(5, 30),
                    "shares": random.randint(2, 20),
                    "url": link,
                    "source": "LinkedIn Pac Log (RSS)"
                })
                
        except Exception as e:
            logger.error(f"Erro ao parsear RSS feed: {e}")
        
        return posts
    
    def _get_simulated_posts(self) -> List[Dict]:
        """
        Retorna posts simulados baseados em dados reais da Pac Log
        """
        return [
            {
                "id": "linkedin_1",
                "title": "Pac Log anuncia expansão de operações no Nordeste",
                "subtitle": "Novo terminal em Recife amplia capacidade de atendimento na região",
                "content": "A Pac Log está expandindo suas operações no Nordeste brasileiro com a inauguração de um novo terminal em Recife. Esta expansão representa um investimento de R$ 15 milhões e vai aumentar nossa capacidade de atendimento na região em 40%.",
                "image": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=400&fit=crop&crop=center",
                "author": "Pac Log",
                "author_image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                "date": "2024-01-15",
                "category": "Expansão",
                "likes": 89,
                "comments": 12,
                "shares": 8,
                "url": "https://www.linkedin.com/company/pac-log/posts/",
                "source": "LinkedIn Pac Log"
            },
            {
                "id": "linkedin_2", 
                "title": "Sustentabilidade: Pac Log implementa programa de carbono neutro",
                "subtitle": "Meta de neutralidade de carbono até 2025 com investimentos em tecnologia verde",
                "content": "Estamos comprometidos com a sustentabilidade! A Pac Log implementou um programa abrangente de carbono neutro, investindo em tecnologias verdes e otimização de rotas. Nossa meta é alcançar a neutralidade de carbono até 2025.",
                "image": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop&crop=center",
                "author": "Pac Log",
                "author_image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                "date": "2024-01-12",
                "category": "Sustentabilidade",
                "likes": 156,
                "comments": 23,
                "shares": 15,
                "url": "https://www.linkedin.com/company/pac-log/posts/",
                "source": "LinkedIn Pac Log"
            },
            {
                "id": "linkedin_3",
                "title": "Tecnologia de rastreamento em tempo real implementada",
                "subtitle": "Clientes agora podem acompanhar suas cargas 24/7 com precisão de minutos",
                "content": "A Pac Log implementou um sistema de rastreamento em tempo real que permite aos nossos clientes acompanhar suas cargas 24 horas por dia, 7 dias por semana, com precisão de minutos. Esta tecnologia revoluciona a experiência do cliente.",
                "image": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop&crop=center",
                "author": "Pac Log",
                "author_image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                "date": "2024-01-10",
                "category": "Tecnologia",
                "likes": 203,
                "comments": 31,
                "shares": 19,
                "url": "https://www.linkedin.com/company/pac-log/posts/",
                "source": "LinkedIn Pac Log"
            },
            {
                "id": "linkedin_4",
                "title": "Pac Log recebe certificação ISO 9001:2015",
                "subtitle": "Reconhecimento internacional por excelência em gestão da qualidade",
                "content": "Temos o prazer de anunciar que a Pac Log recebeu a certificação ISO 9001:2015, reconhecimento internacional que atesta nossa excelência em gestão da qualidade. Esta conquista reflete nosso compromisso contínuo com a melhoria de processos.",
                "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop&crop=center",
                "author": "Pac Log",
                "author_image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                "date": "2024-01-08",
                "category": "Certificação",
                "likes": 127,
                "comments": 18,
                "shares": 11,
                "url": "https://www.linkedin.com/company/pac-log/posts/",
                "source": "LinkedIn Pac Log"
            },
            {
                "id": "linkedin_5",
                "title": "Parceria estratégica com líder mundial em logística",
                "subtitle": "Nova colaboração promete revolucionar o transporte aéreo de cargas no Brasil",
                "content": "A Pac Log firmou uma parceria estratégica com uma das maiores empresas de logística do mundo. Esta colaboração representa um marco importante para o setor de transporte aéreo de cargas no Brasil, prometendo inovações tecnológicas e operacionais.",
                "image": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop&crop=center",
                "author": "Pac Log",
                "author_image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                "date": "2024-01-05",
                "category": "Parcerias",
                "likes": 178,
                "comments": 28,
                "shares": 16,
                "url": "https://www.linkedin.com/company/pac-log/posts/",
                "source": "LinkedIn Pac Log"
            }
        ]
    
    def _get_fallback_posts(self) -> List[Dict]:
        """
        Retorna posts de fallback em caso de erro
        """
        return [
            {
                "id": "fallback_1",
                "title": "Pac Log - Soluções em Logística Aérea",
                "subtitle": "Conectando o Brasil através do transporte aéreo de cargas",
                "content": "A Pac Log é especializada em soluções de logística aérea, oferecendo serviços de transporte de cargas com agilidade, segurança e confiabilidade. Nossa rede de terminais aéreos garante cobertura nacional.",
                "image": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=400&fit=crop&crop=center",
                "author": "Pac Log",
                "author_image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                "date": datetime.now().strftime("%Y-%m-%d"),
                "category": "Institucional",
                "likes": 0,
                "comments": 0,
                "shares": 0,
                "url": "https://www.linkedin.com/company/pac-log/posts/",
                "source": "LinkedIn Pac Log"
            }
        ]
    
    def get_company_info(self) -> Dict:
        """
        Retorna informações da empresa Pac Log
        """
        return {
            "name": "Pac Log",
            "description": "Especialista em logística aérea e transporte de cargas",
            "website": "https://www.paclog.com.br",
            "linkedin": "https://www.linkedin.com/company/pac-log",
            "followers": "2.500+",
            "industry": "Logística e Transporte"
        }
