"""
Rotas para documentação da API
"""
from flask import Blueprint, render_template

api_docs_bp = Blueprint('api_docs', __name__)

@api_docs_bp.route('/api-documentation')
def api_documentation():
    """Página de documentação da API"""
    return render_template('api/docs.html')
