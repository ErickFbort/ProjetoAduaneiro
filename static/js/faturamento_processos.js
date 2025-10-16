// JavaScript para a tela de Processos de Faturamento
// Verificar se a classe já existe para evitar redeclaração
if (typeof FaturamentoProcessosManager === 'undefined') {
    class FaturamentoProcessosManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.totalItems = 0;
        this.filters = {};
        this.processos = [];
        this.currentProcesso = null;
        
        // Base de dados de documentos por natureza de operação
        this.documentosPorNatureza = {
            '05.03': { // Despacho De Exportacao - Aereo
                obrigatorios: ['AIR WAY BILL / HAWB', 'DUE', 'NFE'],
                opcionais: ['LPCO', 'OUTROS DOCUMENTOS']
            },
            '05.04': { // Despacho De Exportacao - Aereo Via Dta
                obrigatorios: ['AIR WAY BILL / HAWB', 'DUE', 'NFE'],
                opcionais: ['LPCO', 'OUTROS DOCUMENTOS']
            },
            '05.01': { // Despacho De Exportacao - Maritimo
                obrigatorios: ['CONHECIMENTO DE EMBARQUE', 'DUE', 'NFE'],
                opcionais: ['LPCO', 'OUTROS DOCUMENTOS']
            },
            '05.02': { // Despacho De Exportacao - Rodoviario
                obrigatorios: ['CONHECIMENTO DE FRETE', 'DUE', 'NFE'],
                opcionais: ['LPCO', 'OUTROS DOCUMENTOS']
            },
            '01.01': { // Despacho De Importacao - Aereo
                obrigatorios: ['AIR WAY BILL / HAWB', 'DI/DUIMP', 'EXTRATO ICMS', 'NFE', 'AUT. CARREGAMENTO'],
                opcionais: ['LPCO']
            },
            '01.02': { // Despacho De Importacao - Maritimo
                obrigatorios: ['CONHECIMENTO DE EMBARQUE', 'DI/DUIMP', 'EXTRATO ICMS', 'NFE', 'AUT. CARREGAMENTO'],
                opcionais: ['LPCO']
            },
            '01.03': { // Despacho De Importacao - Rodoviario
                obrigatorios: ['CONHECIMENTO DE FRETE', 'DI/DUIMP', 'EXTRATO ICMS', 'NFE', 'AUT. CARREGAMENTO'],
                opcionais: ['LPCO']
            },
            '05.05': { // Devolucao De Madeira Para Exterior
                obrigatorios: [],
                opcionais: ['LPCO', 'OUTROS DOCUMENTOS']
            },
            '05.06': { // Despacho De Importacao - Aereo Dsi
                obrigatorios: ['AIR WAY BILL / HAWB', 'DSI/DUIMP', 'EXTRATO ICMS', 'AUT. CARREGAMENTO'],
                opcionais: ['NFE', 'LPCO']
            },
            '05.08': { // Operacao Courier
                obrigatorios: [],
                opcionais: ['LPCO', 'OUTROS DOCUMENTOS']
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadProcessos();
    }
    
    setupEventListeners() {
        // Filtros
        document.getElementById('clearFilters')?.addEventListener('click', () => this.clearFilters());
        document.getElementById('clearFiltersEmpty')?.addEventListener('click', () => this.clearFilters());
        document.getElementById('itemsPorPagina')?.addEventListener('change', (e) => this.changeItemsPerPage(e.target.value));
        document.getElementById('requisicaoFilter')?.addEventListener('change', (e) => this.applyFilter('requisicao', e.target.value));
        document.getElementById('criacaoDeFilter')?.addEventListener('change', (e) => this.applyFilter('criacaoDe', e.target.value));
        document.getElementById('criacaoAteFilter')?.addEventListener('change', (e) => this.applyFilter('criacaoAte', e.target.value));
        
        // Busca
        document.getElementById('searchBtn')?.addEventListener('click', () => this.performSearch());
        document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
        
        // Botões de ação
        document.getElementById('advancedSearch')?.addEventListener('click', () => this.showAdvancedSearch());
        document.getElementById('cadastrarProcesso')?.addEventListener('click', () => this.showCadastroModal());
    }
    
    // Dados simulados específicos para faturamento
    generateMockData() {
        return [
            {
                id: 1,
                status: 'APROVADO',
                impoExpo: 'EXPORTACAO',
                pendencias: true,
                carga: '',
                requisicao: '203368',
                protocolo: '2023.2225.698',
                criado: '17/07/2023 10:16',
                atualizado: '18/07/2023 11:44',
                referencia: 'CWB-0001-4574',
                cliente: 'ONESUBSEA DO BRASIL LTDA.',
                despachante: 'ROGERIO KOLAKOWSKI',
                awb: '17259382746',
                hawb: 'CWB00014574',
                di: '',
                dta: '',
                nfe: '',
                // Dados detalhados para o modal
                detalhes: {
                    despachante: '637-68038160959',
                    clienteCompleto: '05876349000105 - ONESUBSEA DO BRASIL LTDA.',
                    naturezaOperacao: '05.03',
                    dataPontoZero: '2023-07-17',
                    referenciaCliente: 'CWB-0001 4574',
                    previsaoCarregamento: '2023-07-18',
                    observacao: '',
                    reexportacao: 'nao',
                    impedimentoCarga: '',
                    receberGuiasEmail: 'nao',
                    emailGuias: '',
                    observacaoInterna: '',
                    statusFaturamento: 'faturado',
                    // Dados da carga
                    regimeAduaneiro: 'exportacao_definitiva',
                    objetivoImportacao: 'comercial',
                    tipoCarga: 'geral',
                    imoDgr: 'nao',
                    volume: 0,
                    pesoBruto: 0.00000,
                    valorCif: 0.00,
                    valorFrete: 0.00,
                    valorSeguro: 0.00,
                    valorFob: 0.00,
                    moedaFrete: 'USD',
                    moedaSeguro: 'USD',
                    moedaFob: 'USD',
                    embalagemMadeira: 'nao',
                    controleTemperatura: 'nao'
                }
            },
            {
                id: 2,
                status: 'PENDENTE',
                impoExpo: 'IMPORTACAO',
                pendencias: false,
                carga: '',
                requisicao: '180',
                protocolo: '2020.780.181',
                criado: '11/08/2020 16:56',
                atualizado: '12/08/2020 10:40:58',
                referencia: '',
                cliente: 'LOTUS INDUSTRIA E COMERCIO LTDA',
                despachante: 'GLEDSON ADRIANO ALVES',
                awb: '',
                hawb: '',
                di: '',
                dta: '',
                nfe: '',
                detalhes: {
                    despachante: '637-68038160959',
                    clienteCompleto: '02345678000123 - LOTUS INDUSTRIA E COMERCIO LTDA',
                    naturezaOperacao: '01.01',
                    dataPontoZero: '2020-08-11',
                    referenciaCliente: '',
                    previsaoCarregamento: '2020-08-13',
                    observacao: '',
                    reexportacao: 'nao',
                    impedimentoCarga: '',
                    receberGuiasEmail: 'nao',
                    emailGuias: '',
                    observacaoInterna: '',
                    statusFaturamento: 'pendente',
                    regimeAduaneiro: 'importacao_definitiva',
                    objetivoImportacao: 'comercial',
                    tipoCarga: 'geral',
                    imoDgr: 'nao',
                    volume: 0,
                    pesoBruto: 0.00000,
                    valorCif: 0.00,
                    valorFrete: 0.00,
                    valorSeguro: 0.00,
                    valorFob: 0.00,
                    moedaFrete: 'USD',
                    moedaSeguro: 'USD',
                    moedaFob: 'USD',
                    embalagemMadeira: 'nao',
                    controleTemperatura: 'nao'
                }
            },
            {
                id: 3,
                status: 'PROCESSANDO',
                impoExpo: 'EXPORTACAO',
                pendencias: true,
                carga: '',
                requisicao: '403950',
                protocolo: '2025.5900.1193',
                criado: '25/09/2025 08:44',
                atualizado: '27/09/2025 07:23:12',
                referencia: 'H362624',
                cliente: 'DHL GLOBAL FORWARDING BRAZIL LOGISTICS LTDA.',
                despachante: 'ROGERIO KOLAKOWSKI',
                awb: '02034583975',
                hawb: 'H362624',
                di: '',
                dta: '',
                nfe: '528228',
                detalhes: {
                    despachante: '637-68038160959',
                    clienteCompleto: '03456789000134 - DHL GLOBAL FORWARDING BRAZIL LOGISTICS LTDA.',
                    naturezaOperacao: '05.03',
                    dataPontoZero: '2025-09-25',
                    referenciaCliente: 'H362624',
                    previsaoCarregamento: '2025-09-28',
                    observacao: '',
                    reexportacao: 'nao',
                    impedimentoCarga: '',
                    receberGuiasEmail: 'nao',
                    emailGuias: '',
                    observacaoInterna: '',
                    statusFaturamento: 'processando',
                    regimeAduaneiro: 'exportacao_definitiva',
                    objetivoImportacao: 'comercial',
                    tipoCarga: 'geral',
                    imoDgr: 'nao',
                    volume: 0,
                    pesoBruto: 0.00000,
                    valorCif: 0.00,
                    valorFrete: 0.00,
                    valorSeguro: 0.00,
                    valorFob: 0.00,
                    moedaFrete: 'USD',
                    moedaSeguro: 'USD',
                    moedaFob: 'USD',
                    embalagemMadeira: 'nao',
                    controleTemperatura: 'nao'
                }
            }
        ];
    }
    
    loadProcessos() {
        // Simular carregamento de dados
        this.processos = this.generateMockData();
        this.totalItems = this.processos.length;
        this.renderTable();
        this.renderPagination();
    }
    
    renderTable() {
        const tbody = document.getElementById('processosTableBody');
        const emptyState = document.getElementById('emptyState');
        
        if (!tbody) return;
        
        const filteredProcessos = this.getFilteredProcessos();
        
        if (filteredProcessos.length === 0) {
            tbody.innerHTML = '';
            emptyState?.classList.remove('d-none');
            return;
        }
        
        emptyState?.classList.add('d-none');
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageProcessos = filteredProcessos.slice(startIndex, endIndex);
        
        tbody.innerHTML = pageProcessos.map(processo => this.renderProcessoRow(processo)).join('');
    }
    
    renderProcessoRow(processo) {
        // Definir ícones e cores para cada status
        let statusIcon = '';
        let statusClass = '';
        
        switch(processo.status) {
            case 'APROVADO':
                statusIcon = '<i class="fas fa-check-circle text-success"></i>';
                statusClass = 'text-success';
                break;
            case 'CANCELADO':
                statusIcon = '<i class="fas fa-times-circle text-danger"></i>';
                statusClass = 'text-danger';
                break;
            case 'CARGA ENTREGUE':
                statusIcon = '<i class="fas fa-thumbs-up text-info"></i>';
                statusClass = 'text-info';
                break;
            case 'EM ABERTO':
                statusIcon = '<i class="fas fa-clock text-warning"></i>';
                statusClass = 'text-warning';
                break;
            case 'ENCERRADO':
                statusIcon = '<i class="fas fa-check text-success"></i>';
                statusClass = 'text-success';
                break;
            case 'PENDENCIA DOCUMENTAL':
                statusIcon = '<i class="fas fa-file-exclamation text-warning"></i>';
                statusClass = 'text-warning';
                break;
            case 'PENDENTE':
                statusIcon = '<i class="fas fa-clock text-warning"></i>';
                statusClass = 'text-warning';
                break;
            case 'PROCESSANDO':
                statusIcon = '<i class="fas fa-cog text-info"></i>';
                statusClass = 'text-info';
                break;
            default:
                statusIcon = '<i class="fas fa-question-circle text-muted"></i>';
                statusClass = 'text-muted';
        }
        
        const pendenciasIcon = processo.pendencias ? '<i class="fas fa-exclamation-triangle text-warning"></i>' : '';
        
        return `
            <tr class="processo-row">
                <td class="text-center">
                    <div class="d-flex align-items-center justify-content-center gap-2">
                        ${statusIcon}
                        <span class="small fw-bold">${processo.status}</span>
                    </div>
                </td>
                <td>${processo.impoExpo}</td>
                <td class="text-center">${pendenciasIcon}</td>
                <td>${processo.carga}</td>
                <td>${processo.requisicao}</td>
                <td>${processo.protocolo}</td>
                <td class="small">${processo.criado}</td>
                <td class="small">${processo.atualizado}</td>
                <td>${processo.referencia}</td>
                <td class="small">${processo.cliente}</td>
                <td class="small">${processo.despachante}</td>
                <td>${processo.awb}</td>
                <td>${processo.hawb}</td>
                <td>${processo.di}</td>
                <td>${processo.dta}</td>
                <td>${processo.nfe}</td>
                <td class="text-center">
                    <div class="d-flex gap-1 justify-content-center align-items-center">
                        <button class="btn btn-sm btn-outline-primary" onclick="faturamentoProcessosManager.editProcesso(${processo.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="faturamentoProcessosManager.viewProcesso(${processo.id})" title="Visualizar">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }
    
    getFilteredProcessos() {
        let filtered = [...this.processos];
        
        // Aplicar filtros
        if (this.filters.requisicao) {
            filtered = filtered.filter(p => p.status.toLowerCase().includes(this.filters.requisicao.toLowerCase()));
        }
        
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(p => 
                p.cliente.toLowerCase().includes(searchTerm) ||
                p.requisicao.includes(searchTerm) ||
                p.protocolo.includes(searchTerm) ||
                p.referencia.toLowerCase().includes(searchTerm) ||
                p.despachante.toLowerCase().includes(searchTerm)
            );
        }
        
        return filtered;
    }
    
    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        
        const filteredCount = this.getFilteredProcessos().length;
        const totalPages = Math.ceil(filteredCount / this.itemsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Botão anterior
        paginationHTML += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="faturamentoProcessosManager.goToPage(${this.currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;
        
        // Páginas
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="faturamentoProcessosManager.goToPage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }
        
        // Botão próximo
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="faturamentoProcessosManager.goToPage(${this.currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;
        
        pagination.innerHTML = paginationHTML;
    }
    
    goToPage(page) {
        const filteredCount = this.getFilteredProcessos().length;
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
    
    applyFilter(filterName, value) {
        this.filters[filterName] = value;
        this.currentPage = 1;
        this.renderTable();
        this.renderPagination();
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
    
    clearFilters() {
        this.filters = {};
        this.currentPage = 1;
        
        // Limpar campos do formulário
        document.getElementById('searchInput').value = '';
        document.getElementById('requisicaoFilter').value = '';
        document.getElementById('criacaoDeFilter').value = '';
        document.getElementById('criacaoAteFilter').value = '';
        document.getElementById('itemsPorPagina').value = '10';
        
        this.itemsPerPage = 10;
        this.renderTable();
        this.renderPagination();
    }
    
    showAdvancedSearch() {
        toggleAdvancedFilters();
    }
    
    exportProcesses() {
        this.showNotification('Funcionalidade de exportação será implementada em breve.', 'info');
    }
    
    importProcesses() {
        this.showNotification('Funcionalidade de importação será implementada em breve.', 'info');
    }
    
    showCadastroModal() {
        // Redirecionar para o módulo Web Clientes para cadastrar processo
        window.location.href = '/web-clientes/processos/cadastro';
    }
    
    editProcesso(id) {
        // Redirecionar para o módulo Web Clientes para editar processo
        window.location.href = `/web-clientes/processos/editar/${id}`;
    }
    
    viewProcesso(id) {
        // Redirecionar para o módulo Web Clientes para visualizar processo
        window.location.href = `/web-clientes/processos/visualizar/${id}`;
    }
    
    
    
    solicitarFaturamento() {
        this.showNotification('Solicitação de faturamento enviada com sucesso!', 'success');
    }
    
    fichaLote() {
        this.showNotification('Funcionalidade de ficha lote será implementada em breve.', 'info');
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
    console.log('toggleAdvancedFilters chamada');
    const filtersDiv = document.getElementById('advancedFilters');
    if (!filtersDiv) {
        console.error('Elemento advancedFilters não encontrado');
        return;
    }
    
    const isVisible = filtersDiv.style.display !== 'none';
    console.log('Filtros atualmente visíveis:', !isVisible);
    
    if (isVisible) {
        filtersDiv.style.display = 'none';
        console.log('Ocultando filtros avançados');
    } else {
        filtersDiv.style.display = 'block';
        console.log('Mostrando filtros avançados');
    }
}

function clearAdvancedFilters() {
    // Limpar todos os campos do filtro avançado
    document.getElementById('statusFilter').value = '';
    document.getElementById('regimeFilter').value = '';
    document.getElementById('despachanteFilter').value = '';
    document.getElementById('clienteFilter').value = '';
    document.getElementById('requisicaoFilter').value = '';
    document.getElementById('protocoloFilter').value = '';
    document.getElementById('naturezaOperacaoFilter').value = '';
    document.getElementById('referenciaClienteFilter').value = '';
    document.getElementById('awbFilter').value = '';
    document.getElementById('hawbFilter').value = '';
    document.getElementById('numDocumentoLibFilter').value = '';
    document.getElementById('dataCadastroDeFilter').value = '';
    document.getElementById('dataCadastroAteFilter').value = '';
    document.getElementById('placaFilter').value = '';
    document.getElementById('dataSaidaFilter').value = '';
    
    // Limpar filtros no faturamentoProcessosManager
    if (window.faturamentoProcessosManager) {
        window.faturamentoProcessosManager.clearFilters();
    }
}

function refreshTable() {
    console.log('refreshTable chamada');
    if (window.faturamentoProcessosManager) {
        console.log('faturamentoProcessosManager encontrado, recarregando dados...');
        window.faturamentoProcessosManager.loadProcessos();
    } else {
        console.error('faturamentoProcessosManager não encontrado');
    }
}


// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se já existe uma instância para evitar duplicação
    if (!window.faturamentoProcessosManager) {
        window.faturamentoProcessosManager = new FaturamentoProcessosManager();
    }
});

} // Fechar o bloco if da verificação de classe
