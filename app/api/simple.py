"""
API simples para teste
"""
from flask_restx import Namespace, Resource, fields

simple_ns = Namespace('simple', description='API simples para teste')

@simple_ns.route('/test')
class SimpleTest(Resource):
    def get(self):
        """Teste simples"""
        return {'message': 'API funcionando!'}
