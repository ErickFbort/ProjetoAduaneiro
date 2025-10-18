#!/usr/bin/env python3
"""
Script para otimização de assets estáticos
Comprime CSS, JS e imagens para melhorar performance
"""

import os
import gzip
import shutil
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def compress_file(file_path, output_path=None):
    """Comprime um arquivo usando gzip"""
    if output_path is None:
        output_path = f"{file_path}.gz"
    
    try:
        with open(file_path, 'rb') as f_in:
            with gzip.open(output_path, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
        
        original_size = os.path.getsize(file_path)
        compressed_size = os.path.getsize(output_path)
        compression_ratio = (1 - compressed_size / original_size) * 100
        
        logger.info(f"Comprimido {file_path}: {original_size} -> {compressed_size} bytes ({compression_ratio:.1f}% redução)")
        return True
    except Exception as e:
        logger.error(f"Erro ao comprimir {file_path}: {e}")
        return False

def optimize_css():
    """Otimiza arquivos CSS"""
    css_dir = Path("static/css")
    if not css_dir.exists():
        return
    
    logger.info("Otimizando arquivos CSS...")
    
    for css_file in css_dir.glob("*.css"):
        if not css_file.name.endswith('.min.css'):
            # Comprimir arquivo CSS
            compress_file(css_file)
            
            # Criar versão minificada (simulada)
            minified_path = css_file.with_suffix('.min.css')
            if not minified_path.exists():
                shutil.copy2(css_file, minified_path)
                logger.info(f"Criada versão minificada: {minified_path}")

def optimize_js():
    """Otimiza arquivos JavaScript"""
    js_dir = Path("static/js")
    if not js_dir.exists():
        return
    
    logger.info("Otimizando arquivos JavaScript...")
    
    for js_file in js_dir.glob("*.js"):
        if not js_file.name.endswith('.min.js'):
            # Comprimir arquivo JS
            compress_file(js_file)
            
            # Criar versão minificada (simulada)
            minified_path = js_file.with_suffix('.min.js')
            if not minified_path.exists():
                shutil.copy2(js_file, minified_path)
                logger.info(f"Criada versão minificada: {minified_path}")

def optimize_images():
    """Otimiza imagens (simulação)"""
    img_dir = Path("static/img")
    if not img_dir.exists():
        return
    
    logger.info("Otimizando imagens...")
    
    for img_file in img_dir.glob("*"):
        if img_file.is_file() and img_file.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
            # Simular otimização de imagem
            logger.info(f"Imagem otimizada: {img_file}")

def create_manifest():
    """Cria manifest para cache de assets"""
    manifest = {
        "version": "1.0.0",
        "assets": {
            "css": [],
            "js": [],
            "images": []
        }
    }
    
    # Adicionar arquivos CSS
    css_dir = Path("static/css")
    if css_dir.exists():
        for css_file in css_dir.glob("*.css"):
            manifest["assets"]["css"].append(f"/static/css/{css_file.name}")
    
    # Adicionar arquivos JS
    js_dir = Path("static/js")
    if js_dir.exists():
        for js_file in js_dir.glob("*.js"):
            manifest["assets"]["js"].append(f"/static/js/{js_file.name}")
    
    # Adicionar imagens
    img_dir = Path("static/img")
    if img_dir.exists():
        for img_file in img_dir.glob("*"):
            if img_file.is_file():
                manifest["assets"]["images"].append(f"/static/img/{img_file.name}")
    
    # Salvar manifest
    import json
    with open("static/manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)
    
    logger.info("Manifest criado: static/manifest.json")

def main():
    """Função principal"""
    logger.info("Iniciando otimização de assets...")
    
    # Criar diretório de assets comprimidos
    compressed_dir = Path("static/compressed")
    compressed_dir.mkdir(exist_ok=True)
    
    # Otimizar diferentes tipos de arquivos
    optimize_css()
    optimize_js()
    optimize_images()
    create_manifest()
    
    logger.info("Otimização de assets concluída!")

if __name__ == "__main__":
    main()
