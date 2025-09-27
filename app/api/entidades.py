"""
API REST para entidades
"""

from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models.entidade import Entidade
from app import db

entidades_bp = Blueprint('entidades', __name__)

@entidades_bp.route('/entidades', methods=['GET', 'POST'])
@login_required
def api_entidades():
    """API para listar e criar entidades"""
    if request.method == 'POST':
        data = request.get_json()
        
        # Verificar se CPF/CNPJ já existe
        if Entidade.query.filter_by(cpf_cnpj=data['cpf_cnpj']).first():
            return jsonify({'error': 'CPF/CNPJ já cadastrado'}), 400
        
        entidade = Entidade(
            razao_social=data['razao_social'],
            cpf_cnpj=data['cpf_cnpj'],
            nome_fantasia=data['nome_fantasia'],
            inscricao_estadual=data.get('inscricao_estadual'),
            tipo_cliente=data['tipo_cliente'],
            pagamento=data['pagamento'],
            retencao=data.get('retencao', False),
            valor_retencao=data.get('valor_retencao'),
            prazo_retencao=data.get('prazo_retencao'),
            relatorio_nd=data.get('relatorio_nd', False),
            email_faturamento=data['email_faturamento'],
            email_operacional=data['email_operacional'],
            email_despachante=data['email_despachante'],
            telefone=data.get('telefone'),
            notificacoes=data.get('notificacoes', '[]'),
            tipos=data.get('tipos', '[]'),
            status=data.get('status', 'active')
        )
        
        db.session.add(entidade)
        db.session.commit()
        
        return jsonify({'message': 'Entidade criada com sucesso'}), 201
    
    elif request.method == 'GET':
        entidades = Entidade.query.all()
        return jsonify([entidade.to_dict() for entidade in entidades])

@entidades_bp.route('/entidades/<int:entidade_id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def api_entidade_detail(entidade_id):
    """API para operações específicas de entidade"""
    entidade = Entidade.query.get_or_404(entidade_id)
    
    if request.method == 'GET':
        return jsonify(entidade.to_dict())
    
    elif request.method == 'PUT':
        data = request.get_json()
        
        # Verificar se CPF/CNPJ já existe (exceto para a própria entidade)
        existing_entidade = Entidade.query.filter_by(cpf_cnpj=data['cpf_cnpj']).first()
        if existing_entidade and existing_entidade.id != entidade_id:
            return jsonify({'error': 'CPF/CNPJ já cadastrado'}), 400
        
        entidade.razao_social = data['razao_social']
        entidade.cpf_cnpj = data['cpf_cnpj']
        entidade.nome_fantasia = data['nome_fantasia']
        entidade.inscricao_estadual = data.get('inscricao_estadual')
        entidade.tipo_cliente = data['tipo_cliente']
        entidade.pagamento = data['pagamento']
        entidade.retencao = data.get('retencao', False)
        entidade.valor_retencao = data.get('valor_retencao')
        entidade.prazo_retencao = data.get('prazo_retencao')
        entidade.relatorio_nd = data.get('relatorio_nd', False)
        entidade.email_faturamento = data['email_faturamento']
        entidade.email_operacional = data['email_operacional']
        entidade.email_despachante = data['email_despachante']
        entidade.telefone = data.get('telefone')
        entidade.notificacoes = data.get('notificacoes', '[]')
        entidade.tipos = data.get('tipos', '[]')
        entidade.status = data.get('status', entidade.status)
        
        db.session.commit()
        return jsonify({'message': 'Entidade atualizada com sucesso'})
    
    elif request.method == 'DELETE':
        db.session.delete(entidade)
        db.session.commit()
        return jsonify({'message': 'Entidade excluída com sucesso'})
