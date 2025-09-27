"""
Modelo de Veículo
"""

from datetime import datetime
from app import db

class Veiculo(db.Model):
    """Modelo de veículo do sistema"""
    __tablename__ = 'veiculos'
    
    id = db.Column(db.Integer, primary_key=True)
    motorista_responsavel = db.Column(db.String(100), nullable=False)
    cpf_motorista = db.Column(db.String(14), nullable=False)
    placa = db.Column(db.String(8), unique=True, nullable=False)
    renavam = db.Column(db.String(11))
    tipo = db.Column(db.String(50), nullable=False)  # Reboque, Carreta, Cavalo, Truck, Outros
    tipo_outros = db.Column(db.String(100))  # Campo para "Outros"
    estado = db.Column(db.String(2))
    municipio = db.Column(db.String(100))
    observacoes = db.Column(db.Text)
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Converte o veículo para dicionário"""
        return {
            'id': self.id,
            'motorista_responsavel': self.motorista_responsavel,
            'cpf_motorista': self.cpf_motorista,
            'placa': self.placa,
            'renavam': self.renavam,
            'tipo': self.tipo,
            'tipo_outros': self.tipo_outros,
            'estado': self.estado,
            'municipio': self.municipio,
            'observacoes': self.observacoes,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f'<Veiculo {self.placa}>'
