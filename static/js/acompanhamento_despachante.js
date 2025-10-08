/**
 * Acompanhamento Despachante (Em aberto) - Web Cliente
 * Funcionalidades para gerenciar processos em aberto do despachante
 */

// Dados simulados para demonstração
const dadosAcompanhamento = [
    {
        id: 1,
        tipoOperacao: 'IMPORTACAO',
        requisicao: '406939',
        protocolo: '',
        dataCriacao: '07/10/2025 09:19',
        ultimaAtualizacao: '08/10/2025 10:56:41',
        di: '2522358242',
        dta: '',
        cliente: 'EMPRESA IMPORTADORA LTDA',
        despachante: 'DESPACHANTE EXEMPLO LTDA',
        status: 'EM_ABERTO',
        observacoes: 'Processo em análise para liberação aduaneira',
        observacoesInternas: 'Aguardando documentação complementar do cliente'
    },
    {
        id: 2,
        tipoOperacao: 'IMPORTACAO',
        requisicao: '407426',
        protocolo: '',
        dataCriacao: '08/10/2025 10:55',
        ultimaAtualizacao: '08/10/2025 10:56:22',
        di: '2522403205',
        dta: '',
        cliente: 'IMPORTADORA BRASIL S/A',
        despachante: 'DESPACHANTE EXEMPLO LTDA',
        status: 'PENDENTE',
        observacoes: 'Processo pendente de análise fiscal',
        observacoesInternas: 'Documentos em análise pela Receita Federal'
    },
    {
        id: 3,
        tipoOperacao: 'IMPORTACAO',
        requisicao: '407065',
        protocolo: '',
        dataCriacao: '07/10/2025 11:47',
        ultimaAtualizacao: '08/10/2025 10:55:38',
        di: '2522381660',
        dta: '',
        cliente: 'COMERCIAL IMPORTADORA LTDA',
        despachante: 'DESPACHANTE EXEMPLO LTDA',
        status: 'EM_ANALISE',
        observacoes: 'Processo em análise para despacho aduaneiro',
        observacoesInternas: 'Aguardando liberação do órgão anuente'
    },
    {
        id: 4,
        tipoOperacao: 'IMPORTACAO',
        requisicao: '407423',
        protocolo: '',
        dataCriacao: '08/10/2025 10:50',
        ultimaAtualizacao: '08/10/2025 10:52:07',
        di: '2522403043',
        dta: '',
        cliente: 'INDUSTRIAL IMPORTADORA S/A',
        despachante: 'DESPACHANTE EXEMPLO LTDA',
        status: 'AGUARDANDO_DOCUMENTOS',
        observacoes: 'Processo aguardando documentação do cliente',
        observacoesInternas: 'Cliente deve enviar documentos complementares'
    },
    {
        id: 5,
        tipoOperacao: 'IMPORTACAO',
        requisicao: '407424',
        protocolo: '',
        dataCriacao: '08/10/2025 10:51',
        ultimaAtualizacao: '08/10/2025 10:51:43',
        di: '2522207627',
        dta: '',
        cliente: 'TECNOLOGIA IMPORTADORA LTDA',
        despachante: 'DESPACHANTE EXEMPLO LTDA',
        status: 'EM_ABERTO',
        observacoes: 'Processo em tramitação normal',
        observacoesInternas: 'Processo dentro do prazo normal de análise'
    }
];

// Estado da aplicação
let estadoAplicacao = {
    paginaAtual: 1,
    itensPorPagina: 10,
    filtros: {},
    dadosFiltrados: [...dadosAcompanhamento]
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    inicializarAcompanhamento();
    configurarEventos();
    carregarDados();
});

/**
 * Inicializa o módulo de acompanhamento
 */
function inicializarAcompanhamento() {
    console.log('Inicializando módulo de Acompanhamento Despachante');
    
    // Configurar itens por página
    const selectItens = document.getElementById('itemsPorPagina');
    if (selectItens) {
        selectItens.value = estadoAplicacao.itensPorPagina;
    }
}

/**
 * Configura os eventos da interface
 */
