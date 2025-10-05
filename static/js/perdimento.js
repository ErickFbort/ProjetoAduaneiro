// Módulo de Perdimento - Web Clientes
// Funcionalidades para gerenciamento de registros de perdimento

class PerdimentoManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.totalItems = 0;
        this.searchTerm = '';
        this.perdimentoData = [];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPerdimentoData();
        this.renderTable();
    }

    bindEvents() {
        // Botão de cadastro
        document.getElementById('cadastrarPerdimento').addEventListener('click', () => {
            this.openCadastroModal();
        });

        // Botão de salvar perdimento
        document.getElementById('salvarPerdimento').addEventListener('click', () => {
            this.salvarPerdimento();
        });

        // Botão de descartar alterações
        document.getElementById('descartarAlteracoesCadastro').addEventListener('click', () => {
            this.fecharCadastroModal();
        });

        // Pesquisa
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.currentPage = 1;
            this.renderTable();
        });

        // Itens por página
        document.getElementById('itemsPorPagina').addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.renderTable();
        });

        // Limpar filtros
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });

        document.getElementById('clearFiltersEmpty').addEventListener('click', () => {
            this.clearFilters();
        });
    }

    loadPerdimentoData() {
        // Dados simulados baseados na imagem fornecida
        this.perdimentoData = [
            {
                id: 160,
                codigo: '160',
                dmcaProcesso: '',
                awbDsic: '99922001862',
                hawb: '',
                motivo: 'Abandono',
                pesoTotal: 150.000,
                volumeTotal: null,
                percentualEntrega: 0,
                observacoes: 'Carga abandonada pelo cliente'
            },
            {
                id: 159,
                codigo: '159',
                dmcaProcesso: '',
                awbDsic: '02021714324',
                hawb: '',
                motivo: 'Apreensão de Cargas pela RFB',
                pesoTotal: 6.220,
                volumeTotal: null,
                percentualEntrega: 100,
                observacoes: 'Carga apreendida pela Receita Federal'
            },
            {
                id: 158,
                codigo: '158',
                dmcaProcesso: 'DMCA123456',
                awbDsic: '12345678901',
                hawb: 'HAWB001',
                motivo: 'Avaria',
                pesoTotal: 25.500,
                volumeTotal: 2.5,
                percentualEntrega: 50,
                observacoes: 'Carga danificada durante o transporte'
            },
            {
                id: 157,
                codigo: '157',
                dmcaProcesso: 'DMCA789012',
                awbDsic: '98765432109',
                hawb: 'HAWB002',
                motivo: 'Extravio',
                pesoTotal: 10.750,
                volumeTotal: 1.2,
                percentualEntrega: 0,
                observacoes: 'Carga extraviada durante o processo'
            }
        ];
        
        this.totalItems = this.perdimentoData.length;
    }

    renderTable() {
        const tbody = document.getElementById('perdimentoTableBody');
        const emptyState = document.getElementById('emptyState');
        
        // Filtrar dados
        let filteredData = this.perdimentoData;
        if (this.searchTerm) {
            filteredData = this.perdimentoData.filter(item => 
                item.codigo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                item.dmcaProcesso.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                item.awbDsic.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                item.hawb.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                item.motivo.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        // Paginação
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        if (paginatedData.length === 0) {
            tbody.innerHTML = '';
            emptyState.classList.remove('d-none');
            this.renderPagination(0);
            return;
        }

        emptyState.classList.add('d-none');
        
        tbody.innerHTML = paginatedData.map(item => `
            <tr>
                <td>${item.codigo}</td>
                <td>${item.dmcaProcesso || '-'}</td>
                <td>${item.awbDsic}</td>
                <td>${item.hawb || '-'}</td>
                <td>${item.motivo}</td>
                <td>${item.pesoTotal ? item.pesoTotal.toFixed(3) : '-'}</td>
                <td>${item.volumeTotal ? item.volumeTotal.toFixed(3) : '-'}</td>
                <td>${item.percentualEntrega}%</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="perdimentoManager.visualizarPerdimento(${item.id})" title="Visualizar">
                        <i class="fas fa-folder"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        this.renderPagination(filteredData.length);
    }

    renderPagination(totalFilteredItems) {
        const pagination = document.getElementById('pagination');
        const totalPages = Math.ceil(totalFilteredItems / this.itemsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Botão anterior
        paginationHTML += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <button class="page-link" onclick="perdimentoManager.goToPage(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''}>
                    ← Página Anterior
                </button>
            </li>
        `;

        // Botão próxima
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <button class="page-link" onclick="perdimentoManager.goToPage(${this.currentPage + 1})" ${this.currentPage === totalPages ? 'disabled' : ''}>
                    Próxima Página →
                </button>
            </li>
        `;

        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
        }
    }

    openCadastroModal() {
        const modal = new bootstrap.Modal(document.getElementById('cadastroPerdimentoModal'));
        this.limparFormularioCadastro();
        modal.show();
    }

    fecharCadastroModal() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('cadastroPerdimentoModal'));
        if (modal) {
            modal.hide();
        }
    }

    limparFormularioCadastro() {
        document.getElementById('cadastroPerdimentoForm').reset();
    }

    salvarPerdimento() {
        const form = document.getElementById('cadastroPerdimentoForm');
        const formData = new FormData(form);
        
        // Validação básica
        const awbDsic = document.getElementById('awbDsic').value;
        const motivo = document.getElementById('motivo').value;
        
        if (!awbDsic || !motivo) {
            this.showNotification('Por favor, preencha os campos obrigatórios', 'error');
            return;
        }

        // Criar novo registro
        const novoPerdimento = {
            id: Date.now(), // ID temporário
            codigo: (this.perdimentoData.length + 1).toString(),
            dmcaProcesso: document.getElementById('dmcaProcesso').value,
            awbDsic: awbDsic,
            hawb: document.getElementById('hawb').value,
            motivo: motivo,
            pesoTotal: parseFloat(document.getElementById('pesoTotal').value) || null,
            volumeTotal: parseFloat(document.getElementById('volumeTotal').value) || null,
            percentualEntrega: parseInt(document.getElementById('percentualEntrega').value) || 0,
            observacoes: document.getElementById('observacoes').value
        };

        // Adicionar aos dados
        this.perdimentoData.unshift(novoPerdimento);
        this.totalItems = this.perdimentoData.length;
        
        // Fechar modal e atualizar tabela
        this.fecharCadastroModal();
        this.renderTable();
        
        this.showNotification('Perdimento cadastrado com sucesso!', 'success');
    }

    visualizarPerdimento(id) {
        const perdimento = this.perdimentoData.find(item => item.id === id);
        if (!perdimento) return;

        // Salvar ID do perdimento para a página de detalhes
        localStorage.setItem('perdimentoId', perdimento.id);
        
        // Navegar para a página de detalhes
        window.location.href = '/web-clientes/perdimento/detalhes?id=' + perdimento.id;
    }

    clearFilters() {
        document.getElementById('searchInput').value = '';
        this.searchTerm = '';
        this.currentPage = 1;
        this.renderTable();
    }

    refreshTable() {
        this.loadPerdimentoData();
        this.renderTable();
        this.showNotification('Tabela atualizada!', 'success');
    }

    showNotification(message, type = 'info') {
        // Implementar sistema de notificações se necessário
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// Funções globais para compatibilidade
function refreshTable() {
    if (window.perdimentoManager) {
        window.perdimentoManager.refreshTable();
    }
}

function fecharCadastroPerdimento() {
    if (window.perdimentoManager) {
        window.perdimentoManager.fecharCadastroModal();
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.perdimentoManager = new PerdimentoManager();
});
