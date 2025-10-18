"""
Namespace de autenticação da API
"""
from flask_restx import Namespace, Resource, fields
from flask import request, jsonify
from flask_login import login_user, logout_user, current_user
from werkzeug.security import check_password_hash
from app.models.user import User
from app import db
from app.api.models import (
    login_model, login_response_model, success_response, error_response,
    user_model
)

auth_ns = Namespace('auth', description='Operações de autenticação')

@auth_ns.route('/login')
class Login(Resource):
    @auth_ns.expect(login_model, validate=True)
    @auth_ns.marshal_with(login_response_model)
    @auth_ns.doc('user_login', 
                 description='Realizar login no sistema',
                 responses={
                     200: 'Login realizado com sucesso',
                     400: 'Dados inválidos',
                     401: 'Credenciais inválidas',
                     500: 'Erro interno do servidor'
                 })
    def post(self):
        """
        Realizar login no sistema
        
        Este endpoint permite que usuários façam login no sistema fornecendo
        suas credenciais (email e senha).
        
        **Exemplo de uso:**
        ```bash
        curl -X POST "http://localhost:5000/api/auth/login" \
             -H "Content-Type: application/json" \
             -d '{
               "email": "admin@teste.com",
               "password": "admin123"
             }'
        ```
        
        **Resposta de sucesso:**
        ```json
        {
          "success": true,
          "message": "Login realizado com sucesso",
          "user": {
            "id": 1,
            "name": "Administrador",
            "email": "admin@teste.com",
            "group": "admin",
            "status": "active"
          }
        }
        ```
        """
        try:
            data = request.get_json()
            
            if not data or not data.get('email') or not data.get('password'):
                return {
                    'success': False,
                    'message': 'Email e senha são obrigatórios'
                }, 400
            
            email = data['email'].strip().lower()
            password = data['password']
            
            # Buscar usuário
            user = User.query.filter_by(email=email).first()
            
            if not user or not user.check_password(password):
                return {
                    'success': False,
                    'message': 'Email ou senha inválidos'
                }, 401
            
            if user.status != 'active':
                return {
                    'success': False,
                    'message': 'Usuário bloqueado. Entre em contato com o administrador.'
                }, 401
            
            # Realizar login
            login_user(user, remember=True)
            
            return {
                'success': True,
                'message': 'Login realizado com sucesso',
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'group': user.group,
                    'status': user.status,
                    'created_at': user.created_at.isoformat() if user.created_at else None,
                    'last_login': user.last_login.isoformat() if user.last_login else None
                }
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': 'Erro interno do servidor',
                'error': str(e)
            }, 500

@auth_ns.route('/logout')
class Logout(Resource):
    @auth_ns.marshal_with(success_response)
    @auth_ns.doc('user_logout',
                 description='Realizar logout do sistema',
                 responses={
                     200: 'Logout realizado com sucesso',
                     401: 'Usuário não autenticado'
                 })
    def post(self):
        """
        Realizar logout do sistema
        
        Este endpoint permite que usuários façam logout do sistema.
        
        **Exemplo de uso:**
        ```bash
        curl -X POST "http://localhost:5000/api/auth/logout"
        ```
        
        **Resposta de sucesso:**
        ```json
        {
          "success": true,
          "message": "Logout realizado com sucesso"
        }
        ```
        """
        try:
            if not current_user.is_authenticated:
                return {
                    'success': False,
                    'message': 'Usuário não autenticado'
                }, 401
            
            logout_user()
            
            return {
                'success': True,
                'message': 'Logout realizado com sucesso'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': 'Erro interno do servidor',
                'error': str(e)
            }, 500

@auth_ns.route('/me')
class CurrentUser(Resource):
    @auth_ns.marshal_with(user_model)
    @auth_ns.doc('get_current_user',
                 description='Obter dados do usuário atual',
                 responses={
                     200: 'Dados do usuário obtidos com sucesso',
                     401: 'Usuário não autenticado'
                 })
    def get(self):
        """
        Obter dados do usuário atual
        
        Este endpoint retorna os dados do usuário atualmente autenticado.
        
        **Exemplo de uso:**
        ```bash
        curl -X GET "http://localhost:5000/api/auth/me"
        ```
        
        **Resposta de sucesso:**
        ```json
        {
          "id": 1,
          "name": "Administrador",
          "email": "admin@teste.com",
          "group": "admin",
          "status": "active",
          "created_at": "2024-01-01T00:00:00Z",
          "last_login": "2024-01-15T10:30:00Z"
        }
        ```
        """
        try:
            if not current_user.is_authenticated:
                return {
                    'success': False,
                    'message': 'Usuário não autenticado'
                }, 401
            
            return {
                'id': current_user.id,
                'name': current_user.name,
                'email': current_user.email,
                'group': current_user.group,
                'status': current_user.status,
                'created_at': current_user.created_at.isoformat() if current_user.created_at else None,
                'last_login': current_user.last_login.isoformat() if current_user.last_login else None
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': 'Erro interno do servidor',
                'error': str(e)
            }, 500

@auth_ns.route('/check')
class CheckAuth(Resource):
    @auth_ns.marshal_with(success_response)
    @auth_ns.doc('check_auth',
                 description='Verificar se o usuário está autenticado',
                 responses={
                     200: 'Status de autenticação verificado',
                     401: 'Usuário não autenticado'
                 })
    def get(self):
        """
        Verificar status de autenticação
        
        Este endpoint verifica se o usuário está autenticado e retorna
        informações básicas sobre o status da sessão.
        
        **Exemplo de uso:**
        ```bash
        curl -X GET "http://localhost:5000/api/auth/check"
        ```
        
        **Resposta de sucesso (autenticado):**
        ```json
        {
          "success": true,
          "message": "Usuário autenticado",
          "data": {
            "authenticated": true,
            "user_id": 1,
            "user_name": "Administrador"
          }
        }
        ```
        
        **Resposta de erro (não autenticado):**
        ```json
        {
          "success": false,
          "message": "Usuário não autenticado"
        }
        ```
        """
        try:
            if not current_user.is_authenticated:
                return {
                    'success': False,
                    'message': 'Usuário não autenticado'
                }, 401
            
            return {
                'success': True,
                'message': 'Usuário autenticado',
                'data': {
                    'authenticated': True,
                    'user_id': current_user.id,
                    'user_name': current_user.name,
                    'user_group': current_user.group
                }
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': 'Erro interno do servidor',
                'error': str(e)
            }, 500
