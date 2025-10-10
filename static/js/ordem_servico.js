// JavaScript para a tela de Ordem de Serviço - Web Cliente
// Verificar se a classe já existe para evitar redeclaração
if (typeof OrdemServicoManager === 'undefined') {
    class OrdemServicoManager {
        constructor() {
            this.currentPage = 1;
            this.itemsPerPage = 10;
            this.totalItems = 0;
            this.filters = {};
            this.ordens = [];
            this.currentOrdem = null;
            this.searchBy = 'ficha';
            
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadOrdens();
    }
    
    setupEventListeners() {
        // Filtros
        document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
        
        // Botões de ação
        document.getElementById('cadastrarServico')?.addEventListener('click', () => this.cadastrarServico());
        document.getElementById('clearFilters')?.addEventListener('click', () => this.clearFilters());
        document.getElementById('clearFiltersEmpty')?.addEventListener('click', () => this.clearFilters());
        document.getElementById('itemsPorPagina')?.addEventListener('change', (e) => this.changeItemsPerPage(e.target.value));
    }
    
    // Dados simulados baseados na imagem
    generateMockData() {
        return [
            {
                id: 1,
                status: 'SOLICITACAO',
                ficha: '630088',
                servico: 'Acesso de Veículos',
                data: '07/07/2025',
                hora: '15:57',
                processo: '366768-',
                entidade: 'CLIENTE TESTE LTDA',
                awb: '17259382746',
                hawb: 'CWB00014574',
                diDue: '1234567890',
                dta: '',
                placa: '',
                semCarga: true,
                observacoes: 'Serviço de acesso para veículos de entrega'
            },
            {
                id: 2,
                status: 'EXECUTADO',
                ficha: '596169',
                servico: 'Coleta de Carga com Pátio Vencido',
                data: '20/05/2025',
                hora: '06:32',
                processo: '350790-',
                entidade: 'XYZ - DESPACHOS TESTE',
                awb: '02034583975',
                hawb: 'H362624',
                diDue: '9876543210',
                dta: 'DTA123456',
                placa: 'ABC-1234',
                semCarga: false,
                observacoes: 'Coleta realizada com sucesso'
            },
            {
                id: 3,
                status: 'AGENDAMENTO',
                ficha: '630089',
                servico: 'Descarregamento - Exportação',
                data: '08/07/2025',
                hora: '09:15',
                processo: '366769-',
                entidade: 'EMPRESA EXPORTADORA LTDA',
                awb: '23529533733',
                hawb: 'CPO230501802',
                diDue: '1122334455',
                dta: '',
                placa: 'DEF-5678',
                semCarga: false,
                observacoes: 'Agendado para descarregamento'
            },
            {
                id: 4,
                status: 'SOLICITACAO',
                ficha: '630090',
                servico: 'Visualização de gravação de video',
                data: '09/07/2025',
                hora: '14:30',
                processo: '366770-',
                entidade: 'SEGURANÇA EMPRESARIAL LTDA',
                awb: '',
                hawb: '',
                diDue: '',
                dta: '',
                placa: '',
                semCarga: true,
                observacoes: 'Solicitação para visualização de vídeo de segurança'
            },
            {
                id: 5,
                status: 'EXECUTADO',
                ficha: '630091',
                servico: 'Carga nacional',
                data: '10/07/2025',
                hora: '11:45',
                processo: '366771-',
                entidade: 'TRANSPORTADORA NACIONAL LTDA',
                awb: '54930242984',
                hawb: 'A531196',
                diDue: '5566778899',
                dta: '',
                placa: 'GHI-9012',
                semCarga: false,
                observacoes: 'Carga nacional processada'
            },
            {
                id: 6,
                status: 'AGENDAMENTO',
                ficha: '630092',
                servico: 'Alteração de CNPJ',
                data: '11/07/2025',
                hora: '16:20',
                processo: '366772-',
                entidade: 'ADMINISTRATIVA BRASIL LTDA',
                awb: '',
                hawb: '',
                diDue: '',
                dta: '',
                placa: '',
                semCarga: true,
                observacoes: 'Solicitação de alteração de CNPJ'
            },
            {
                id: 7,
                status: 'SOLICITACAO',
                ficha: '630093',
                servico: 'Acesso de Veículos',
                data: '12/07/2025',
                hora: '08:00',
                processo: '366773-',
                entidade: 'LOGÍSTICA RÁPIDA LTDA',
                awb: '54930334872',
                hawb: 'A512141',
                diDue: '9988776655',
                dta: '',
                placa: 'JKL-3456',
                semCarga: false,
                observacoes: 'Acesso para veículos de carga'
            },
            {
                id: 8,
                status: 'EXECUTADO',
                ficha: '630094',
                servico: 'Coleta de Carga com Pátio Vencido',
                data: '13/07/2025',
                hora: '13:15',
                processo: '366774-',
                entidade: 'DISTRIBUIDORA CENTRAL LTDA',
                awb: '23528432596',
                hawb: 'CWB0013443',
                diDue: '4433221100',
                dta: 'DTA789012',
                placa: 'MNO-7890',
                semCarga: false,
                observacoes: 'Coleta realizada conforme agendamento'
            },
            {
                id: 9,
                status: 'AGENDAMENTO',
                ficha: '630095',
                servico: 'Descarregamento - Exportação',
                data: '14/07/2025',
                hora: '10:30',
                processo: '366775-',
                entidade: 'EXPORTADORA GLOBAL LTDA',
                awb: '72948660673',
                hawb: '1054944630',
                diDue: '3344556677',
                dta: '',
                placa: 'PQR-1234',
                semCarga: false,
                observacoes: 'Descarregamento agendado para exportação'
            },
            {
                id: 10,
                status: 'SOLICITACAO',
                ficha: '630096',
                servico: 'Visualização de gravação de video',
                data: '15/07/2025',
                hora: '15:45',
                processo: '366776-',
                entidade: 'MONITORAMENTO 24H LTDA',
                awb: '',
                hawb: '',
                diDue: '',
                dta: '',
                placa: '',
                semCarga: true,
                observacoes: 'Solicitação para análise de vídeo'
            }
        ];
    }
    
    loadOrdens() {
        // Simular carregamento de dados
        this.ordens = this.generateMockData();
        this.totalItems = this.ordens.length;
        this.renderTable();
        this.renderPagination();
    }
    
    renderTable() {
        const tbody = document.getElementById('ordensTableBody');
        if (!tbody) return;
        
        const filteredOrdens = this.getFilteredOrdens();
        
        if (filteredOrdens.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="13" class="text-center py-4">
                        <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                        <p class="text-muted">Nenhuma ordem de serviço encontrada</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageOrdens = filteredOrdens.slice(startIndex, endIndex);
        
        tbody.innerHTML = pageOrdens.map(ordem => this.renderOrdemRow(ordem)).join('');
    }
    
    renderOrdemRow(ordem) {
        // Definir ícones e cores para cada status
        let statusIcon = '';
        let statusClass = '';
        
        switch(ordem.status) {
            case 'SOLICITACAO':
                statusIcon = '<i class="fas fa-handshake"></i>';
                statusClass = 'text-warning';
                break;
            case 'EXECUTADO':
                statusIcon = '<i class="fas fa-thumbs-up"></i>';
                statusClass = 'text-success';
                break;
            case 'AGENDAMENTO':
                statusIcon = '<i class="fas fa-calendar-alt"></i>';
                statusClass = 'text-danger';
                break;
            default:
                statusIcon = '<i class="fas fa-question-circle"></i>';
                statusClass = 'text-muted';
        }
        
        return `
            <tr class="ordem-row">
                <td class="text-start">
                    <div class="d-flex align-items-center gap-2">
                        <span class="${statusClass}">${statusIcon}</span>
                        <span class="small fw-bold ${statusClass}">${ordem.status}</span>
                    </div>
                </td>
                <td class="text-start">${ordem.ficha}</td>
                <td class="text-start small">${ordem.servico}</td>
                <td class="text-center">${ordem.data}</td>
                <td class="text-center">${ordem.hora}</td>
                <td class="text-start">${ordem.processo}</td>
                <td class="text-start small">${ordem.entidade}</td>
                <td class="text-center small">${ordem.awb}</td>
                <td class="text-center small">${ordem.hawb}</td>
                <td class="text-center small">${ordem.diDue}</td>
                <td class="text-center small">${ordem.dta}</td>
                <td class="text-center small">${ordem.placa}</td>
                <td class="text-center">
                    <div class="d-flex gap-1 justify-content-center align-items-center">
                        <button class="btn btn-sm btn-outline-primary" onclick="ordemServicoManager.editOrdem(${ordem.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="ordemServicoManager.viewOrdem(${ordem.id})" title="Visualizar">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }
    
    getFilteredOrdens() {
        let filtered = [...this.ordens];
        
        // Aplicar filtro de serviços sem carga
        if (document.getElementById('semCargaAtrelada')?.checked) {
            filtered = filtered.filter(o => o.semCarga);
        }
        
        // Aplicar filtros de data
        const dataInicio = document.getElementById('dataInicio')?.value;
        const dataFinal = document.getElementById('dataFinal')?.value;
        
        if (dataInicio) {
            filtered = filtered.filter(o => {
                const dataOrdem = this.convertDateToComparable(o.data);
                const dataInicioComparable = this.convertDateToComparable(dataInicio);
                return dataOrdem >= dataInicioComparable;
            });
        }
        
        if (dataFinal) {
            filtered = filtered.filter(o => {
                const dataOrdem = this.convertDateToComparable(o.data);
                const dataFinalComparable = this.convertDateToComparable(dataFinal);
                return dataOrdem <= dataFinalComparable;
            });
        }
        
        // Aplicar filtro de busca
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(o => {
                switch(this.searchBy) {
                    case 'ficha':
                        return o.ficha.toLowerCase().includes(searchTerm);
                    case 'servico':
                        return o.servico.toLowerCase().includes(searchTerm);
                    case 'processo':
                        return o.processo.toLowerCase().includes(searchTerm);
                    case 'entidade':
                        return o.entidade.toLowerCase().includes(searchTerm);
                    case 'awb':
                        return o.awb.toLowerCase().includes(searchTerm);
                    case 'hawb':
                        return o.hawb.toLowerCase().includes(searchTerm);
                    default:
                        return o.ficha.toLowerCase().includes(searchTerm) ||
                               o.servico.toLowerCase().includes(searchTerm) ||
                               o.processo.toLowerCase().includes(searchTerm) ||
                               o.entidade.toLowerCase().includes(searchTerm);
                }
            });
        }
        
        return filtered;
    }
    
    convertDateToComparable(dateStr) {
        // Converter DD/MM/YYYY para formato comparável
        if (dateStr.includes('/')) {
            const [day, month, year] = dateStr.split('/');
            return new Date(year, month - 1, day);
        }
        return new Date(dateStr);
    }
    
    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        
        const filteredCount = this.getFilteredOrdens().length;
        const totalPages = Math.ceil(filteredCount / this.itemsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Botão primeira página
        paginationHTML += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ordemServicoManager.goToPage(1)">
                    <i class="fas fa-angle-double-left"></i>
                </a>
            </li>
        `;
        
        // Botão página anterior
        paginationHTML += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ordemServicoManager.goToPage(${this.currentPage - 1})">
                    <i class="fas fa-angle-left"></i> Página Anterior
                </a>
            </li>
        `;
        
        // Informações da página atual
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, filteredCount);
        
        paginationHTML += `
            <li class="page-item disabled">
                <span class="page-link">
                    Exibindo <strong>${startItem}</strong> a <strong>${endItem}</strong> de <strong>${filteredCount}</strong> registros
                </span>
            </li>
        `;
        
        // Botão próxima página
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ordemServicoManager.goToPage(${this.currentPage + 1})">
                    Próxima Página <i class="fas fa-angle-right"></i>
                </a>
            </li>
        `;
        
        // Botão última página
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ordemServicoManager.goToPage(${totalPages})">
                    <i class="fas fa-angle-double-right"></i>
                </a>
            </li>
        `;
        
        pagination.innerHTML = paginationHTML;
    }
    
    goToPage(page) {
        const filteredCount = this.getFilteredOrdens().length;
        const totalPages = Math.ceil(filteredCount / this.itemsPerPage);
        
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
            this.renderPagination();
        }
    }
    
    changeItemsPerPage(value) {
        this.itemsPerPage = parseInt(value);
        this.currentPage = 1;
        this.renderTable();
        this.renderPagination();
    }
    
    setSearchBy(type) {
        this.searchBy = type;
        const dropdown = document.getElementById('searchByDropdown');
        if (dropdown) {
            dropdown.innerHTML = `<i class="fas fa-search"></i> Pesquisar por ${type}`;
        }
    }
    
    performSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            this.filters.search = searchInput.value;
            this.currentPage = 1;
            this.renderTable();
            this.renderPagination();
        }
    }
    
    filterSemCarga() {
        this.currentPage = 1;
        this.renderTable();
        this.renderPagination();
    }
    
    clearFilters() {
        this.filters = {};
        this.currentPage = 1;
        
        // Limpar campos do formulário
        document.getElementById('searchInput').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('tipoServicoFilter').value = '';
        document.getElementById('entidadeFilter').value = '';
        document.getElementById('fichaFilter').value = '';
        document.getElementById('processoFilter').value = '';
        document.getElementById('awbFilter').value = '';
        document.getElementById('hawbFilter').value = '';
        document.getElementById('diDueFilter').value = '';
        document.getElementById('placaFilter').value = '';
        document.getElementById('dataDeFilter').value = '';
        document.getElementById('dataAteFilter').value = '';
        document.getElementById('semCargaAtreladaFilter').checked = false;
        document.getElementById('itemsPorPagina').value = '10';
        
        this.itemsPerPage = 10;
        this.renderTable();
        this.renderPagination();
    }
    
    refreshTable() {
        this.loadOrdens();
    }
    
    toggleAdvancedFilters() {
        const filtersDiv = document.getElementById('advancedFilters');
        if (!filtersDiv) return;
        
        const isVisible = filtersDiv.style.display !== 'none';
        filtersDiv.style.display = isVisible ? 'none' : 'block';
    }
    
    clearAdvancedFilters() {
        this.clearFilters();
    }
    
    fecharCadastroServico() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('cadastroServicoModal'));
        if (modal) {
            modal.hide();
        }
    }
    
    cadastrarServico() {
        const modal = new bootstrap.Modal(document.getElementById('cadastroServicoModal'));
        modal.show();
        this.resetCadastroForm();
    }
    
    resetCadastroForm() {
        document.getElementById('cadastroServicoForm').reset();
    }
    
    salvarServico() {
        // Validar formulário
        if (!this.validateCadastroForm()) {
            return;
        }
        
        // Coletar dados do formulário
        const formData = this.collectCadastroFormData();
        
        console.log('Dados do serviço:', formData);
        
        // Simular salvamento
        this.showNotification('Ordem de serviço cadastrada com sucesso!', 'success');
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('cadastroServicoModal'));
        modal.hide();
        
        // Recarregar lista
        this.loadOrdens();
    }
    
    validateCadastroForm() {
        const requiredFields = ['tipoServico', 'entidadeServico', 'dataServico', 'horaServico'];
        
        let isValid = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else if (field) {
                field.classList.remove('is-invalid');
            }
        });
        
        if (!isValid) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        }
        
        return isValid;
    }
    
    collectCadastroFormData() {
        return {
            tipoServico: document.getElementById('tipoServico')?.value || '',
            entidadeServico: document.getElementById('entidadeServico')?.value || '',
            dataServico: document.getElementById('dataServico')?.value || '',
            horaServico: document.getElementById('horaServico')?.value || '',
            processoServico: document.getElementById('processoServico')?.value || '',
            fichaServico: document.getElementById('fichaServico')?.value || '',
            awbServico: document.getElementById('awbServico')?.value || '',
            hawbServico: document.getElementById('hawbServico')?.value || '',
            diDueServico: document.getElementById('diDueServico')?.value || '',
            placaServico: document.getElementById('placaServico')?.value || '',
            observacoesServico: document.getElementById('observacoesServico')?.value || ''
        };
    }
    
    viewOrdem(id) {
        const ordem = this.ordens.find(o => o.id === id);
        if (!ordem) return;
        
        this.currentOrdem = ordem;
        this.populateViewModal(ordem);
        
        const modal = new bootstrap.Modal(document.getElementById('visualizarServicoModal'));
        modal.show();
    }
    
    populateViewModal(ordem) {
        const modalBody = document.getElementById('visualizarServicoBody');
        
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">Status:</label>
                    <p class="mb-0">${ordem.status}</p>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">Ficha:</label>
                    <p class="mb-0">${ordem.ficha}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 mb-3">
                    <label class="form-label fw-bold">Serviço:</label>
                    <p class="mb-0">${ordem.servico}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">Data:</label>
                    <p class="mb-0">${ordem.data}</p>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">Hora:</label>
                    <p class="mb-0">${ordem.hora}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">Processo:</label>
                    <p class="mb-0">${ordem.processo}</p>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">Entidade:</label>
                    <p class="mb-0">${ordem.entidade}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">AWB:</label>
                    <p class="mb-0">${ordem.awb}</p>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">HAWB:</label>
                    <p class="mb-0">${ordem.hawb}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">DI/DUE:</label>
                    <p class="mb-0">${ordem.diDue}</p>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">Placa:</label>
                    <p class="mb-0">${ordem.placa}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 mb-3">
                    <label class="form-label fw-bold">Observações:</label>
                    <p class="mb-0">${ordem.observacoes}</p>
                </div>
            </div>
        `;
    }
    
    editOrdem(id) {
        this.viewOrdem(id);
        // Aqui você pode implementar a lógica de edição
        this.showNotification('Funcionalidade de edição será implementada em breve.', 'info');
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

// Funções globais
function refreshTable() {
    if (window.ordemServicoManager) {
        window.ordemServicoManager.refreshTable();
    }
}

function toggleAdvancedFilters() {
    if (window.ordemServicoManager) {
        window.ordemServicoManager.toggleAdvancedFilters();
    }
}

function clearAdvancedFilters() {
    if (window.ordemServicoManager) {
        window.ordemServicoManager.clearAdvancedFilters();
    }
}

function fecharCadastroServico() {
    if (window.ordemServicoManager) {
        window.ordemServicoManager.fecharCadastroServico();
    }
}

function salvarServico() {
    if (window.ordemServicoManager) {
        window.ordemServicoManager.salvarServico();
    }
}

function editarServico() {
    if (window.ordemServicoManager) {
        window.ordemServicoManager.editOrdem(window.ordemServicoManager.currentOrdem?.id);
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se já existe uma instância para evitar duplicação
    if (!window.ordemServicoManager) {
        window.ordemServicoManager = new OrdemServicoManager();
    }
});

} // Fechar o bloco if da verificação de classe
