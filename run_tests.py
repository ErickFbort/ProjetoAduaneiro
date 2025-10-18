#!/usr/bin/env python3
"""
Script para executar todos os testes do projeto
"""
import subprocess
import sys
import os
from pathlib import Path


def run_command(command, description):
    """Executar comando e mostrar resultado"""
    print(f"\n{'='*60}")
    print(f"🧪 {description}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao executar: {e}")
        print("STDOUT:", e.stdout)
        print("STDERR:", e.stderr)
        return False


def install_dependencies():
    """Instalar dependências de teste"""
    print("📦 Instalando dependências de teste...")
    
    # Instalar dependências Python
    if not run_command("pip install -r requirements-test.txt", "Instalando dependências Python"):
        return False
    
    # Instalar dependências Node.js (se package.json existir)
    if Path("package.json").exists():
        if not run_command("npm install", "Instalando dependências Node.js"):
            return False
    
    # Instalar Playwright
    if not run_command("playwright install", "Instalando Playwright"):
        return False
    
    return True


def run_python_tests():
    """Executar testes Python"""
    return run_command(
        "python -m pytest tests/ -v --tb=short --cov=app --cov-report=html --cov-report=term-missing",
        "Executando testes Python (Unitários + Integração)"
    )


def run_e2e_tests():
    """Executar testes E2E com Playwright"""
    return run_command(
        "playwright test --reporter=html",
        "Executando testes E2E com Playwright"
    )


def run_react_tests():
    """Executar testes React/TypeScript"""
    if not Path("package.json").exists():
        print("⚠️  package.json não encontrado, pulando testes React")
        return True
    
    return run_command(
        "npm test -- --coverage --watchAll=false",
        "Executando testes React/TypeScript"
    )


def generate_report():
    """Gerar relatório consolidado"""
    print(f"\n{'='*60}")
    print("📊 RELATÓRIO DE TESTES")
    print(f"{'='*60}")
    
    # Verificar se existem relatórios
    reports = [
        ("Cobertura Python", "htmlcov/index.html"),
        ("Testes E2E", "test-results/index.html"),
        ("Cobertura React", "coverage/lcov-report/index.html")
    ]
    
    for name, path in reports:
        if Path(path).exists():
            print(f"✅ {name}: {path}")
        else:
            print(f"❌ {name}: Não encontrado")


def main():
    """Função principal"""
    print("🚀 Iniciando execução de testes do Projeto Aduaneiro")
    
    # Verificar se estamos no diretório correto
    if not Path("app").exists():
        print("❌ Erro: Execute este script no diretório raiz do projeto")
        sys.exit(1)
    
    # Instalar dependências
    if not install_dependencies():
        print("❌ Falha ao instalar dependências")
        sys.exit(1)
    
    # Executar testes
    success = True
    
    # Testes Python
    if not run_python_tests():
        success = False
    
    # Testes React (se existirem)
    if not run_react_tests():
        success = False
    
    # Testes E2E
    if not run_e2e_tests():
        success = False
    
    # Gerar relatório
    generate_report()
    
    if success:
        print(f"\n{'='*60}")
        print("🎉 TODOS OS TESTES EXECUTADOS COM SUCESSO!")
        print(f"{'='*60}")
    else:
        print(f"\n{'='*60}")
        print("❌ ALGUNS TESTES FALHARAM!")
        print(f"{'='*60}")
        sys.exit(1)


if __name__ == "__main__":
    main()
