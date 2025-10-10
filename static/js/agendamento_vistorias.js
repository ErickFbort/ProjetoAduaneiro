// JavaScript para a tela de Agendamento de Vistorias - Web Cliente
if (typeof AgendamentoVistoriasManager === 'undefined') {
class AgendamentoVistoriasManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.totalItems = 0;
        this.filters = {};
        this.vistorias = [];
        this.currentView = 'list'; // 'list' ou 'form'
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadVistorias();
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
        document.getElementById('colaboradorFilter')?.addEventListener('input', (e) => this.applyFilter('colaborador', e.target.value));
        
        // Paginação
        document.getElementById('prevPage')?.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        document.getElementById('nextPage')?.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        
        // Ações
        document.getElementById('cadastrarVistoria')?.addEventListener('click', () => this.showForm());
        document.getElementById('voltarLista')?.addEventListener('click', () => this.showList());
        document.getElementById('cancelarVistoria')?.addEventListener('click', () => this.cancelForm());
        document.getElementById('vistoriaForm')?.addEventListener('submit', (e) => this.saveVistoria(e));
    }
    
    // Dados simulados baseados na imagem
    generateMockData() {
        return [
            {
                id: 1,
                status: 'AGENDADO',
                di: 'DU-E 25BR001755383-9',
                awb: '05701894082',
                hawb: 'EA0026325',
                cnpj: '',
                consignatario: 'SCAN GLOBAL LOGISTICS DO BRASIL LTDA',
                colaboradorRfb: 'FLAVIO OLIVEIRA BRITO',
                data: '25/09/2025',
                hora: '14:00'
            },
            {
                id: 2,
                status: 'AGENDADO',
                di: '25/2101587-2',
                awb: '04515592441',
                hawb: 'H289105',
                cnpj: '',
                consignatario: 'Luiz da Silva Goshima',
                colaboradorRfb: 'OLIVIO',
                data: '24/09/2025',
                hora: '10:00'
            },
            {
                id: 3,
                status: 'AGENDADO',
                di: 'DU-E 25BR001755384-0',
                awb: '05701894083',
                hawb: 'EA0026326',
                cnpj: '',
                consignatario: 'SKECHERS DO BRASIL CALCADOS LTDA (com separação)',
                colaboradorRfb: 'FLAVIO OLIVEIRA BRITO',
                data: '23/09/2025',
                hora: '14:30'
            },
            {
                id: 4,
                status: 'EXECUTADO',
                di: '25/2101588-3',
                awb: '04515592442',
                hawb: 'H289106',
                cnpj: '12.345.678/0001-90',
                consignatario: 'EMPRESA EXEMPLO LTDA',
                colaboradorRfb: 'OLIVIO',
                data: '22/09/2025',
                hora: '14:45'
            },
            {
                id: 5,
                status: 'EXECUTADO',
                di: 'DU-E 25BR001755385-1',
                awb: '05701894084',
                hawb: 'EA0026327',
                cnpj: '98.765.432/0001-10',
                consignatario: 'OUTRA EMPRESA S.A.',
                colaboradorRfb: 'FLAVIO OLIVEIRA BRITO',
                data: '21/09/2025',
                hora: '10:30'
            },
            {
                id: 6,
                status: 'EXECUTADO',
                di: '25/2101589-4',
                awb: '04515592443',
                hawb: 'H289107',
                cnpj: '11.222.333/0001-44',
                consignatario: 'TERCEIRA EMPRESA LTDA',
                colaboradorRfb: 'OLIVIO',
                data: '20/09/2025',
                hora: '15:15'
            },
            {
                id: 7,
                status: 'EXECUTADO',
                di: 'DU-E 25BR001755386-2',
                awb: '05701894085',
                hawb: 'EA0026328',
                cnpj: '55.666.777/0001-88',
                consignatario: 'QUARTA EMPRESA BRASIL S.A.',
                colaboradorRfb: 'FLAVIO OLIVEIRA BRITO',
                data: '19/09/2025',
                hora: '09:45'
            },
            {
                id: 8,
                status: 'EXECUTADO',
                di: '25/2101590-5',
                awb: '04515592444',
                hawb: 'H289108',
                cnpj: '99.888.777/0001-66',
                consignatario: 'QUINTA EMPRESA COMERCIAL LTDA',
                colaboradorRfb: 'OLIVIO',
                data: '18/09/2025',
                hora: '16:00'
            },
            {
                id: 9,
                status: 'EXECUTADO',
                di: 'DU-E 25BR001755387-3',
                awb: '05701894086',
                hawb: 'EA0026329',
                cnpj: '33.444.555/0001-22',
                consignatario: 'SEXTA EMPRESA INDUSTRIAL S.A.',
                colaboradorRfb: 'FLAVIO OLIVEIRA BRITO',
                data: '17/09/2025',
                hora: '11:20'
            },
            {
                id: 10,
                status: 'EXECUTADO',
                di: '25/2101591-6',
                awb: '04515592445',
                hawb: 'H289109',
                cnpj: '77.888.999/0001-33',
                consignatario: 'SETIMA EMPRESA LOGISTICA LTDA',
                colaboradorRfb: 'OLIVIO',
                data: '16/09/2025',
                hora: '13:30'
            }
        ];
    }
    
    loadVistorias() {
        this.vistorias = this.generateMockData();
        this.totalItems = 3028; // Simulando o total da imagem
        this.renderTable();
        this.updatePaginationInfo();
    }
    
    renderTable() {
        const tbody = document.getElementById('vistoriasTableBody');
        if (!tbody) return;
        
        const filteredVistorias = this.getFilteredVistorias();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageVistorias = filteredVistorias.slice(startIndex, endIndex);
        
        tbody.innerHTML = pageVistorias.map(vistoria => this.renderVistoriaRow(vistoria)).join('');
    }
    
    renderVistoriaRow(vistoria) {
        // Definir ícones e cores para cada status
        let statusIcon = '';
        let statusClass = '';
        
        switch(vistoria.status) {
            case 'EXECUTADO':
                statusIcon = '<i class="fas fa-thumbs-up text-success"></i>';
                statusClass = 'text-success';
                break;
            case 'AGENDADO':
                statusIcon = '<i class="fas fa-calendar text-danger"></i>';
                statusClass = 'text-danger';
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
                    <span class="ms-1 small ${statusClass}">${vistoria.status}</span>
                </td>
                <td>${vistoria.di}</td>
                <td>${vistoria.awb}</td>
                <td>${vistoria.hawb || '-'}</td>
                <td>${vistoria.cnpj || '-'}</td>
                <td>${vistoria.consignatario}</td>
                <td>${vistoria.colaboradorRfb}</td>
                <td>${vistoria.data}</td>
                <td>${vistoria.hora}</td>
                <td>
                    <div class="d-flex flex-column gap-1 align-items-center py-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="vistoriasManager.editVistoria(${vistoria.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="vistoriasManager.viewVistoria(${vistoria.id})" title="Visualizar">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }
    
    getFilteredVistorias() {
        let filtered = [...this.vistorias];
        
        // Aplicar filtros
        if (this.filters.status) {
            filtered = filtered.filter(v => v.status === this.filters.status);
        }
        
        if (this.filters.colaborador) {
            const colaborador = this.filters.colaborador.toLowerCase();
            filtered = filtered.filter(v => v.colaboradorRfb.toLowerCase().includes(colaborador));
        }
        
        if (this.filters.dataInicio) {
            filtered = filtered.filter(v => this.compareDates(v.data, this.filters.dataInicio) >= 0);
        }
        
        if (this.filters.dataFim) {
            filtered = filtered.filter(v => this.compareDates(v.data, this.filters.dataFim) <= 0);
        }
        
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(v => 
                v.di.toLowerCase().includes(searchTerm) ||
                v.awb.includes(searchTerm) ||
                v.hawb.toLowerCase().includes(searchTerm) ||
                v.consignatario.toLowerCase().includes(searchTerm) ||
                v.colaboradorRfb.toLowerCase().includes(searchTerm)
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
        const filteredCount = this.getFilteredVistorias().length;
        const totalPages = Math.ceil(filteredCount / this.itemsPerPage);
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, filteredCount);
        
        const paginationInfo = document.getElementById('paginationInfo');
        if (paginationInfo) {
            // Mostrar o total real quando não há filtros aplicados
            const totalDisplay = Object.keys(this.filters).length === 0 ? this.totalItems : filteredCount;
            const endDisplay = Object.keys(this.filters).length === 0 ? Math.min(this.currentPage * this.itemsPerPage, this.totalItems) : endItem;
            paginationInfo.textContent = `Exibindo ${startItem} a ${endDisplay} de ${totalDisplay} registros`;
        }
        
        // Atualizar botões de paginação
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
            prevBtn.classList.toggle('disabled', this.currentPage === 1);
        }
        
        if (nextBtn) {
            const maxPages = Object.keys(this.filters).length === 0 ? Math.ceil(this.totalItems / this.itemsPerPage) : totalPages;
            nextBtn.disabled = this.currentPage === maxPages;
            nextBtn.classList.toggle('disabled', this.currentPage === maxPages);
        }
    }
    
    goToPage(page) {
        const filteredCount = this.getFilteredVistorias().length;
        const totalPages = Object.keys(this.filters).length === 0 ? Math.ceil(this.totalItems / this.itemsPerPage) : Math.ceil(filteredCount / this.itemsPerPage);
        
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
        document.getElementById('colaboradorFilter').value = '';
        
        this.renderTable();
        this.updatePaginationInfo();
    }
    
    // Ações das vistorias
    editVistoria(id) {
        const vistoria = this.vistorias.find(v => v.id === id);
        if (vistoria) {
            this.showNotification(`Editando vistoria ${id} - DI: ${vistoria.di}`, 'info');
            // Aqui você pode implementar um modal de edição
        }
    }
    
    viewVistoria(id) {
        const vistoria = this.vistorias.find(v => v.id === id);
        if (vistoria) {
            this.showNotification(`Visualizando vistoria ${id} - DI: ${vistoria.di}`, 'info');
            // Aqui você pode implementar um modal de visualização
        }
    }
    
    // Métodos para alternar entre lista e formulário
    showForm() {
        this.currentView = 'form';
        this.toggleView();
        this.clearForm();
    }
    
    showList() {
        this.currentView = 'list';
        this.toggleView();
    }
    
    toggleView() {
        const listContainer = document.getElementById('vistoriasListContainer');
        const formContainer = document.getElementById('vistoriaFormContainer');
        
        if (this.currentView === 'list') {
            listContainer.style.display = 'block';
            formContainer.style.display = 'none';
        } else {
            listContainer.style.display = 'none';
            formContainer.style.display = 'block';
        }
    }
    
    clearForm() {
        document.getElementById('vistoriaForm').reset();
    }
    
    cancelForm() {
        this.showList();
    }
    
    saveVistoria(event) {
        event.preventDefault();
        
        // Validar formulário
        if (!this.validateForm()) {
            return;
        }
        
        // Coletar dados do formulário
        const formData = {
            awb: document.getElementById('awb').value,
            hawb: document.getElementById('hawb').value,
            di: document.getElementById('di').value,
            consignatario: document.getElementById('consignatario').value,
            colaboradorRfb: document.getElementById('colaboradorRfb').value,
            responsavelAgendamento: document.getElementById('responsavelAgendamento').value,
            data: document.getElementById('data').value,
            hora: document.getElementById('hora').value
        };
        
        // Simular salvamento
        this.showNotification('Vistoria cadastrada com sucesso!', 'success');
        
        // Voltar para a lista
        this.showList();
        
        // Aqui você pode implementar a lógica de salvamento real
        console.log('Dados da vistoria:', formData);
    }
    
    validateForm() {
        const requiredFields = ['di', 'consignatario', 'colaboradorRfb', 'responsavelAgendamento', 'data', 'hora'];
        let isValid = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });
        
        if (!isValid) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        }
        
        return isValid;
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
    if (!window.vistoriasManager) {
        window.vistoriasManager = new AgendamentoVistoriasManager();
    }
});
}

// Funções globais para filtros (fora do bloco if)
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
    if (window.vistoriasManager) {
        // Os filtros já são aplicados automaticamente via event listeners
        window.vistoriasManager.renderTable();
        window.vistoriasManager.updatePaginationInfo();
    }
}

function clearAdvancedFilters() {
    if (window.vistoriasManager) {
        window.vistoriasManager.clearFilters();
    }
}