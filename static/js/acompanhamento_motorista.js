// JavaScript para a tela de Acompanhamento Motorista - Web Cliente
// Verificar se a classe já existe para evitar redeclaração
if (typeof MotoristaManager === 'undefined') {
    class MotoristaManager {
        constructor() {
            this.currentPage = 1;
            this.itemsPerPage = 10;
            this.totalItems = 0;
            this.filters = {};
            this.motoristas = [];
            
            this.init();
        }
        
        init() {
            this.setupEventListeners();
            this.loadMotoristas();
        }
        
        setupEventListeners() {
            // Filtros
            document.getElementById('clearFilters')?.addEventListener('click', () => this.clearFilters());
            document.getElementById('clearFiltersEmpty')?.addEventListener('click', () => this.clearFilters());
            document.getElementById('itemsPorPagina')?.addEventListener('change', (e) => this.changeItemsPerPage(e.target.value));
            
            // Busca
            document.getElementById('searchBtn')?.addEventListener('click', () => this.performSearch());
            document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.performSearch();
            });
            
            // Botões de ação
        }
        
        // Dados simulados baseados na imagem
        generateMockData() {
            return [
                {
                    id: 1,
                    impoExpo: 'IMPORTACAO',
                    requisicao: '403677',
                    protocolo: '2025.678.435',
                    criadoEm: '24/09/2025 09:16',
                    ultimaAtualizacao: '24/09/2025 17:59:33',
                    di: '2521287830',
                    dta: '',
                    status: 'APROVADO',
                    motorista: {
                        nome: 'João Silva',
                        cnh: '12345678901',
                        cpf: '123.456.789-00'
                    },
                    transportadora: {
                        nome: 'TRANSPORTADORA EXEMPLO LTDA',
                        cnpj: '12.345.678/0001-90'
                    }
                },
                {
                    id: 2,
                    impoExpo: 'IMPORTACAO',
                    requisicao: '403365',
                    protocolo: '2025.104.387',
                    criadoEm: '23/09/2025 10:58',
                    ultimaAtualizacao: '24/09/2025 17:58:44',
                    di: '2521195013',
                    dta: '',
                    status: 'APROVADO',
                    motorista: {
                        nome: 'Maria Santos',
                        cnh: '98765432109',
                        cpf: '987.654.321-00'
                    },
                    transportadora: {
                        nome: 'LOGÍSTICA BRASIL LTDA',
                        cnpj: '98.765.432/0001-10'
                    }
                },
                {
                    id: 3,
                    impoExpo: 'IMPORTACAO',
                    requisicao: '403690',
                    protocolo: '2025.3996.24',
                    criadoEm: '24/09/2025 09:30',
                    ultimaAtualizacao: '24/09/2025 17:54:22',
                    di: '2521266620',
                    dta: '',
                    status: 'APROVADO',
                    motorista: {
                        nome: 'Carlos Oliveira',
                        cnh: '11223344556',
                        cpf: '111.222.333-44'
                    },
                    transportadora: {
                        nome: 'FRETE RÁPIDO S.A.',
                        cnpj: '11.222.333/0001-44'
                    }
                },
                {
                    id: 4,
                    impoExpo: 'EXPORTACAO',
                    requisicao: '403891',
                    protocolo: '2025.1234.567',
                    criadoEm: '25/09/2025 08:15',
                    ultimaAtualizacao: '25/09/2025 16:30:15',
                    di: '',
                    dta: 'DTA-2025-001',
                    status: 'APROVADO',
                    motorista: {
                        nome: 'Ana Costa',
                        cnh: '55667788990',
                        cpf: '555.666.777-88'
                    },
                    transportadora: {
                        nome: 'EXPORT LOGISTICS LTDA',
                        cnpj: '55.666.777/0001-88'
                    }
                },
                {
                    id: 5,
                    impoExpo: 'IMPORTACAO',
                    requisicao: '403456',
                    protocolo: '2025.2345.678',
                    criadoEm: '25/09/2025 11:45',
                    ultimaAtualizacao: '25/09/2025 18:20:30',
                    di: '2521300123',
                    dta: '',
                    status: 'APROVADO',
                    motorista: {
                        nome: 'Roberto Lima',
                        cnh: '99887766554',
                        cpf: '999.888.777-66'
                    },
                    transportadora: {
                        nome: 'CARGA PESADA LTDA',
                        cnpj: '99.888.777/0001-66'
                    }
                },
                {
                    id: 6,
                    impoExpo: 'IMPORTACAO',
                    requisicao: '403789',
                    protocolo: '2025.3456.789',
                    criadoEm: '26/09/2025 07:20',
                    ultimaAtualizacao: '26/09/2025 15:45:12',
                    di: '2521311456',
                    dta: '',
                    status: 'APROVADO',
                    motorista: {
                        nome: 'Fernanda Alves',
                        cnh: '44332211009',
                        cpf: '444.333.222-11'
                    },
                    transportadora: {
                        nome: 'TRANSPORTE SEGURO S.A.',
                        cnpj: '44.333.222/0001-11'
                    }
                }
            ];
        }
        
        loadMotoristas() {
            // Simular carregamento de dados
            this.motoristas = this.generateMockData();
            this.totalItems = this.motoristas.length;
            this.renderTable();
            this.renderPagination();
        }
        
        renderTable() {
            const tbody = document.getElementById('motoristaTableBody');
            const emptyState = document.getElementById('emptyState');
            
            if (!tbody) return;
            
            const filteredMotoristas = this.getFilteredMotoristas();
            
            if (filteredMotoristas.length === 0) {
                tbody.innerHTML = '';
                emptyState?.classList.remove('d-none');
                return;
            }
            
            emptyState?.classList.add('d-none');
            
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            const pageMotoristas = filteredMotoristas.slice(startIndex, endIndex);
            
            tbody.innerHTML = pageMotoristas.map(motorista => this.renderMotoristaRow(motorista)).join('');
        }
        
        renderMotoristaRow(motorista) {
            return `
                <tr class="motorista-row">
                    <td class="text-center">
                        <span class="fw-bold">${motorista.impoExpo}</span>
                    </td>
                    <td class="text-center fw-bold">${motorista.requisicao}</td>
                    <td class="text-center small">${motorista.protocolo}</td>
                    <td class="text-center small">${motorista.criadoEm}</td>
                    <td class="text-center small">${motorista.ultimaAtualizacao}</td>
                    <td class="text-center fw-bold">${motorista.di || '-'}</td>
                    <td class="text-center fw-bold">${motorista.dta || '-'}</td>
                </tr>
            `;
        }
        
        getFilteredMotoristas() {
            let filtered = [...this.motoristas];
            
            // Aplicar apenas filtro de busca
            if (this.filters.search) {
                const searchTerm = this.filters.search.toLowerCase();
                filtered = filtered.filter(m => 
                    m.requisicao.includes(searchTerm) ||
                    m.protocolo.includes(searchTerm) ||
                    m.di.includes(searchTerm) ||
                    m.dta.includes(searchTerm) ||
                    m.motorista.nome.toLowerCase().includes(searchTerm) ||
                    m.transportadora.nome.toLowerCase().includes(searchTerm)
                );
            }
            
            return filtered;
        }
        
        renderPagination() {
            const pagination = document.getElementById('pagination');
            if (!pagination) return;
            
            const filteredCount = this.getFilteredMotoristas().length;
            const totalPages = Math.ceil(filteredCount / this.itemsPerPage);
            
            if (totalPages <= 1) {
                pagination.innerHTML = '';
                return;
            }
            
            let paginationHTML = '';
            
            // Botão anterior
            paginationHTML += `
                <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="motoristaManager.goToPage(${this.currentPage - 1})">
                        <i class="fas fa-chevron-left"></i>
                    </a>
                </li>
            `;
            
            // Páginas
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                    paginationHTML += `
                        <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                            <a class="page-link" href="#" onclick="motoristaManager.goToPage(${i})">${i}</a>
                        </li>
                    `;
                } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                    paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
                }
            }
            
            // Botão próximo
            paginationHTML += `
                <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="motoristaManager.goToPage(${this.currentPage + 1})">
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
            `;
            
            pagination.innerHTML = paginationHTML;
        }
        
        goToPage(page) {
            const filteredCount = this.getFilteredMotoristas().length;
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
            document.getElementById('itemsPorPagina').value = '10';
            
            this.itemsPerPage = 10;
            this.renderTable();
            this.renderPagination();
        }
        
    }
    
    // Funções globais (dentro do bloco if)
    function refreshTable() {
        if (window.motoristaManager) {
            window.motoristaManager.loadMotoristas();
        }
    }
    
    // Inicializar quando o DOM estiver carregado
    document.addEventListener('DOMContentLoaded', function() {
        // Verificar se já existe uma instância para evitar duplicação
        if (!window.motoristaManager) {
            window.motoristaManager = new MotoristaManager();
        }
    });
}