function configurarEventos() {
    // Pesquisa rápida
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            aplicarFiltros();
        }, 300));
    }

    // Botão de pesquisa
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            aplicarFiltros();
        });
    }

    // Limpar filtros
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', limparFiltros);
    }

    // Itens por página
    const selectItens = document.getElementById('itemsPorPagina');
    if (selectItens) {
        selectItens.addEventListener('change', function() {
            estadoAplicacao.itensPorPagina = parseInt(this.value);
            estadoAplicacao.paginaAtual = 1;
            carregarDados();
        });
    }

    // Botão de atualizar
    const refreshBtn = document.querySelector('[onclick="refreshTable()"]');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            carregarDados();
        });
    }

    // Limpar filtros do estado vazio
    const clearFiltersEmpty = document.getElementById('clearFiltersEmpty');
    if (clearFiltersEmpty) {
        clearFiltersEmpty.addEventListener('click', function() {
            limparFiltros();
        });
    }
}

/**
 * Carrega os dados na tabela
 */
function carregarDados() {
    const tbody = document.getElementById('acompanhamentoTableBody');
    const emptyState = document.getElementById('emptyState');
    
    if (!tbody) return;

    // Aplicar filtros
    aplicarFiltros();
    
    // Calcular paginação
    const inicio = (estadoAplicacao.paginaAtual - 1) * estadoAplicacao.itensPorPagina;
    const fim = inicio + estadoAplicacao.itensPorPagina;
    const dadosPagina = estadoAplicacao.dadosFiltrados.slice(inicio, fim);

    // Limpar tabela
    tbody.innerHTML = '';

    if (dadosPagina.length === 0) {
        // Mostrar estado vazio
        if (emptyState) {
            emptyState.classList.remove('d-none');
        }
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Nenhum processo em aberto encontrado</td></tr>';
    } else {
        // Ocultar estado vazio
        if (emptyState) {
            emptyState.classList.add('d-none');
        }

        // Preencher tabela
        dadosPagina.forEach(processo => {
            const row = criarLinhaProcesso(processo);
            tbody.appendChild(row);
        });
    }

    // Atualizar paginação
    atualizarPaginacao();
}

/**
 * Cria uma linha da tabela para um processo
 */
function criarLinhaProcesso(processo) {
    const row = document.createElement('tr');
    row.className = 'processo-row';
    row.setAttribute('data-id', processo.id);

    // Formatar tipo de operação
    const tipoOperacao = processo.tipoOperacao === 'IMPORTACAO' ? 'IMPORTAÇÃO' : 'EXPORTAÇÃO';
    
    // Formatar status
    const statusClass = getStatusClass(processo.status);
    const statusText = getStatusText(processo.status);

    row.innerHTML = `
        <td>
            <span class="badge ${processo.tipoOperacao === 'IMPORTACAO' ? 'bg-primary' : 'bg-success'}">
                ${tipoOperacao}
            </span>
        </td>
        <td>
            <span class="fw-bold text-primary">${processo.requisicao}</span>
        </td>
        <td>
            <span class="text-muted">${processo.protocolo || '-'}</span>
        </td>
        <td>
            <span class="small">${processo.dataCriacao}</span>
        </td>
        <td>
            <span class="small">${processo.ultimaAtualizacao}</span>
        </td>
        <td>
            <span class="fw-bold">${processo.di}</span>
        </td>
        <td>
            <span class="text-muted">${processo.dta || '-'}</span>
        </td>
        <td>
            <div class="d-flex gap-1">
                <button class="btn btn-sm btn-outline-primary" onclick="visualizarProcesso(${processo.id})" title="Visualizar">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="editarProcesso(${processo.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-info" onclick="atualizarStatus(${processo.id})" title="Atualizar Status">
                    <i class="fas fa-sync"></i>
                </button>
            </div>
        </td>
    `;

    return row;
}

/**
 * Aplica os filtros aos dados
 */
function aplicarFiltros() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';

    estadoAplicacao.dadosFiltrados = dadosAcompanhamento.filter(processo => {
        // Filtro de pesquisa geral
        if (searchTerm) {
            const searchableText = [
                processo.requisicao,
                processo.protocolo,
                processo.di,
                processo.dta,
                processo.cliente,
                processo.despachante
            ].join(' ').toLowerCase();
            
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }

        return true;
    });

    estadoAplicacao.paginaAtual = 1;
    carregarDados();
}

/**
 * Limpa todos os filtros
 */
function limparFiltros() {
    // Limpar pesquisa rápida
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    // Aplicar filtros limpos
    aplicarFiltros();
}

/**
 * Atualiza a paginação
 */
