// JavaScript para a tela de DAPE sem Carga - Web Cliente

// Verificar se a classe já existe para evitar redeclaração
if (typeof DapeSemCargaManager === 'undefined') {
    class DapeSemCargaManager {
        constructor() {
            this.currentPagePendente = 1;
            this.currentPageFaturado = 1;
            this.itemsPerPagePendente = 10;
            this.itemsPerPageFaturado = 10;
            this.totalItemsPendente = 0;
            this.totalItemsFaturado = 0;
            this.filtersPendente = {};
            this.filtersFaturado = {};
            this.dapesPendente = [];
            this.dapesFaturado = [];
            
            this.init();
        }
    
        init() {
            this.setupEventListeners();
            this.loadDapesPendente();
            this.loadDapesFaturado();
        }
    
        setupEventListeners() {
            // Event listeners para DAPEs Pendente
            document.getElementById('itemsPerPagePendente')?.addEventListener('change', (e) => this.changeItemsPerPagePendente(e.target.value));
            document.getElementById('searchBtnPendente')?.addEventListener('click', () => this.performSearchPendente());
            document.getElementById('searchPendente')?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.performSearchPendente();
            });
            document.getElementById('prevPagePendente')?.addEventListener('click', () => this.goToPagePendente(this.currentPagePendente - 1));
            document.getElementById('nextPagePendente')?.addEventListener('click', () => this.goToPagePendente(this.currentPagePendente + 1));
            
            // Event listeners para DAPEs Faturados
            document.getElementById('itemsPerPageFaturado')?.addEventListener('change', (e) => this.changeItemsPerPageFaturado(e.target.value));
            document.getElementById('searchBtnFaturado')?.addEventListener('click', () => this.performSearchFaturado());
            document.getElementById('searchFaturado')?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.performSearchFaturado();
            });
            document.getElementById('prevPageFaturado')?.addEventListener('click', () => this.goToPageFaturado(this.currentPageFaturado - 1));
            document.getElementById('nextPageFaturado')?.addEventListener('click', () => this.goToPageFaturado(this.currentPageFaturado + 1));
        }
        
        // Dados simulados para DAPEs Pendente Faturamento
        generateMockDataPendente() {
            return [
                {
                    id: 1,
                    numero: 763984,
                    entidade: 'CARGOLUX AIRLINES INTERNATIONAL S/A',
                    servico: 'Homem-Hora',
                    quantidade: '',
                    data: '04/10/2025',
                    dataFinal: '04/10/2025'
                },
                {
                    id: 2,
                    numero: 763983,
                    entidade: 'CARGOLUX AIRLINES INTERNATIONAL S/A',
                    servico: 'Despaletização de carga (ULDs)',
                    quantidade: '',
                    data: '04/10/2025',
                    dataFinal: '04/10/2025'
                }
            ];
        }
        
        // Dados simulados para DAPEs Faturados
        generateMockDataFaturado() {
            return [
                {
                    id: 1,
                    numero: 463820,
                    cnpj: '09296295000160',
                    entidade: 'AZUL LINHAS AÉREAS BRASILEIRAS S.A',
                    guia: '0000000463820',
                    status: 'Correntista com Entrega'
                },
                {
                    id: 2,
                    numero: 463557,
                    cnpj: '07575651000582',
                    entidade: 'GOL LINHAS AEREAS S.A.',
                    guia: '0000000463557',
                    status: 'Correntista com Entrega'
                },
                {
                    id: 3,
                    numero: 463333,
                    cnpj: '00074635000133',
                    entidade: 'ABSA AEROLINHAS BRASILEIRAS S.A.',
                    guia: '0000000463333',
                    status: 'Correntista com Entrega'
                },
                {
                    id: 4,
                    numero: 463332,
                    cnpj: '00074635000133',
                    entidade: 'ABSA AEROLINHAS BRASILEIRAS S.A.',
                    guia: '0000000463332',
                    status: 'Correntista com Entrega'
                },
                {
                    id: 5,
                    numero: 463331,
                    cnpj: '00074635000133',
                    entidade: 'ABSA AEROLINHAS BRASILEIRAS S.A.',
                    guia: '0000000463331',
                    status: 'Correntista com Entrega'
                }
            ];
        }
        
        loadDapesPendente() {
            this.dapesPendente = this.generateMockDataPendente();
            this.totalItemsPendente = this.dapesPendente.length;
            this.renderTablePendente();
            this.updatePaginationInfoPendente();
        }
        
        loadDapesFaturado() {
            this.dapesFaturado = this.generateMockDataFaturado();
            this.totalItemsFaturado = this.dapesFaturado.length;
            this.renderTableFaturado();
            this.updatePaginationInfoFaturado();
        }
        
        renderTablePendente() {
            const tbody = document.getElementById('dapesPendenteTableBody');
            if (!tbody) return;
            
            const filteredDapes = this.getFilteredDapesPendente();
            const startIndex = (this.currentPagePendente - 1) * this.itemsPerPagePendente;
            const endIndex = startIndex + this.itemsPerPagePendente;
            const pageDapes = filteredDapes.slice(startIndex, endIndex);
            
            tbody.innerHTML = pageDapes.map(dape => this.renderDapePendenteRow(dape)).join('');
        }
        
        renderTableFaturado() {
            const tbody = document.getElementById('dapesFaturadoTableBody');
            if (!tbody) return;
            
            const filteredDapes = this.getFilteredDapesFaturado();
            const startIndex = (this.currentPageFaturado - 1) * this.itemsPerPageFaturado;
            const endIndex = startIndex + this.itemsPerPageFaturado;
            const pageDapes = filteredDapes.slice(startIndex, endIndex);
            
            tbody.innerHTML = pageDapes.map(dape => this.renderDapeFaturadoRow(dape)).join('');
        }
        
        renderDapePendenteRow(dape) {
            return `
                <tr class="processo-row">
                    <td>${dape.numero}</td>
                    <td>${dape.entidade}</td>
                    <td>${dape.servico}</td>
                    <td>${dape.quantidade}</td>
                    <td>${dape.data}</td>
                    <td>${dape.dataFinal}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-info" onclick="dapeManager.viewDapePendente(${dape.id})" title="Visualizar">
                            <i class="fas fa-search"></i>
                        </button>
                    </td>
                </tr>
            `;
        }
        
        renderDapeFaturadoRow(dape) {
            return `
                <tr class="processo-row">
                    <td>${dape.numero}</td>
                    <td>${dape.cnpj}</td>
                    <td>${dape.entidade}</td>
                    <td>${dape.guia}</td>
                    <td>${dape.status}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="dapeManager.printDapeFaturado(${dape.id})" title="Imprimir">
                            <i class="fas fa-print"></i>
                        </button>
                    </td>
                </tr>
            `;
        }
        
        getFilteredDapesPendente() {
            let filtered = [...this.dapesPendente];
            
            if (this.filtersPendente.search) {
                const searchTerm = this.filtersPendente.search.toLowerCase();
                filtered = filtered.filter(d => 
                    d.entidade.toLowerCase().includes(searchTerm) ||
                    d.servico.toLowerCase().includes(searchTerm) ||
                    d.numero.toString().includes(searchTerm)
                );
            }
            
            return filtered;
        }
        
        getFilteredDapesFaturado() {
            let filtered = [...this.dapesFaturado];
            
            if (this.filtersFaturado.search) {
                const searchTerm = this.filtersFaturado.search.toLowerCase();
                filtered = filtered.filter(d => 
                    d.entidade.toLowerCase().includes(searchTerm) ||
                    d.cnpj.includes(searchTerm) ||
                    d.guia.includes(searchTerm) ||
                    d.status.toLowerCase().includes(searchTerm) ||
                    d.numero.toString().includes(searchTerm)
                );
            }
            
            return filtered;
        }
        
        // Métodos para DAPEs Pendente
        changeItemsPerPagePendente(value) {
            this.itemsPerPagePendente = parseInt(value);
            this.currentPagePendente = 1;
            this.renderTablePendente();
            this.updatePaginationInfoPendente();
        }
        
        performSearchPendente() {
            const searchInput = document.getElementById('searchPendente');
            if (searchInput) {
                this.filtersPendente.search = searchInput.value;
                this.currentPagePendente = 1;
                this.renderTablePendente();
                this.updatePaginationInfoPendente();
            }
        }
        
        goToPagePendente(page) {
            const filteredCount = this.getFilteredDapesPendente().length;
            const totalPages = Math.ceil(filteredCount / this.itemsPerPagePendente);
            
            if (page >= 1 && page <= totalPages) {
                this.currentPagePendente = page;
                this.renderTablePendente();
                this.updatePaginationInfoPendente();
            }
        }
        
        updatePaginationInfoPendente() {
            const filteredCount = this.getFilteredDapesPendente().length;
            const totalPages = Math.ceil(filteredCount / this.itemsPerPagePendente);
            const startItem = (this.currentPagePendente - 1) * this.itemsPerPagePendente + 1;
            const endItem = Math.min(this.currentPagePendente * this.itemsPerPagePendente, filteredCount);
            
            const paginationInfo = document.getElementById('paginationInfoPendente');
            if (paginationInfo) {
                paginationInfo.textContent = `Exibindo ${startItem} a ${endItem} de ${filteredCount} registros`;
            }
            
            // Atualizar botões de paginação
            const prevBtn = document.getElementById('prevPagePendente');
            const nextBtn = document.getElementById('nextPagePendente');
            
            if (prevBtn) {
                prevBtn.disabled = this.currentPagePendente === 1;
                prevBtn.classList.toggle('disabled', this.currentPagePendente === 1);
            }
            
            if (nextBtn) {
                nextBtn.disabled = this.currentPagePendente === totalPages;
                nextBtn.classList.toggle('disabled', this.currentPagePendente === totalPages);
            }
        }
        
        // Métodos para DAPEs Faturados
        changeItemsPerPageFaturado(value) {
            this.itemsPerPageFaturado = parseInt(value);
            this.currentPageFaturado = 1;
            this.renderTableFaturado();
            this.updatePaginationInfoFaturado();
        }
        
        performSearchFaturado() {
            const searchInput = document.getElementById('searchFaturado');
            if (searchInput) {
                this.filtersFaturado.search = searchInput.value;
                this.currentPageFaturado = 1;
                this.renderTableFaturado();
                this.updatePaginationInfoFaturado();
            }
        }
        
        goToPageFaturado(page) {
            const filteredCount = this.getFilteredDapesFaturado().length;
            const totalPages = Math.ceil(filteredCount / this.itemsPerPageFaturado);
            
            if (page >= 1 && page <= totalPages) {
                this.currentPageFaturado = page;
                this.renderTableFaturado();
                this.updatePaginationInfoFaturado();
            }
        }
        
        updatePaginationInfoFaturado() {
            const filteredCount = this.getFilteredDapesFaturado().length;
            const totalPages = Math.ceil(filteredCount / this.itemsPerPageFaturado);
            const startItem = (this.currentPageFaturado - 1) * this.itemsPerPageFaturado + 1;
            const endItem = Math.min(this.currentPageFaturado * this.itemsPerPageFaturado, filteredCount);
            
            const paginationInfo = document.getElementById('paginationInfoFaturado');
            if (paginationInfo) {
                paginationInfo.textContent = `Exibindo ${startItem} a ${endItem} de ${filteredCount} registros`;
            }
            
            // Atualizar botões de paginação
            const prevBtn = document.getElementById('prevPageFaturado');
            const nextBtn = document.getElementById('nextPageFaturado');
            
            if (prevBtn) {
                prevBtn.disabled = this.currentPageFaturado === 1;
                prevBtn.classList.toggle('disabled', this.currentPageFaturado === 1);
            }
            
            if (nextBtn) {
                nextBtn.disabled = this.currentPageFaturado === totalPages;
                nextBtn.classList.toggle('disabled', this.currentPageFaturado === totalPages);
            }
        }
        
        // Ações dos DAPEs
        viewDapePendente(id) {
            const dape = this.dapesPendente.find(d => d.id === id);
            if (dape) {
                this.showDapeDetailsModal(dape);
            }
        }
        
        showDapeDetailsModal(dape) {
            // Preencher informações do cliente
            document.getElementById('clienteDetalhes').value = `${dape.entidade}`;
            document.getElementById('tipoPagamentoDetalhes').value = '002';
            document.getElementById('emailGuiaDetalhes').value = 'rodolfo@tristarhandling.com.br,saofl.administrativo.';
            
            // Gerar dados dos itens baseados no serviço
            const itens = this.generateItensForDape(dape);
            this.renderItensTable(itens);
            
            // Mostrar o modal
            const modal = new bootstrap.Modal(document.getElementById('detalhesDapeModal'));
            modal.show();
        }
        
        generateItensForDape(dape) {
            // Gerar itens baseados no serviço do DAPE
            const itens = [];
            
            if (dape.servico === 'Homem-Hora') {
                itens.push({
                    nome: 'Homem-Hora',
                    parametro: '1',
                    quantidade: '1,0000',
                    valor: '164,0000',
                    valorFinal: '164,00'
                });
            } else if (dape.servico === 'Despaletização de carga (ULDs)') {
                itens.push({
                    nome: 'Descarregamento - Adiciona',
                    parametro: '1',
                    quantidade: '1,0000',
                    valor: '228,0000',
                    valorFinal: '228,00'
                });
            } else {
                // Item padrão para outros serviços
                itens.push({
                    nome: dape.servico,
                    parametro: '1',
                    quantidade: '1,0000',
                    valor: '100,0000',
                    valorFinal: '100,00'
                });
            }
            
            return itens;
        }
        
        renderItensTable(itens) {
            const tbody = document.getElementById('itensDapeTableBody');
            if (!tbody) return;
            
            tbody.innerHTML = itens.map(item => `
                <tr>
                    <td>${item.nome}</td>
                    <td>${item.parametro}</td>
                    <td>${item.quantidade}</td>
                    <td>${item.valor}</td>
                    <td>${item.valorFinal}</td>
                </tr>
            `).join('');
        }
        
        printDapeFaturado(id) {
            const dape = this.dapesFaturado.find(d => d.id === id);
            if (dape) {
                this.showNotification(`Imprimindo DAPE ${dape.numero} - ${dape.entidade}`, 'success');
                // Aqui você pode implementar a funcionalidade de impressão
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
    
    // Inicializar quando o DOM estiver carregado
    document.addEventListener('DOMContentLoaded', function() {
        // Verificar se já existe uma instância para evitar duplicação
        if (!window.dapeManager) {
            window.dapeManager = new DapeSemCargaManager();
        }
    });
}