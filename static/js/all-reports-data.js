/**
 * Dados Centralizados de Todos os Relatórios
 * Contém todos os relatórios disponíveis em todos os submódulos
 */

const ALL_REPORTS_DATA = {
    // ========================================
    // RELATÓRIOS DE FATURAMENTO
    // ========================================
    'baixas-guias': {
        name: 'Baixas de Guias',
        fields: '001*,002*,003,018',
        icon: 'fa-file-invoice-dollar',
        color: 'success',
        module: 'faturamento'
    },
    'cargas-entregues': {
        name: 'Cargas Entregues',
        fields: '001*,002*,003*,006,008,009,011,018',
        icon: 'fa-truck',
        color: 'primary',
        module: 'faturamento'
    },
    'cargas-entregues-dta': {
        name: 'Cargas Entregues DTA',
        fields: '001*,002*,003,004,006,008,018',
        icon: 'fa-file-alt',
        color: 'info',
        module: 'faturamento'
    },
    'cargas-recebidas-natureza': {
        name: 'Cargas Recebidas por Natureza',
        fields: '001*,002,003*,017,018',
        icon: 'fa-warehouse',
        color: 'warning',
        module: 'faturamento'
    },
    'custodia': {
        name: 'Custódia',
        fields: '001*,002,003*,018',
        icon: 'fa-shield-alt',
        color: 'warning',
        module: 'faturamento'
    },
    'guias-canceladas': {
        name: 'Guias Canceladas',
        fields: '001*,002*,003*,018',
        icon: 'fa-times-circle',
        color: 'danger',
        module: 'faturamento'
    },
    'guias-emitidas-funcionarios': {
        name: 'Guias Emitidas por Funcionários',
        fields: '001*,002*,003,018',
        icon: 'fa-user-tie',
        color: 'info',
        module: 'faturamento'
    },
    'guias-faturadas': {
        name: 'Guias Faturadas',
        fields: '001*,002*,003,018',
        icon: 'fa-check-circle',
        color: 'success',
        module: 'faturamento'
    },
    'pagamentos-estornados': {
        name: 'Pagamentos Estornados',
        fields: '001*,002*,003*,018',
        icon: 'fa-undo',
        color: 'danger',
        module: 'faturamento'
    },
    'processos-cancelados': {
        name: 'Processos Cancelados',
        fields: '001*,002*,003*,018',
        icon: 'fa-ban',
        color: 'danger',
        module: 'faturamento'
    },
    'quantidade-guias-funcionarios': {
        name: 'Quantidade Guias por Funcionários',
        fields: '001*,002*,003,018',
        icon: 'fa-chart-bar',
        color: 'info',
        module: 'faturamento'
    },
    'relatorio-pagamentos-divergentes': {
        name: 'Relatório de Pagamentos Divergentes',
        fields: '001*,002*,003*,018',
        icon: 'fa-exclamation-triangle',
        color: 'warning',
        module: 'faturamento'
    },
    'servicos-faturamento': {
        name: 'Serviços x Faturamento',
        fields: '001*,002*,003*,006,007,008,009,018',
        icon: 'fa-calculator',
        color: 'success',
        module: 'faturamento'
    },
    'validacao-cobrancas-esperadas': {
        name: 'Validação Cobranças Esperadas',
        fields: '001*,002*,003*,018',
        icon: 'fa-search-dollar',
        color: 'primary',
        module: 'faturamento'
    },
    'validacao-guias-pos-fechamento': {
        name: 'Validação Guias Pós-Fechamento',
        fields: '001*,002*,003*,018',
        icon: 'fa-clipboard-check',
        color: 'info',
        module: 'faturamento'
    },
    'validacao-guias-pre-fechamento': {
        name: 'Validação Guias Pré-Fechamento',
        fields: '001*,002*,003*,018',
        icon: 'fa-clipboard-list',
        color: 'warning',
        module: 'faturamento'
    },

    // ========================================
    // RELATÓRIOS COMERCIAIS
    // ========================================
    'cargas-armazenadas-60': {
        name: 'Cargas Armazenadas +60 Dias',
        fields: '001*,002*,003,018',
        icon: 'fa-warehouse',
        color: 'warning',
        module: 'comercial'
    },
    'cargas-consignatario': {
        name: 'Cargas Armazenadas por Consignatário',
        fields: '001*,002*,003*,009',
        icon: 'fa-building',
        color: 'info',
        module: 'comercial'
    },
    'cargas-isencao': {
        name: 'Cargas com Isenção',
        fields: '001*,002,003*,018,006,008',
        icon: 'fa-gift',
        color: 'success',
        module: 'comercial'
    },
    'clientes-correntistas': {
        name: 'Clientes Correntistas',
        fields: '001*,002*,003,006,008,018',
        icon: 'fa-user-tie',
        color: 'primary',
        module: 'comercial'
    },
    'dapes-sem-carga': {
        name: 'DAPES Sem Carga em Aberto',
        fields: '001*,002*,003,006,008,007,018',
        icon: 'fa-exclamation-triangle',
        color: 'danger',
        module: 'comercial'
    },
    'demonstrativo-cargas': {
        name: 'Demonstrativo Cargas Analítico',
        fields: '001*,002,003*,018',
        icon: 'fa-chart-pie',
        color: 'info',
        module: 'comercial'
    },
    'descontos': {
        name: 'Descontos',
        fields: '001*,002,003,018,006,008',
        icon: 'fa-percent',
        color: 'success',
        module: 'comercial'
    },
    'exportacoes': {
        name: 'Exportações',
        fields: '001*,002*,003,006,008,018,027',
        icon: 'fa-ship',
        color: 'primary',
        module: 'comercial'
    },
    'perfil-cliente': {
        name: 'Perfil de Cliente',
        fields: '001*,002,003,006,008,018,024,025',
        icon: 'fa-user-circle',
        color: 'info',
        module: 'comercial'
    },
    'vistorias': {
        name: 'Vistorias',
        fields: '001*,002,003,018,006,008,021',
        icon: 'fa-search',
        color: 'warning',
        module: 'comercial'
    },

    // ========================================
    // RELATÓRIOS OPERACIONAIS
    // ========================================
    'operacoes-dia': {
        name: 'Operações do Dia',
        fields: '001*,002*,003,018',
        icon: 'fa-calendar-day',
        color: 'primary',
        module: 'operacional'
    },
    'movimentacao-cargas': {
        name: 'Movimentação de Cargas',
        fields: '001*,002*,003*,006,008,009,018',
        icon: 'fa-truck-loading',
        color: 'info',
        module: 'operacional'
    },
    'status-operacoes': {
        name: 'Status das Operações',
        fields: '001*,002*,003*,018',
        icon: 'fa-tasks',
        color: 'warning',
        module: 'operacional'
    },
    'tempo-operacao': {
        name: 'Tempo de Operação',
        fields: '001*,002*,003,006,008,018',
        icon: 'fa-clock',
        color: 'primary',
        module: 'operacional'
    },
    'produtividade': {
        name: 'Produtividade',
        fields: '001*,002*,003,006,007,008,018',
        icon: 'fa-chart-line',
        color: 'primary',
        module: 'operacional'
    },

    // ========================================
    // RELATÓRIOS GERENCIAIS
    // ========================================
    'dashboard-gerencial': {
        name: 'Dashboard Gerencial',
        fields: '001*,002*,003,006,007,008,018',
        icon: 'fa-tachometer-alt',
        color: 'primary',
        module: 'gerencial'
    },
    'indicadores-kpi': {
        name: 'Indicadores KPI',
        fields: '001*,002*,003,006,007,008,018',
        icon: 'fa-chart-bar',
        color: 'info',
        module: 'gerencial'
    },
    'performance-equipe': {
        name: 'Performance da Equipe',
        fields: '001*,002*,003,006,008,018',
        icon: 'fa-users',
        color: 'success',
        module: 'gerencial'
    },
    'analise-tendencias': {
        name: 'Análise de Tendências',
        fields: '001*,002*,003,006,007,008,018',
        icon: 'fa-chart-line',
        color: 'warning',
        module: 'gerencial'
    },
    'relatorio-executivo': {
        name: 'Relatório Executivo',
        fields: '001*,002*,003,006,007,008,009,018',
        icon: 'fa-file-alt',
        color: 'primary',
        module: 'gerencial'
    },

    // ========================================
    // RELATÓRIOS FINANCEIROS
    // ========================================
    'fluxo-caixa': {
        name: 'Fluxo de Caixa',
        fields: '001*,002*,003,006,007,008,018',
        icon: 'fa-money-bill-wave',
        color: 'primary',
        module: 'financeiro'
    },
    'receitas-despesas': {
        name: 'Receitas e Despesas',
        fields: '001*,002*,003,006,007,008,018',
        icon: 'fa-chart-pie',
        color: 'info',
        module: 'financeiro'
    },
    'contas-pagar': {
        name: 'Contas a Pagar',
        fields: '001*,002*,003,006,008,018',
        icon: 'fa-credit-card',
        color: 'warning',
        module: 'financeiro'
    },
    'contas-receber': {
        name: 'Contas a Receber',
        fields: '001*,002*,003,006,008,018',
        icon: 'fa-hand-holding-usd',
        color: 'primary',
        module: 'financeiro'
    },
    'balanco-mensal': {
        name: 'Balanço Mensal',
        fields: '001*,002*,003,006,007,008,018',
        icon: 'fa-balance-scale',
        color: 'primary',
        module: 'financeiro'
    }
};

