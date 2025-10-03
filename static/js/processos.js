// JavaScript para a tela de Processos - Web Cliente
class ProcessosManager {
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
        document.getElementById('cadastrarProcesso')?.addEventListener('click', () => this.redirectToCadastro());
        
        // Modal de cadastro
        document.getElementById('descartarAlteracoesCadastro')?.addEventListener('click', () => this.descartarAlteracoesCadastro());
        document.querySelector('.btn-salvar')?.addEventListener('click', () => this.salvarProcessoCadastro());
        
        // Controle de abas do modal de cadastro
        this.setupCadastroTabs();
        
        // Controle de documentos dinâmicos baseado na natureza de operação
        document.getElementById('naturezaOperacaoCadastro')?.addEventListener('change', (e) => this.loadDocumentos(e.target.value));
        
        // Modal buttons
        document.getElementById('alterarStatus')?.addEventListener('click', () => this.alterarStatus());
        document.getElementById('descartarAlteracoes')?.addEventListener('click', () => this.descartarAlteracoes());
        document.getElementById('salvarProcesso')?.addEventListener('click', () => this.salvarProcesso());
        document.getElementById('solicitarFaturamento')?.addEventListener('click', () => this.solicitarFaturamento());
        document.getElementById('fichaLote')?.addEventListener('click', () => this.fichaLote());
    }
    
    // Dados simulados baseados na imagem
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
                    impedimentoCarga: 'nao',
                    receberGuias: 'nao',
                    emailGuias: '',
                    observacaoInterna: '',
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
                status: 'CANCELADO',
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
                    impedimentoCarga: 'nao',
                    receberGuias: 'nao',
                    emailGuias: '',
                    observacaoInterna: '',
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
                status: 'CARGA ENTREGUE',
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
                    impedimentoCarga: 'nao',
                    receberGuias: 'nao',
                    emailGuias: '',
                    observacaoInterna: '',
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
                id: 4,
                status: 'EM ABERTO',
                impoExpo: 'EXPORTACAO',
                pendencias: true,
                carga: '',
                requisicao: '213950',
                protocolo: '',
                criado: '24/08/2023 17:28',
                atualizado: '25/08/2023 09:41:02',
                referencia: '2023/065',
                cliente: 'PARNAPLAST INDUSTRIA DE PLASTICOS LTDA',
                despachante: 'AGILE ASSESSORIA ADUANEIRA LTDA',
                awb: '1054694625',
                hawb: '',
                di: '',
                dta: '',
                nfe: '',
                detalhes: {
                    despachante: '637-68038160959',
                    clienteCompleto: '04567890000145 - PARNAPLAST INDUSTRIA DE PLASTICOS LTDA',
                    naturezaOperacao: '05.03',
                    dataPontoZero: '2023-08-24',
                    referenciaCliente: '2023/065',
                    previsaoCarregamento: '2023-08-26',
                    observacao: '',
                    reexportacao: 'nao',
                    impedimentoCarga: 'nao',
                    receberGuias: 'nao',
                    emailGuias: '',
                    observacaoInterna: '',
                    regimeAduaneiro: 'exportacao_definitiva',
                    objetivoImportacao: 'industrial',
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
                id: 5,
                status: 'ENCERRADO',
                impoExpo: 'EXPORTACAO',
                pendencias: true,
                carga: '',
                requisicao: '203815',
                protocolo: '2023.2028.1080',
                criado: '18/07/2023 08:51',
                atualizado: '18/07/2023 13:04',
                referencia: 'CPO230501802',
                cliente: 'ROBERT BOSCH LTDA',
                despachante: 'ROGERIO KOLAKOWSKI',
                awb: '23529533733',
                hawb: 'CPO230501802',
                di: '',
                dta: '',
                nfe: '',
                detalhes: {
                    despachante: '637-68038160959',
                    clienteCompleto: '02345678000123 - ROBERT BOSCH LTDA',
                    naturezaOperacao: '05.03',
                    dataPontoZero: '2023-07-18',
                    referenciaCliente: 'CPO230501802',
                    previsaoCarregamento: '2023-07-19',
                    observacao: '',
                    reexportacao: 'nao',
                    impedimentoCarga: 'nao',
                    receberGuias: 'nao',
                    emailGuias: '',
                    observacaoInterna: '',
                    regimeAduaneiro: 'exportacao_definitiva',
                    objetivoImportacao: 'industrial',
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
                status: 'APROVADO',
                impoExpo: 'EXPORTACAO',
                pendencias: true,
                carga: '',
                requisicao: '203443',
                protocolo: '2023.1737.447',
                criado: '17/07/2023 12:03',
                atualizado: '19/07/2023 10:40',
                referencia: 'A531196',
                cliente: 'JGC IND COM MATERIAIS DENTARIOS SA',
                despachante: 'ROGERIO KOLAKOWSKI',
                awb: '54930242984',
                hawb: 'A531196',
                di: '',
                dta: '',
                nfe: '',
                detalhes: {
                    despachante: '637-68038160959',
                    clienteCompleto: '03456789000134 - JGC IND COM MATERIAIS DENTARIOS SA',
                    naturezaOperacao: '05.03',
                    dataPontoZero: '2023-07-17',
                    referenciaCliente: 'A531196',
                    previsaoCarregamento: '2023-07-20',
                    observacao: '',
                    reexportacao: 'nao',
                    impedimentoCarga: 'nao',
                    receberGuias: 'nao',
                    emailGuias: '',
                    observacaoInterna: '',
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
                id: 4,
                status: 'APROVADO',
                impoExpo: 'EXPORTACAO',
                pendencias: true,
                carga: '',
                requisicao: '203923',
                protocolo: '2023.2778.36',
                criado: '18/07/2023 11:00',
                atualizado: '19/07/2023 10:41',
                referencia: 'A512141',
                cliente: 'AMCOR FLEXIBLES DO BRASIL INDUSTRIA E COMERCIO DE EMBALAGENS LTDA',
                despachante: 'ROGERIO KOLAKOWSKI',
                awb: '54930334872',
                hawb: 'A512141',
                di: '',
                dta: '',
                nfe: '',
                detalhes: {
                    despachante: '637-68038160959',
                    clienteCompleto: '04567890000145 - AMCOR FLEXIBLES DO BRASIL INDUSTRIA E COMERCIO DE EMBALAGENS LTDA',
                    naturezaOperacao: '05.03',
                    dataPontoZero: '2023-07-18',
                    referenciaCliente: 'A512141',
                    previsaoCarregamento: '2023-07-21',
                    observacao: '',
                    reexportacao: 'nao',
                    impedimentoCarga: 'nao',
                    receberGuias: 'nao',
                    emailGuias: '',
                    observacaoInterna: '',
                    regimeAduaneiro: 'exportacao_definitiva',
                    objetivoImportacao: 'industrial',
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
                id: 5,
                status: 'APROVADO',
                impoExpo: 'EXPORTACAO',
                pendencias: true,
                carga: '',
                requisicao: '203820',
                protocolo: '2023.3088.60',
                criado: '18/07/2023 08:54',
                atualizado: '19/07/2023 10:41',
                referencia: 'CWB0013443',
                cliente: 'AMERICAN GLASS PRODUCTS DO BRASIL LTDA',
                despachante: 'ROGERIO KOLAKOWSKI',
                awb: '23528432596',
                hawb: 'CWB0013443',
                di: '',
                dta: '',
                nfe: '',
                detalhes: {
                    despachante: '637-68038160959',
                    clienteCompleto: '05678901000156 - AMERICAN GLASS PRODUCTS DO BRASIL LTDA',
                    naturezaOperacao: '05.03',
                    dataPontoZero: '2023-07-18',
                    referenciaCliente: 'CWB0013443',
                    previsaoCarregamento: '2023-07-22',
                    observacao: '',
                    reexportacao: 'nao',
                    impedimentoCarga: 'nao',
                    receberGuias: 'nao',
                    emailGuias: '',
                    observacaoInterna: '',
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
                id: 6,
                status: 'PENDENCIA DOCUMENTAL',
                impoExpo: 'EXPORTACAO',
                pendencias: true,
                carga: '',
                requisicao: '220390',
                protocolo: '',
                criado: '18/09/2023 16:19',
                atualizado: '18/09/2023 16:46:25',
                referencia: '',
                cliente: 'RENAULT',
                despachante: 'EVARISTO AFONSO DE CASTRO NETO',
                awb: '72948660673',
                hawb: '1054944630',
                di: '',
                dta: '',
                nfe: '',
                detalhes: {
                    despachante: '637-68038160959',
                    clienteCompleto: '06789012000167 - RENAULT',
                    naturezaOperacao: '05.03',
                    dataPontoZero: '2023-09-18',
                    referenciaCliente: '',
                    previsaoCarregamento: '2023-09-20',
                    observacao: '',
                    reexportacao: 'nao',
                    impedimentoCarga: 'nao',
                    receberGuias: 'nao',
                    emailGuias: '',
                    observacaoInterna: '',
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
            default:
                statusIcon = '<i class="fas fa-question-circle text-muted"></i>';
                statusClass = 'text-muted';
        }
        
        const pendenciasIcon = processo.pendencias ? '<i class="fas fa-exclamation-triangle text-warning"></i>' : '';
        
        return `
            <tr class="processo-row">
                <td>
                    ${statusIcon}
                    <span class="ms-1 small">${processo.status}</span>
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
                <td>
                    <div class="d-flex flex-column gap-1 align-items-center py-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="processosManager.editProcesso(${processo.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="processosManager.viewProcesso(${processo.id})" title="Visualizar">
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
                <a class="page-link" href="#" onclick="processosManager.goToPage(${this.currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;
        
        // Páginas
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="processosManager.goToPage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }
        
        // Botão próximo
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="processosManager.goToPage(${this.currentPage + 1})">
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
    
    showCadastroModal() {
        alert('Funcionalidade de cadastro será implementada em breve.');
    }
    
    editProcesso(id) {
        this.viewProcesso(id, true);
    }
    
    viewProcesso(id, editable = false) {
        const processo = this.processos.find(p => p.id === id);
        if (!processo) return;
        
        this.currentProcesso = processo;
        this.populateModal(processo, editable);
        
        const modal = new bootstrap.Modal(document.getElementById('processoModal'));
        modal.show();
    }
    
    populateModal(processo, editable = false) {
        // Atualizar título do modal
        document.getElementById('processoProtocolo').textContent = processo.protocolo;
        
        // Popular campos básicos
        document.getElementById('despachante').value = processo.detalhes.despachante;
        document.getElementById('cliente').value = processo.detalhes.clienteCompleto;
        document.getElementById('naturezaOperacao').value = processo.detalhes.naturezaOperacao;
        document.getElementById('dataPontoZero').value = processo.detalhes.dataPontoZero;
        document.getElementById('referenciaCliente').value = processo.detalhes.referenciaCliente;
        document.getElementById('previsaoCarregamento').value = processo.detalhes.previsaoCarregamento;
        document.getElementById('observacao').value = processo.detalhes.observacao;
        document.getElementById('reexportacao').value = processo.detalhes.reexportacao;
        document.getElementById('impedimentoCarga').value = processo.detalhes.impedimentoCarga;
        document.getElementById('receberGuias').value = processo.detalhes.receberGuias;
        document.getElementById('emailGuias').value = processo.detalhes.emailGuias;
        document.getElementById('observacaoInterna').value = processo.detalhes.observacaoInterna;
        
        // Popular campos da carga
        document.getElementById('regimeAduaneiro').value = processo.detalhes.regimeAduaneiro;
        document.getElementById('objetivoImportacao').value = processo.detalhes.objetivoImportacao;
        document.getElementById('tipoCarga').value = processo.detalhes.tipoCarga;
        document.getElementById('imoDgr').value = processo.detalhes.imoDgr;
        document.getElementById('volume').value = processo.detalhes.volume;
        document.getElementById('pesoBruto').value = processo.detalhes.pesoBruto;
        document.getElementById('valorCif').value = processo.detalhes.valorCif;
        document.getElementById('valorFrete').value = processo.detalhes.valorFrete;
        document.getElementById('valorSeguro').value = processo.detalhes.valorSeguro;
        document.getElementById('valorFob').value = processo.detalhes.valorFob;
        document.getElementById('moedaFrete').value = processo.detalhes.moedaFrete;
        document.getElementById('moedaSeguro').value = processo.detalhes.moedaSeguro;
        document.getElementById('moedaFob').value = processo.detalhes.moedaFob;
        document.getElementById('embalagemMadeira').value = processo.detalhes.embalagemMadeira;
        document.getElementById('controleTemperatura').value = processo.detalhes.controleTemperatura;
        
        // Configurar campos como readonly se não for editável
        const formElements = document.querySelectorAll('#processoModal input, #processoModal select, #processoModal textarea');
        formElements.forEach(element => {
            if (!editable) {
                element.setAttribute('readonly', true);
                element.setAttribute('disabled', true);
            } else {
                element.removeAttribute('readonly');
                element.removeAttribute('disabled');
            }
        });
        
        // Alguns campos sempre ficam readonly
        document.getElementById('despachante').setAttribute('readonly', true);
        document.getElementById('cliente').setAttribute('readonly', true);
    }
    
    
    // Funções do modal
    alterarStatus() {
        alert('Funcionalidade de alterar status será implementada em breve.');
    }
    
    descartarAlteracoes() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('processoModal'));
        modal.hide();
    }
    
    salvarProcesso() {
        if (!this.currentProcesso) return;
        
        // Coletar dados do formulário
        const formData = {
            naturezaOperacao: document.getElementById('naturezaOperacao').value,
            dataPontoZero: document.getElementById('dataPontoZero').value,
            referenciaCliente: document.getElementById('referenciaCliente').value,
            previsaoCarregamento: document.getElementById('previsaoCarregamento').value,
            observacao: document.getElementById('observacao').value,
            reexportacao: document.getElementById('reexportacao').value,
            impedimentoCarga: document.getElementById('impedimentoCarga').value,
            receberGuias: document.getElementById('receberGuias').value,
            emailGuias: document.getElementById('emailGuias').value,
            observacaoInterna: document.getElementById('observacaoInterna').value,
            // Dados da carga
            regimeAduaneiro: document.getElementById('regimeAduaneiro').value,
            objetivoImportacao: document.getElementById('objetivoImportacao').value,
            tipoCarga: document.getElementById('tipoCarga').value,
            imoDgr: document.getElementById('imoDgr').value,
            volume: parseFloat(document.getElementById('volume').value),
            pesoBruto: parseFloat(document.getElementById('pesoBruto').value),
            valorCif: parseFloat(document.getElementById('valorCif').value),
            valorFrete: parseFloat(document.getElementById('valorFrete').value),
            valorSeguro: parseFloat(document.getElementById('valorSeguro').value),
            valorFob: parseFloat(document.getElementById('valorFob').value),
            moedaFrete: document.getElementById('moedaFrete').value,
            moedaSeguro: document.getElementById('moedaSeguro').value,
            moedaFob: document.getElementById('moedaFob').value,
            embalagemMadeira: document.getElementById('embalagemMadeira').value,
            controleTemperatura: document.getElementById('controleTemperatura').value
        };
        
        // Atualizar processo
        Object.assign(this.currentProcesso.detalhes, formData);
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('processoModal'));
        modal.hide();
        
        // Atualizar tabela
        this.renderTable();
        
        alert('Processo salvo com sucesso!');
    }
    
    solicitarFaturamento() {
        alert('Solicitação de faturamento enviada com sucesso!');
    }
    
    fichaLote() {
        alert('Funcionalidade de ficha lote será implementada em breve.');
    }
    
    // ======================
    // Modal de Cadastro de Processo
    // ======================
    
    redirectToCadastro() {
        // Redirecionar para a página de cadastro de processo
        window.location.href = '/web-clientes/processos/cadastro';
    }

    showCadastroModal() {
        const modal = new bootstrap.Modal(document.getElementById('cadastroProcessoModal'));
        modal.show();
        this.resetCadastroForm();
    }
    
    setupCadastroTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked button and corresponding pane
                button.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');
            });
        });
    }
    
    resetCadastroForm() {
        // Reset all form fields
        const form = document.getElementById('cadastroProcessoForm');
        if (form) {
            form.reset();
        }
        
        const cargaForm = document.getElementById('cargaForm');
        if (cargaForm) {
            cargaForm.reset();
        }
        
        // Reset to first tab
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        document.querySelector('[data-tab="processo"]').classList.add('active');
        document.getElementById('processo-tab').classList.add('active');
        
        // Reset documentos
        this.resetDocumentoDetails();
        document.getElementById('documentosLista').style.display = 'none';
    }
    
    descartarAlteracoesCadastro() {
        if (confirm('Tem certeza que deseja descartar todas as alterações?')) {
            this.resetCadastroForm();
            const modal = bootstrap.Modal.getInstance(document.getElementById('cadastroProcessoModal'));
            modal.hide();
        }
    }
    
    salvarProcessoCadastro() {
        // Validar formulário
        if (!this.validateCadastroForm()) {
            return;
        }
        
        // Coletar dados do formulário
        const formData = this.collectCadastroFormData();
        
        console.log('Dados do processo:', formData);
        
        // Simular salvamento
        this.showNotification('Processo cadastrado com sucesso!', 'success');
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('cadastroProcessoModal'));
        modal.hide();
        
        // Recarregar lista de processos
        this.loadProcessos();
    }
    
    validateCadastroForm() {
        const requiredFields = [
            'despachanteCadastro',
            'clienteCadastro', 
            'naturezaOperacaoCadastro',
            'tabelaAplicada',
            'receberGuiasCadastro'
        ];
        
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
            // Detalhes
            despachante: document.getElementById('despachanteCadastro')?.value || '',
            cliente: document.getElementById('clienteCadastro')?.value || '',
            naturezaOperacao: document.getElementById('naturezaOperacaoCadastro')?.value || '',
            tabelaAplicada: document.getElementById('tabelaAplicada')?.value || '',
            dataPontoZero: document.getElementById('dataPontoZeroCadastro')?.value || '',
            referenciaCliente: document.getElementById('referenciaClienteCadastro')?.value || '',
            previsaoCarregamento: document.getElementById('previsaoCarregamentoCadastro')?.value || '',
            observacao: document.getElementById('observacaoCadastro')?.value || '',
            reexportacao: document.getElementById('reexportacaoCadastro')?.value || '',
            receberGuias: document.getElementById('receberGuiasCadastro')?.value || '',
            emailGuias: document.getElementById('emailGuiasCadastro')?.value || '',
            impedimentoCarga: document.getElementById('impedimentoCargaCadastro')?.value || '',
            statusFaturamento: document.getElementById('statusFaturamentoCadastro')?.value || '',
            observacaoInterna: document.getElementById('observacaoInternaCadastro')?.value || '',
            
            // Carga
            regimeAduaneiro: document.getElementById('regimeAduaneiroCadastro')?.value || '',
            objetivoImportacao: document.getElementById('objetivoImportacaoCadastro')?.value || '',
            tipoCarga: document.getElementById('tipoCargaCadastro')?.value || '',
            imoDgr: document.getElementById('imoDgrCadastro')?.value || '',
            volume: document.getElementById('volumeCadastro')?.value || '',
            pesoBruto: document.getElementById('pesoBrutoCadastro')?.value || '',
            valorCif: document.getElementById('valorCifCadastro')?.value || '',
            valorFrete: document.getElementById('valorFreteCadastro')?.value || '',
            valorSeguro: document.getElementById('valorSeguroCadastro')?.value || '',
            valorFob: document.getElementById('valorFobCadastro')?.value || '',
            moedaFrete: document.getElementById('moedaFreteCadastro')?.value || '',
            moedaSeguro: document.getElementById('moedaSeguroCadastro')?.value || '',
            moedaFob: document.getElementById('moedaFobCadastro')?.value || '',
            embalagemMadeira: document.getElementById('embalagemMadeiraCadastro')?.value || '',
            controleTemperatura: document.getElementById('controleTemperaturaCadastro')?.value || ''
        };
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
    
    // Método para carregar documentos baseado na natureza de operação
    loadDocumentos(naturezaOperacao) {
        const documentosContainer = document.getElementById('documentosLista');
        const documentosList = document.getElementById('documentosList');
        const documentosDetails = document.getElementById('documentosDetails');
        
        if (!naturezaOperacao) {
            documentosContainer.style.display = 'none';
            return;
        }
        
        const documentos = this.documentosPorNatureza[naturezaOperacao];
        if (!documentos) {
            documentosContainer.style.display = 'none';
            return;
        }
        
        // Limpar lista atual
        documentosList.innerHTML = '';
        
        // Adicionar documentos obrigatórios
        documentos.obrigatorios.forEach(doc => {
            const docElement = this.createDocumentoElement(doc, true);
            documentosList.appendChild(docElement);
        });
        
        // Adicionar documentos opcionais
        documentos.opcionais.forEach(doc => {
            const docElement = this.createDocumentoElement(doc, false);
            documentosList.appendChild(docElement);
        });
        
        // Resetar detalhes
        this.resetDocumentoDetails();
        
        // Mostrar container
        documentosContainer.style.display = 'block';
    }
    
    // Método para criar elemento de documento
    createDocumentoElement(nome, obrigatorio) {
        const docElement = document.createElement('div');
        docElement.className = `documento-item ${obrigatorio ? 'obrigatorio' : ''}`;
        docElement.dataset.documento = nome;
        
        const icon = document.createElement('i');
        icon.className = `documento-icon fas ${obrigatorio ? 'fa-exclamation-triangle' : 'fa-file-alt'}`;
        
        const nomeElement = document.createElement('span');
        nomeElement.className = 'documento-nome';
        nomeElement.textContent = nome;
        
        docElement.appendChild(icon);
        docElement.appendChild(nomeElement);
        
        // Adicionar evento de clique
        docElement.addEventListener('click', () => {
            this.selectDocumento(docElement, nome, obrigatorio);
        });
        
        return docElement;
    }
    
    // Método para selecionar documento e mostrar detalhes
    selectDocumento(element, nome, obrigatorio) {
        // Remover seleção anterior
        document.querySelectorAll('.documento-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Selecionar documento atual
        element.classList.add('active');
        
        // Mostrar detalhes do documento
        this.showDocumentoDetails(nome, obrigatorio);
    }
    
    // Método para mostrar detalhes do documento
    showDocumentoDetails(nome, obrigatorio) {
        const documentosDetails = document.getElementById('documentosDetails');
        
        // Limpar conteúdo anterior
        documentosDetails.innerHTML = '';
        
        // Criar conteúdo dos detalhes
        const detailsContent = document.createElement('div');
        detailsContent.className = 'documento-details-content active';
        
        // Criar campos específicos baseados no tipo de documento
        const fields = this.getDocumentoFields(nome);
        const fieldsHtml = fields.map(field => `
            <div class="documento-field">
                <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
                <input type="${field.type}" 
                       id="${field.id}" 
                       placeholder="${field.placeholder}"
                       ${field.required ? 'required' : ''}>
            </div>
        `).join('');
        
        detailsContent.innerHTML = `
            <div class="documento-fields">
                ${fieldsHtml}
            </div>
            <div class="documento-upload" id="upload-${nome.replace(/[^a-zA-Z0-9]/g, '')}">
                <button type="button" class="upload-button" onclick="document.getElementById('file-${nome.replace(/[^a-zA-Z0-9]/g, '')}').click()">
                    Escolher Arquivo
                </button>
                <input type="file" id="file-${nome.replace(/[^a-zA-Z0-9]/g, '')}" style="display: none;" onchange="this.parentElement.querySelector('.upload-status').textContent = this.files[0] ? this.files[0].name : 'Nenhum arquivo escolhido'">
                <div class="upload-status">Nenhum arquivo escolhido</div>
                ${obrigatorio ? '<div class="upload-required">* anexo obrigatório</div>' : ''}
            </div>
        `;
        
        documentosDetails.appendChild(detailsContent);
    }
    
    // Método para obter campos específicos de cada documento
    getDocumentoFields(nome) {
        const fieldsMap = {
            'AIR WAY BILL / HAWB': [
                { id: 'numeroAWB', label: 'NUMERO AWB', placeholder: 'NUMERO AWB', type: 'text', required: true },
                { id: 'numeroHAWB', label: 'NUMERO HAWB', placeholder: 'NUMERO HAWB', type: 'text', required: false }
            ],
            'DI/DUIMP': [
                { id: 'numeroDI', label: 'NUMERO DI', placeholder: 'NUMERO DI', type: 'text', required: true },
                { id: 'numeroDUIMP', label: 'NUMERO DUIMP', placeholder: 'NUMERO DUIMP', type: 'text', required: false }
            ],
            'DSI/DUIMP': [
                { id: 'numeroDSI', label: 'NUMERO DSI', placeholder: 'NUMERO DSI', type: 'text', required: true },
                { id: 'numeroDUIMP', label: 'NUMERO DUIMP', placeholder: 'NUMERO DUIMP', type: 'text', required: false }
            ],
            'EXTRATO ICMS': [
                { id: 'numeroExtrato', label: 'NUMERO EXTRATO', placeholder: 'NUMERO EXTRATO', type: 'text', required: true }
            ],
            'EXTRATO DE TRANSITO': [
                { id: 'numeroExtratoTransito', label: 'NUMERO EXTRATO', placeholder: 'NUMERO EXTRATO', type: 'text', required: true }
            ],
            'NFE': [
                { id: 'numeroNFE', label: 'NUMERO NFE', placeholder: 'NUMERO NFE', type: 'text', required: true }
            ],
            'AUT. CARREGAMENTO': [
                { id: 'numeroAutorizacao', label: 'NUMERO AUTORIZAÇÃO', placeholder: 'NUMERO AUTORIZAÇÃO', type: 'text', required: true }
            ],
            'CONHECIMENTO DE EMBARQUE': [
                { id: 'numeroConhecimento', label: 'NUMERO CONHECIMENTO', placeholder: 'NUMERO CONHECIMENTO', type: 'text', required: true }
            ],
            'CONHECIMENTO DE FRETE': [
                { id: 'numeroConhecimentoFrete', label: 'NUMERO CONHECIMENTO', placeholder: 'NUMERO CONHECIMENTO', type: 'text', required: true }
            ],
            'DUE': [
                { id: 'numeroDUE', label: 'NUMERO DUE', placeholder: 'NUMERO DUE', type: 'text', required: true }
            ],
            'LPCO': [
                { id: 'numeroLPCO', label: 'NUMERO LPCO', placeholder: 'NUMERO LPCO', type: 'text', required: false }
            ],
            'OUTROS DOCUMENTOS': [
                { id: 'descricaoOutros', label: 'DESCRIÇÃO', placeholder: 'Descreva o documento', type: 'text', required: false }
            ],
            'FICHAS DE SERVICO': [
                { id: 'numeroFicha', label: 'NUMERO FICHA', placeholder: 'NUMERO FICHA', type: 'text', required: false }
            ]
        };
        
        return fieldsMap[nome] || [
            { id: 'numeroDocumento', label: 'NUMERO', placeholder: 'NUMERO', type: 'text', required: true }
        ];
    }
    
    // Método para resetar detalhes do documento
    resetDocumentoDetails() {
        const documentosDetails = document.getElementById('documentosDetails');
        documentosDetails.innerHTML = `
            <div class="documento-placeholder">
                <i class="fas fa-file-alt fa-3x text-muted mb-3"></i>
                <h6 class="text-muted">Selecione um documento para visualizar os detalhes</h6>
            </div>
        `;
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
    
    // Limpar filtros no processosManager
    if (window.processosManager) {
        window.processosManager.clearFilters();
    }
}


function refreshTable() {
    if (window.processosManager) {
        window.processosManager.loadProcessos();
    }
}

function fecharCadastroProcesso() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('cadastroProcessoModal'));
    if (modal) {
        modal.hide();
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.processosManager = new ProcessosManager();
});
