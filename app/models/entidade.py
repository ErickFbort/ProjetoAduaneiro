"""
Modelo de Entidade
"""

from datetime import datetime
from app import db

class Entidade(db.Model):
    """Modelo de entidade do sistema"""
    __tablename__ = 'entidades'
    
    id = db.Column(db.Integer, primary_key=True)
    razao_social = db.Column(db.String(200), nullable=False)
    cpf_cnpj = db.Column(db.String(18), unique=True, nullable=False)
    nome_fantasia = db.Column(db.String(200), nullable=False)
    inscricao_estadual = db.Column(db.String(20))
    tipo_cliente = db.Column(db.String(20), nullable=False)  # Pessoa Fisica, Juridica, Estrangeira
    pagamento = db.Column(db.String(10), nullable=False)  # 001, 002, 003
    retencao = db.Column(db.Boolean, default=False)
    valor_retencao = db.Column(db.Float)
    prazo_retencao = db.Column(db.Integer)  # 7, 5, 10, 15, 21, 30 dias
    relatorio_nd = db.Column(db.Boolean, default=False)
    email_faturamento = db.Column(db.String(120), nullable=False)
    email_operacional = db.Column(db.String(120), nullable=False)
    email_despachante = db.Column(db.String(120), nullable=False)
    telefone = db.Column(db.String(20))
    
    # Notificações por email (JSON)
    notificacoes = db.Column(db.Text)  # JSON com as opções selecionadas
    
    # Tipos (JSON)
    tipos = db.Column(db.Text)  # JSON com os tipos selecionados
    
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Converte a entidade para dicionário"""
        return {
            'id': self.id,
            'razao_social': self.razao_social,
            'cpf_cnpj': self.cpf_cnpj,
            'nome_fantasia': self.nome_fantasia,
            'inscricao_estadual': self.inscricao_estadual,
            'tipo_cliente': self.tipo_cliente,
            'pagamento': self.pagamento,
            'retencao': self.retencao,
            'valor_retencao': self.valor_retencao,
            'prazo_retencao': self.prazo_retencao,
            'relatorio_nd': self.relatorio_nd,
            'email_faturamento': self.email_faturamento,
            'email_operacional': self.email_operacional,
            'email_despachante': self.email_despachante,
            'telefone': self.telefone,
            'notificacoes': self.notificacoes,
            'tipos': self.tipos,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f'<Entidade {self.razao_social}>'
