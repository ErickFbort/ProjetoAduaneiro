"""
API REST para usuários
"""

from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models.user import User
from app import db

users_bp = Blueprint('users', __name__)

@users_bp.route('/users', methods=['GET', 'POST'])
@login_required
def api_users():
    """API para listar e criar usuários"""
    if request.method == 'POST':
        data = request.get_json()
        
        # Verificar se email já existe
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email já cadastrado'}), 400
        
        # Verificar se CPF já existe
        if User.query.filter_by(cpf=data['cpf']).first():
            return jsonify({'error': 'CPF já cadastrado'}), 400
        
        user = User(
            name=data['name'],
            lastname=data['lastname'],
            cpf=data['cpf'],
            email=data['email'],
            status=data.get('status', 'active'),
            group=data['group'],
            permissions=data.get('permissions', '[]')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'Usuário criado com sucesso'}), 201
    
    elif request.method == 'GET':
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])

@users_bp.route('/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def api_user_detail(user_id):
    """API para operações específicas de usuário"""
    user = User.query.get_or_404(user_id)
    
    if request.method == 'GET':
        return jsonify(user.to_dict())
    
    elif request.method == 'PUT':
        data = request.get_json()
        
        # Verificar se email já existe (exceto para o próprio usuário)
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user and existing_user.id != user_id:
            return jsonify({'error': 'Email já cadastrado'}), 400
        
        # Verificar se CPF já existe (exceto para o próprio usuário)
        existing_user = User.query.filter_by(cpf=data['cpf']).first()
        if existing_user and existing_user.id != user_id:
            return jsonify({'error': 'CPF já cadastrado'}), 400
        
        user.name = data['name']
        user.lastname = data['lastname']
        user.cpf = data['cpf']
        user.email = data['email']
        user.status = data.get('status', user.status)
        user.group = data['group']
        user.permissions = data.get('permissions', '[]')
        
        if 'password' in data and data['password']:
            user.set_password(data['password'])
        
        db.session.commit()
        return jsonify({'message': 'Usuário atualizado com sucesso'})
    
    elif request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'Usuário removido com sucesso'})