// Função para obter relatórios agrupados por módulo
function getReportsByModule() {
    const grouped = {};
    Object.keys(ALL_REPORTS_DATA).forEach(reportId => {
        const report = ALL_REPORTS_DATA[reportId];
        const module = report.module;
        if (!grouped[module]) {
            grouped[module] = [];
        }
        grouped[module].push({
            id: reportId,
            name: report.name,
            fields: report.fields,
            icon: report.icon,
            color: report.color
        });
    });
    return grouped;
}

// Função para obter todos os relatórios em formato de opções para select
function getAllReportsOptions() {
    const options = [];
    const modules = ['faturamento', 'comercial', 'operacional', 'gerencial', 'financeiro'];
    
    modules.forEach(module => {
        const moduleReports = Object.keys(ALL_REPORTS_DATA)
            .filter(id => ALL_REPORTS_DATA[id].module === module)
            .map(id => ({
                id,
                name: ALL_REPORTS_DATA[id].name,
                fields: ALL_REPORTS_DATA[id].fields,
                icon: ALL_REPORTS_DATA[id].icon,
                color: ALL_REPORTS_DATA[id].color,
                module
            }));
        
        if (moduleReports.length > 0) {
            options.push({
                group: module.charAt(0).toUpperCase() + module.slice(1),
                reports: moduleReports
            });
        }
    });
    
    return options;
}

// Exportar para uso global
window.ALL_REPORTS_DATA = ALL_REPORTS_DATA;
window.getReportsByModule = getReportsByModule;
window.getAllReportsOptions = getAllReportsOptions;
