// JavaScript para a tela de Agendamento de Carregamento - Web Cliente
class AgendamentoCarregamentoManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.totalItems = 0;
        this.filters = {};
        this.agendamentos = [];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadAgendamentos();
    }
    
    setupEventListeners() {
        // Busca
        document.getElementById('searchBtn')?.addEventListener('click', () => this.performSearch());
        document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
        document.getElementById('clearFilters')?.addEventListener('click', () => this.clearFilters());
        
        // Filtros avançados
        document.getElementById('statusFilter')?.addEventListener('change', (e) => this.applyFilter('status', e.target.value));
        document.getElementById('dataInicioFilter')?.addEventListener('change', (e) => this.applyFilter('dataInicio', e.target.value));
        document.getElementById('dataFimFilter')?.addEventListener('change', (e) => this.applyFilter('dataFim', e.target.value));
        document.getElementById('transportadorFilter')?.addEventListener('input', (e) => this.applyFilter('transportador', e.target.value));
        
        // Paginação
        document.getElementById('prevPage')?.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        document.getElementById('nextPage')?.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        
        // Ações removidas - botão de novo agendamento removido
    }
    
    // Dados simulados baseados na imagem
    generateMockData() {
        return [
            {
                id: 1,
                status: 'FINALIZADO',
                transportador: 'SOLUCAO COMERCIO EXTERIOR',
                importador: 'GAS FUTURO - SISTEMAS DE COMPRESSAO - LTDA',
                di: '123456789',
                dataAgendamento: '04/10/2025',
                horaAgendamento: '00:00',
                motorista: 'MARCOS PAULO WAGNER',
                observacao: ''
            },
            {
                id: 2,
                status: 'FINALIZADO',
                transportador: 'BRAMBILA',
                importador: 'NORTOX',
                di: '987654321',
                dataAgendamento: '12/06/2026',
                horaAgendamento: '11:30',
                motorista: 'ROGERIO HENRIQUE CARAMEL',
                observacao: ''
            },
            {
                id: 3,
                status: 'FINALIZADO',
                transportador: 'TOMAC DESPACHOS ADUANEIROS',
                importador: 'TOMAC DESPACHOS ADUANEIROS',
                di: '456789123',
                dataAgendamento: '15/08/2025',
                horaAgendamento: '14:00',
                motorista: 'ELI RIBEIRO DOS SANTOS',
                observacao: ''
            },
            {
                id: 4,
                status: 'FINALIZADO',
                transportador: 'SOLUCAO COMERCIO EXTERIOR',
                importador: 'GAS FUTURO - SISTEMAS DE COMPRESSAO - LTDA',
                di: '789123456',
                dataAgendamento: '20/09/2025',
                horaAgendamento: '09:15',
                motorista: 'MARCOS PAULO WAGNER',
                observacao: ''
            },
            {
                id: 5,
                status: 'FINALIZADO',
                transportador: 'BRAMBILA',
                importador: 'NORTOX',
                di: '321654987',
                dataAgendamento: '25/10/2025',
                horaAgendamento: '16:30',
                motorista: 'ROGERIO HENRIQUE CARAMEL',
                observacao: ''
            },
            {
                id: 6,
                status: 'FINALIZADO',
                transportador: 'TOMAC DESPACHOS ADUANEIROS',
                importador: 'TOMAC DESPACHOS ADUANEIROS',
                di: '654987321',
                dataAgendamento: '30/11/2025',
                horaAgendamento: '08:45',
                motorista: 'ELI RIBEIRO DOS SANTOS',
                observacao: ''
            },
            {
                id: 7,
                status: 'FINALIZADO',
                transportador: 'SOLUCAO COMERCIO EXTERIOR',
                importador: 'GAS FUTURO - SISTEMAS DE COMPRESSAO - LTDA',
                di: '147258369',
                dataAgendamento: '05/12/2025',
                horaAgendamento: '13:20',
                motorista: 'MARCOS PAULO WAGNER',
                observacao: ''
            },
            {
                id: 8,
                status: 'AGENDADO',
                transportador: 'BRAMBILA',
                importador: 'NORTOX',
                di: '369258147',
                dataAgendamento: '10/01/2026',
                horaAgendamento: '10:00',
                motorista: 'ROGERIO HENRIQUE CARAMEL',
                observacao: ''
            }
        ];
    }
    
    loadAgendamentos() {
        this.agendamentos = this.generateMockData();
        this.totalItems = this.agendamentos.length;
        this.renderTable();
        this.updatePaginationInfo();
    }
    
    renderTable() {
        const tbody = document.getElementById('agendamentosTableBody');
        if (!tbody) return;
        
        const filteredAgendamentos = this.getFilteredAgendamentos();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageAgendamentos = filteredAgendamentos.slice(startIndex, endIndex);
        
        tbody.innerHTML = pageAgendamentos.map(agendamento => this.renderAgendamentoRow(agendamento)).join('');
    }
    
    renderAgendamentoRow(agendamento) {
        // Definir ícones e cores para cada status
        let statusIcon = '';
        let statusClass = '';
        
        switch(agendamento.status) {
            case 'FINALIZADO':
                statusIcon = '<i class="fas fa-thumbs-up text-success"></i>';
                statusClass = 'text-success';
                break;
            case 'AGENDADO':
                statusIcon = '<i class="fas fa-calendar text-info"></i>';
                statusClass = 'text-info';
                break;
            case 'CANCELADO':
                statusIcon = '<i class="fas fa-times-circle text-danger"></i>';
                statusClass = 'text-danger';
                break;
            default:
                statusIcon = '<i class="fas fa-question-circle text-muted"></i>';
                statusClass = 'text-muted';
        }
        
        return `
            <tr class="processo-row">
                <td>
                    ${statusIcon}
                    <span class="ms-1 small ${statusClass}">${agendamento.status}</span>
                </td>
                <td>${agendamento.transportador}</td>
                <td>${agendamento.importador}</td>
                <td>${agendamento.di}</td>
                <td>${agendamento.dataAgendamento}</td>
                <td>${agendamento.horaAgendamento}</td>
                <td>${agendamento.motorista}</td>
                <td>${agendamento.observacao}</td>
                <td>
                    <div class="d-flex flex-column gap-1 align-items-center py-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="agendamentoManager.editAgendamento(${agendamento.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="agendamentoManager.viewAgendamento(${agendamento.id})" title="Visualizar">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }
    
    getFilteredAgendamentos() {
        let filtered = [...this.agendamentos];
        
        // Aplicar filtros
        if (this.filters.status) {
            filtered = filtered.filter(a => a.status === this.filters.status);
        }
        
        if (this.filters.transportador) {
            const transportador = this.filters.transportador.toLowerCase();
            filtered = filtered.filter(a => a.transportador.toLowerCase().includes(transportador));
        }
        
        if (this.filters.dataInicio) {
            filtered = filtered.filter(a => this.compareDates(a.dataAgendamento, this.filters.dataInicio) >= 0);
        }
        
        if (this.filters.dataFim) {
            filtered = filtered.filter(a => this.compareDates(a.dataAgendamento, this.filters.dataFim) <= 0);
        }
        
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(a => 
                a.transportador.toLowerCase().includes(searchTerm) ||
                a.importador.toLowerCase().includes(searchTerm) ||
                a.motorista.toLowerCase().includes(searchTerm) ||
                a.di.includes(searchTerm)
            );
        }
        
        return filtered;
    }
    
    compareDates(dateStr, filterDate) {
        // Converter DD/MM/YYYY para YYYY-MM-DD para comparação
        const [day, month, year] = dateStr.split('/');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        return formattedDate.localeCompare(filterDate);
    }
    
    updatePaginationInfo() {
        const filteredCount = this.getFilteredAgendamentos().length;
        const totalPages = Math.ceil(filteredCount / this.itemsPerPage);
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, filteredCount);
        
        const paginationInfo = document.getElementById('paginationInfo');
        if (paginationInfo) {
            paginationInfo.textContent = `Exibindo ${startItem} a ${endItem} de ${filteredCount} registros`;
        }
        
        // Atualizar botões de paginação
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
            prevBtn.classList.toggle('disabled', this.currentPage === 1);
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
            nextBtn.classList.toggle('disabled', this.currentPage === totalPages);
        }
    }
    
    goToPage(page) {
        const filteredCount = this.getFilteredAgendamentos().length;
        const totalPages = Math.ceil(filteredCount / this.itemsPerPage);
        
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
            this.updatePaginationInfo();
        }
    }
    
    applyFilter(filterName, value) {
        this.filters[filterName] = value;
        this.currentPage = 1;
        this.renderTable();
        this.updatePaginationInfo();
    }
    
    performSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            this.filters.search = searchInput.value;
            this.currentPage = 1;
            this.renderTable();
            this.updatePaginationInfo();
        }
    }
    
    clearFilters() {
        this.filters = {};
        this.currentPage = 1;
        
        // Limpar campos do formulário
        document.getElementById('searchInput').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('dataInicioFilter').value = '';
        document.getElementById('dataFimFilter').value = '';
        document.getElementById('transportadorFilter').value = '';
        
        this.renderTable();
        this.updatePaginationInfo();
    }
    
    // Ações dos agendamentos
    editAgendamento(id) {
        const agendamento = this.agendamentos.find(a => a.id === id);
        if (agendamento) {
            this.showNotification(`Editando agendamento ${id} - ${agendamento.transportador}`, 'info');
            // Aqui você pode implementar um modal de edição
        }
    }
    
    viewAgendamento(id) {
        const agendamento = this.agendamentos.find(a => a.id === id);
        if (agendamento) {
            this.showNotification(`Visualizando agendamento ${id} - ${agendamento.transportador}`, 'info');
            // Aqui você pode implementar um modal de visualização
        }
    }
    
    
    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 5000);
    }
}

// Funções globais para filtros
function toggleAdvancedFilters() {
    const filtersDiv = document.getElementById('advancedFilters');
    const isVisible = filtersDiv.style.display !== 'none';
    
    if (isVisible) {
        filtersDiv.style.display = 'none';
    } else {
        filtersDiv.style.display = 'block';
    }
}

function applyAdvancedFilters() {
    if (window.agendamentoManager) {
        // Os filtros já são aplicados automaticamente via event listeners
        window.agendamentoManager.renderTable();
        window.agendamentoManager.updatePaginationInfo();
    }
}

function clearAdvancedFilters() {
    if (window.agendamentoManager) {
        window.agendamentoManager.clearFilters();
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.agendamentoManager = new AgendamentoCarregamentoManager();
});
