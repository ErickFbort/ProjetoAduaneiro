"""
Rotas de autenticação
"""

from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from flask_login import login_user, logout_user, login_required, current_user
from app.models.user import User
from app import db
from app.security.security_logger import log_failed_login, log_successful_login, log_suspicious_activity
from app.security.input_validation import validate_email, sanitize_input

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """Página de login"""
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))
    
    if request.method == 'POST':
        # Sanitizar entrada
        email = sanitize_input({'email': request.form.get('email', '')})['email']
        password = request.form.get('password', '')
        
        # Validar email
        if not validate_email(email):
            log_failed_login(email, 'invalid_email_format')
            flash('Formato de email inválido!', 'error')
            return render_template('auth/login.html')
        
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            login_user(user)
            log_successful_login(user.id, email)
            flash('Login realizado com sucesso!', 'success')
            return redirect(url_for('main.dashboard'))
        else:
            log_failed_login(email, 'invalid_credentials')
            flash('Usuário ou senha inválidos!', 'error')
    
    return render_template('auth/login.html')

@auth_bp.route('/logout')
@login_required
def logout():
    """Logout do usuário"""
    logout_user()
    
    # Limpar todas as mensagens flash existentes
    session.pop('_flashes', None)
    
    # Adicionar apenas a mensagem de logout
    flash('Você foi desconectado com sucesso!', 'info')
    return redirect(url_for('auth.login'))
