"""
API REST para veículos
"""

from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models.veiculo import Veiculo
from app import db

veiculos_bp = Blueprint('veiculos', __name__)

@veiculos_bp.route('/veiculos', methods=['GET', 'POST'])
@login_required
def api_veiculos():
    """API para listar e criar veículos"""
    if request.method == 'POST':
        data = request.get_json()
        
        # Verificar se placa já existe
        if Veiculo.query.filter_by(placa=data['placa']).first():
            return jsonify({'error': 'Placa já cadastrada'}), 400
        
        veiculo = Veiculo(
            motorista_responsavel=data['motorista_responsavel'],
            cpf_motorista=data['cpf_motorista'],
            placa=data['placa'],
            renavam=data.get('renavam'),
            tipo=data['tipo'],
            tipo_outros=data.get('tipo_outros'),
            estado=data.get('estado'),
            municipio=data.get('municipio'),
            observacoes=data.get('observacoes'),
            status=data.get('status', 'active')
        )
        
        db.session.add(veiculo)
        db.session.commit()
        
        return jsonify({'message': 'Veículo criado com sucesso'}), 201
    
    elif request.method == 'GET':
        veiculos = Veiculo.query.all()
        return jsonify([veiculo.to_dict() for veiculo in veiculos])

@veiculos_bp.route('/veiculos/<int:veiculo_id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def api_veiculo_detail(veiculo_id):
    """API para operações específicas de veículo"""
    veiculo = Veiculo.query.get_or_404(veiculo_id)
    
    if request.method == 'GET':
        return jsonify(veiculo.to_dict())
    
    elif request.method == 'PUT':
        data = request.get_json()
        
        # Verificar se placa já existe (exceto para o próprio veículo)
        existing_veiculo = Veiculo.query.filter_by(placa=data['placa']).first()
        if existing_veiculo and existing_veiculo.id != veiculo_id:
            return jsonify({'error': 'Placa já cadastrada'}), 400
        
        veiculo.motorista_responsavel = data['motorista_responsavel']
        veiculo.cpf_motorista = data['cpf_motorista']
        veiculo.placa = data['placa']
        veiculo.renavam = data.get('renavam')
        veiculo.tipo = data['tipo']
        veiculo.tipo_outros = data.get('tipo_outros')
        veiculo.estado = data.get('estado')
        veiculo.municipio = data.get('municipio')
        veiculo.observacoes = data.get('observacoes')
        veiculo.status = data.get('status', veiculo.status)
        
        db.session.commit()
        return jsonify({'message': 'Veículo atualizado com sucesso'})
    
    elif request.method == 'DELETE':
        db.session.delete(veiculo)
        db.session.commit()
        return jsonify({'message': 'Veículo excluído com sucesso'})
