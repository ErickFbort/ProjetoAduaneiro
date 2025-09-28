"""
Modelo de Usuário
"""

from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from app import db

class User(UserMixin, db.Model):
    """Modelo de usuário do sistema"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    status = db.Column(db.String(20), default='active')
    group = db.Column(db.String(50), nullable=False)  # Paclog Faturamento, Paclog ADM, Paclog Operacional
    job_title = db.Column(db.String(100), nullable=True)  # Cargo/função do usuário
    permissions = db.Column(db.Text)  # JSON string das permissões
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        """Define a senha do usuário"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verifica se a senha está correta"""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Converte o usuário para dicionário"""
        return {
            'id': self.id,
            'name': self.name,
            'lastname': self.lastname,
            'cpf': self.cpf,
            'email': self.email,
            'status': self.status,
            'group': self.group,
            'job_title': self.job_title,
            'permissions': self.permissions,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f'<User {self.email}>'