function atualizarPaginacao() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    const totalItens = estadoAplicacao.dadosFiltrados.length;
    const totalPaginas = Math.ceil(totalItens / estadoAplicacao.itensPorPagina);
    const paginaAtual = estadoAplicacao.paginaAtual;

    if (totalPaginas <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // Botão anterior
    paginationHTML += `
        <li class="page-item ${paginaAtual === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="irParaPagina(${paginaAtual - 1})">Anterior</a>
        </li>
    `;

    // Páginas
    const inicio = Math.max(1, paginaAtual - 2);
    const fim = Math.min(totalPaginas, paginaAtual + 2);

    for (let i = inicio; i <= fim; i++) {
        paginationHTML += `
            <li class="page-item ${i === paginaAtual ? 'active' : ''}">
                <a class="page-link" href="#" onclick="irParaPagina(${i})">${i}</a>
            </li>
        `;
    }

    // Botão próximo
    paginationHTML += `
        <li class="page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="irParaPagina(${paginaAtual + 1})">Próximo</a>
        </li>
    `;

    pagination.innerHTML = paginationHTML;
}

/**
 * Vai para uma página específica
 */
function irParaPagina(pagina) {
    const totalPaginas = Math.ceil(estadoAplicacao.dadosFiltrados.length / estadoAplicacao.itensPorPagina);
    
    if (pagina >= 1 && pagina <= totalPaginas) {
        estadoAplicacao.paginaAtual = pagina;
        carregarDados();
    }
}

/**
 * Visualiza os detalhes de um processo
 */
function visualizarProcesso(id) {
    const processo = dadosAcompanhamento.find(p => p.id === id);
    if (!processo) return;

    // Preencher modal de detalhes
    document.getElementById('processoRequisicao').textContent = processo.requisicao;
    document.getElementById('tipoOperacaoDetalhes').textContent = processo.tipoOperacao === 'IMPORTACAO' ? 'IMPORTAÇÃO' : 'EXPORTAÇÃO';
    document.getElementById('statusDetalhes').textContent = getStatusText(processo.status);
    document.getElementById('requisicaoDetalhes').textContent = processo.requisicao;
    document.getElementById('protocoloDetalhes').textContent = processo.protocolo || 'Não informado';
    document.getElementById('dataCriacaoDetalhes').textContent = processo.dataCriacao;
    document.getElementById('ultimaAtualizacaoDetalhes').textContent = processo.ultimaAtualizacao;
    document.getElementById('diDetalhes').textContent = processo.di;
    document.getElementById('dtaDetalhes').textContent = processo.dta || 'Não informado';
    document.getElementById('clienteDetalhes').textContent = processo.cliente;
    document.getElementById('despachanteDetalhes').textContent = processo.despachante;
    document.getElementById('observacoesDetalhes').textContent = processo.observacoes || 'Nenhuma observação disponível.';
    document.getElementById('observacoesInternasDetalhes').textContent = processo.observacoesInternas || 'Nenhuma observação interna disponível.';

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('detalhesProcessoModal'));
    modal.show();
}

/**
 * Edita um processo
 */
function editarProcesso(id) {
    console.log('Editando processo:', id);
    // Implementar funcionalidade de edição
    alert('Funcionalidade de edição será implementada em breve.');
}

/**
 * Atualiza o status de um processo
 */
function atualizarStatus(id) {
    console.log('Atualizando status do processo:', id);
    // Implementar funcionalidade de atualização de status
    alert('Funcionalidade de atualização de status será implementada em breve.');
}

/**
 * Atualiza a tabela
 */
function refreshTable() {
    carregarDados();
}


/**
 * Obtém a classe CSS para o status
 */
function getStatusClass(status) {
    const classes = {
        'EM_ABERTO': 'bg-warning',
        'PENDENTE': 'bg-danger',
        'EM_ANALISE': 'bg-info',
        'AGUARDANDO_DOCUMENTOS': 'bg-secondary'
    };
    return classes[status] || 'bg-secondary';
}

/**
 * Obtém o texto do status
 */
function getStatusText(status) {
    const textos = {
        'EM_ABERTO': 'Em Aberto',
        'PENDENTE': 'Pendente',
        'EM_ANALISE': 'Em Análise',
        'AGUARDANDO_DOCUMENTOS': 'Aguardando Documentos'
    };
    return textos[status] || status;
}

/**
 * Função debounce para otimizar pesquisas
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
