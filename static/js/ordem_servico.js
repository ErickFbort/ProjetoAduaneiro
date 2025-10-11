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
        this.currentView = 'listagem'; // 'listagem' ou 'cadastro'
        
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
        
        // Event listener para o checkbox "Serviço sem carga atrelada"
        document.getElementById('servicoSemCargaAtrelada')?.addEventListener('change', (e) => this.toggleCamposCarga(e.target.checked));
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
        document.getElementById('semCargaAtrelada').checked = false;
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
    
    
    cadastrarServico() {
        this.showCadastroView();
        this.resetCadastroForm();
    }
    
    showCadastroView() {
        this.currentView = 'cadastro';
        document.getElementById('listagemView').style.display = 'none';
        document.getElementById('cadastroView').style.display = 'block';
    }
    
    showListagemView() {
        this.currentView = 'listagem';
        document.getElementById('cadastroView').style.display = 'none';
        document.getElementById('listagemView').style.display = 'block';
    }
    
    resetCadastroForm() {
        document.getElementById('cadastroServicoForm').reset();
        
        // Resetar campos específicos
        document.getElementById('servicoSemCargaAtrelada').checked = false;
        this.toggleCamposCarga(false); // Começar com campos de com carga visíveis
        
        // Limpar tabela de serviços
        const tbody = document.getElementById('servicosTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="12" class="text-center text-danger py-3">
                        Nenhum serviço adicionado
                    </td>
                </tr>
            `;
        }
        
        // Limpar formulário de adição de serviços
        this.limparFormularioServico();
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
        
        // Voltar para a listagem
        this.showListagemView();
        
        // Recarregar lista
        this.loadOrdens();
    }
    
    validateCadastroForm() {
        const servicoSemCarga = document.getElementById('servicoSemCargaAtrelada').checked;
        let isValid = true;
        
        if (servicoSemCarga) {
            // Validar campos para serviço SEM carga atrelada
            const camposObrigatorios = ['entidadeServico', 'tipoServico'];
            
            camposObrigatorios.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && !field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else if (field) {
                    field.classList.remove('is-invalid');
                }
            });
        } else {
            // Para serviço COM carga atrelada, não há campos obrigatórios específicos
            // mas podemos validar se pelo menos um campo foi preenchido
            const camposComCarga = ['awbServico', 'hawbServico', 'diServico', 'dtaServico'];
            const algumCampoPreenchido = camposComCarga.some(campoId => {
                const campo = document.getElementById(campoId);
                return campo && campo.value.trim();
            });
            
            if (!algumCampoPreenchido) {
                this.showNotification('Preencha pelo menos um campo do processo (AWB, HAWB, DI ou DTA).', 'error');
                isValid = false;
            }
        }
        
        if (!isValid) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        }
        
        return isValid;
    }
    
    collectCadastroFormData() {
        const servicoSemCarga = document.getElementById('servicoSemCargaAtrelada').checked;
        
        const baseData = {
            servicoSemCargaAtrelada: servicoSemCarga,
            servicos: this.coletarServicos()
        };
        
        if (servicoSemCarga) {
            // Coletar dados para serviço SEM carga atrelada
            return {
                ...baseData,
                entidadeServico: document.getElementById('entidadeServico')?.value || '',
                tipoServico: document.getElementById('tipoServico')?.value || '',
                termoServico: document.getElementById('termoServico')?.value || '',
                placaServico: document.getElementById('placaServico')?.value || ''
            };
        } else {
            // Coletar dados para serviço COM carga atrelada
            return {
                ...baseData,
                awbServico: document.getElementById('awbServico')?.value || '',
                hawbServico: document.getElementById('hawbServico')?.value || '',
                diServico: document.getElementById('diServico')?.value || '',
                dtaServico: document.getElementById('dtaServico')?.value || '',
                termoServicoComCarga: document.getElementById('termoServicoComCarga')?.value || '',
                placaServicoComCarga: document.getElementById('placaServicoComCarga')?.value || ''
            };
        }
    }
    
    coletarServicos() {
        const tbody = document.getElementById('servicosTableBody');
        if (!tbody) return [];
        
        const servicos = [];
        const linhas = tbody.querySelectorAll('tr');
        
        linhas.forEach(linha => {
            const celulas = linha.querySelectorAll('td');
            if (celulas.length >= 11) { // Verificar se é uma linha válida (não a mensagem de "nenhum serviço")
                servicos.push({
                    servico: celulas[1].textContent,
                    data: celulas[2].textContent,
                    hora: celulas[3].textContent,
                    dataFim: celulas[4].textContent !== '-' ? celulas[4].textContent : '',
                    horaFim: celulas[5].textContent !== '-' ? celulas[5].textContent : '',
                    quantidade: celulas[6].textContent,
                    status: celulas[7].textContent.trim(),
                    observacao: celulas[8].textContent !== '-' ? celulas[8].textContent : '',
                    cnpjCpf: celulas[9].textContent !== '-' ? celulas[9].textContent : '',
                    previaValor: celulas[10].textContent !== '-' ? celulas[10].textContent : ''
                });
            }
        });
        
        return servicos;
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
    
    toggleCamposCarga(semCargaAtrelada) {
        const camposSemCarga = document.getElementById('camposSemCarga');
        const camposComCarga = document.getElementById('camposComCarga');
        
        if (semCargaAtrelada) {
            // Mostrar apenas campos para serviço SEM carga atrelada
            camposSemCarga.style.display = 'block';
            camposComCarga.style.display = 'none';
            
            // Tornar campos obrigatórios para sem carga
            document.getElementById('entidadeServico').required = true;
            document.getElementById('tipoServico').required = true;
            
            // Limpar campos de com carga
            this.limparCamposComCarga();
        } else {
            // Mostrar apenas campos para serviço COM carga atrelada
            camposSemCarga.style.display = 'none';
            camposComCarga.style.display = 'block';
            
            // Remover obrigatoriedade dos campos sem carga
            document.getElementById('entidadeServico').required = false;
            document.getElementById('tipoServico').required = false;
            
            // Limpar campos de sem carga
            this.limparCamposSemCarga();
        }
    }
    
    limparCamposSemCarga() {
        const campos = ['entidadeServico', 'tipoServico', 'termoServico', 'placaServico'];
        campos.forEach(campoId => {
            const campo = document.getElementById(campoId);
            if (campo) {
                campo.value = '';
            }
        });
    }
    
    limparCamposComCarga() {
        const campos = ['awbServico', 'hawbServico', 'diServico', 'dtaServico', 'termoServicoComCarga', 'placaServicoComCarga'];
        campos.forEach(campoId => {
            const campo = document.getElementById(campoId);
            if (campo) {
                campo.value = '';
            }
        });
    }
    
    limparFormularioServico() {
        const campos = [
            'novoServico', 'novaDataServico', 'novaHoraServico', 
            'novaDataFimServico', 'novaHoraFimServico', 'novaQuantidadeServico',
            'novoStatusServico', 'novaObservacaoServico', 'novoCnpjCpfServico', 
            'novaPreviaValorServico'
        ];
        
        campos.forEach(campoId => {
            const campo = document.getElementById(campoId);
            if (campo) {
                campo.value = campoId === 'novaQuantidadeServico' ? '0' : '';
            }
        });
    }
    
    adicionarServico() {
        const servico = document.getElementById('novoServico').value.trim();
        const data = document.getElementById('novaDataServico').value;
        const hora = document.getElementById('novaHoraServico').value;
        const dataFim = document.getElementById('novaDataFimServico').value;
        const horaFim = document.getElementById('novaHoraFimServico').value;
        const quantidade = document.getElementById('novaQuantidadeServico').value;
        const status = document.getElementById('novoStatusServico').value;
        const observacao = document.getElementById('novaObservacaoServico').value.trim();
        const cnpjCpf = document.getElementById('novoCnpjCpfServico').value.trim();
        const previaValor = document.getElementById('novaPreviaValorServico').value.trim();
        
        if (!servico || servico.length < 3) {
            this.showNotification('Digite pelo menos 3 caracteres para o serviço.', 'error');
            return;
        }
        
        if (!data) {
            this.showNotification('Selecione uma data para o serviço.', 'error');
            return;
        }
        
        if (!hora) {
            this.showNotification('Selecione uma hora para o serviço.', 'error');
            return;
        }
        
        if (!status) {
            this.showNotification('Selecione um status para o serviço.', 'error');
            return;
        }
        
        // Adicionar serviço à tabela
        this.adicionarServicoATabela({
            servico, data, hora, dataFim, horaFim, quantidade, 
            status, observacao, cnpjCpf, previaValor
        });
        
        // Limpar formulário
        this.limparFormularioServico();
        
        this.showNotification('Serviço adicionado com sucesso!', 'success');
    }
    
    adicionarServicoATabela(dadosServico) {
        const tbody = document.getElementById('servicosTableBody');
        if (!tbody) return;
        
        // Se é a primeira linha (mensagem de "nenhum serviço"), substituir
        if (tbody.children.length === 1 && tbody.children[0].children.length === 1) {
            tbody.innerHTML = '';
        }
        
        const novaLinha = document.createElement('tr');
        novaLinha.innerHTML = `
            <td>${tbody.children.length + 1}</td>
            <td>${dadosServico.servico}</td>
            <td>${this.formatarData(dadosServico.data)}</td>
            <td>${dadosServico.hora}</td>
            <td>${dadosServico.dataFim ? this.formatarData(dadosServico.dataFim) : '-'}</td>
            <td>${dadosServico.horaFim || '-'}</td>
            <td>${dadosServico.quantidade}</td>
            <td>
                <span class="badge ${this.getStatusClass(dadosServico.status)}">
                    ${this.getStatusText(dadosServico.status)}
                </span>
            </td>
            <td>${dadosServico.observacao || '-'}</td>
            <td>${dadosServico.cnpjCpf || '-'}</td>
            <td>${dadosServico.previaValor || '-'}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="removerServico(this)" title="Remover">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(novaLinha);
    }
    
    formatarData(data) {
        if (!data) return '-';
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }
    
    getStatusClass(status) {
        switch(status) {
            case 'SOLICITACAO': return 'bg-warning';
            case 'EXECUTADO': return 'bg-success';
            case 'AGENDAMENTO': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }
    
    getStatusText(status) {
        switch(status) {
            case 'SOLICITACAO': return 'Solicitação';
            case 'EXECUTADO': return 'Executado';
            case 'AGENDAMENTO': return 'Agendamento';
            default: return status;
        }
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

function voltarParaListagem() {
    if (window.ordemServicoManager) {
        window.ordemServicoManager.showListagemView();
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

function adicionarServico() {
    if (window.ordemServicoManager) {
        window.ordemServicoManager.adicionarServico();
    }
}

function removerServico(botao) {
    if (window.ordemServicoManager) {
        const linha = botao.closest('tr');
        linha.remove();
        
        // Renumerar as linhas
        const tbody = document.getElementById('servicosTableBody');
        if (tbody) {
            const linhas = tbody.querySelectorAll('tr');
            linhas.forEach((linha, index) => {
                const primeiraCelula = linha.querySelector('td:first-child');
                if (primeiraCelula) {
                    primeiraCelula.textContent = index + 1;
                }
            });
            
            // Se não há mais serviços, mostrar mensagem
            if (linhas.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="12" class="text-center text-danger py-3">
                            Nenhum serviço adicionado
                        </td>
                    </tr>
                `;
            }
        }
        
        window.ordemServicoManager.showNotification('Serviço removido com sucesso!', 'success');
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
