#!/usr/bin/env python3
"""
Script para atualizar automaticamente as referências dos arquivos estáticos
após o build do Vite. Este script encontra os arquivos JS e CSS gerados
e atualiza as referências nos templates HTML.
"""

import os
import re
import glob
from pathlib import Path

def find_latest_assets():
    """Encontra os arquivos JS e CSS mais recentes no diretório dist/assets"""
    assets_dir = Path("static/dist/assets")
    
    if not assets_dir.exists():
        print("ERRO: Diretorio static/dist/assets nao encontrado!")
        return None, None
    
    # Encontrar arquivos JS e CSS
    js_files = list(assets_dir.glob("main-*.js"))
    css_files = list(assets_dir.glob("main-*.css"))
    
    # Se não encontrar main-*.css, procurar por qualquer arquivo CSS
    if not css_files:
        css_files = list(assets_dir.glob("*.css"))
    
    if not js_files:
        print("ERRO: Nenhum arquivo JS encontrado!")
        return None, None
    
    if not css_files:
        print("ERRO: Nenhum arquivo CSS encontrado!")
        return None, None
    
    # Pegar o arquivo mais recente (por timestamp de modificação)
    latest_js = max(js_files, key=os.path.getmtime)
    latest_css = max(css_files, key=os.path.getmtime)
    
    return latest_js.name, latest_css.name

def update_template_references(js_filename, css_filename):
    """Atualiza as referências nos templates HTML"""
    templates_dir = Path("templates")
    
    # Padrão para encontrar referências de arquivos main-*.js e main-*.css
    js_pattern = r'main-[A-Za-z0-9]+\.js'
    css_pattern = r'main-[A-Za-z0-9]+\.css'
    
    updated_files = []
    
    # Procurar em todos os arquivos HTML
    for html_file in templates_dir.rglob("*.html"):
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Atualizar referências JS
            content = re.sub(js_pattern, js_filename, content)
            
            # Atualizar referências CSS
            content = re.sub(css_pattern, css_filename, content)
            
            # Se houve mudanças, salvar o arquivo
            if content != original_content:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                updated_files.append(str(html_file))
                print(f"Atualizado: {html_file}")
        
        except Exception as e:
            print(f"ERRO ao processar {html_file}: {e}")
    
    return updated_files

def main():
    """Função principal"""
    print("Procurando arquivos estaticos mais recentes...")
    
    js_filename, css_filename = find_latest_assets()
    
    if not js_filename or not css_filename:
        print("ERRO: Nao foi possivel encontrar os arquivos necessarios!")
        return 1
    
    print(f"Arquivo JS encontrado: {js_filename}")
    print(f"Arquivo CSS encontrado: {css_filename}")
    
    print("\nAtualizando referencias nos templates...")
    updated_files = update_template_references(js_filename, css_filename)
    
    if updated_files:
        print(f"\n{len(updated_files)} arquivo(s) atualizado(s):")
        for file in updated_files:
            print(f"   - {file}")
    else:
        print("\nAVISO: Nenhum arquivo foi atualizado.")
    
    print("\nProcesso concluido!")
    return 0

if __name__ == "__main__":
    exit(main())
