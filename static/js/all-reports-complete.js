/**
 * Todos os Relatórios Disponíveis no Sistema
 * Lista completa de relatórios que podem ser adicionados a qualquer submódulo
 */

window.ALL_REPORTS_COMPLETE = {
    // Relatórios Comerciais
    'cargas-armazenadas-consignatario': {
        name: 'Cargas Armazenadas por Consignatário',
        description: 'Relatório de cargas armazenadas organizadas por consignatário',
        fields: '001*,002,003*,006,008,018',
        icon: 'fa-warehouse',
        color: 'primary',
        category: 'comercial'
    },
    'cargas-entregues': {
        name: 'Cargas Entregues',
        description: 'Relatório de cargas que foram entregues',
        fields: '001*,002*,003*,006,008,009,011,018',
        icon: 'fa-truck',
        color: 'success',
        category: 'comercial'
    },
    'servicos-faturamento': {
        name: 'Serviços x Faturamento',
        description: 'Análise de serviços versus faturamento',
        fields: '001*,002*,003*,006,007,008,009,018',
        icon: 'fa-calculator',
        color: 'info',
        category: 'comercial'
    },
    'extrato-apoio': {
        name: 'Extrato de Apoio',
        description: 'Extrato de apoio para operações',
        fields: '001*,002*,003*,018',
        icon: 'fa-file-alt',
        color: 'secondary',
        category: 'comercial'
    },
    'servicos-competencia': {
        name: 'Serviços por Competência',
        description: 'Relatório de serviços organizados por competência',
        fields: '001*,002*,003*,006,018',
        icon: 'fa-calendar-alt',
        color: 'warning',
        category: 'comercial'
    },
    'relatorio-disponibilidade': {
        name: 'Relatório de Disponibilidade',
        description: 'Relatório de disponibilidade de recursos',
        fields: '001*,002,003*,018',
        icon: 'fa-check-circle',
        color: 'success',
        category: 'comercial'
    },
    'relatorio-voos': {
        name: 'Relatório de Voos',
        description: 'Relatório de voos e operações aéreas',
        fields: '001*,002*,003*,006,008,018',
        icon: 'fa-plane',
        color: 'info',
        category: 'comercial'
    },
    'relatorio-fechamento-guias': {
        name: 'Relatório de Fechamento (Guias)',
        description: 'Relatório de fechamento de guias',
        fields: '001*,002*,003*,018',
        icon: 'fa-file-invoice',
        color: 'primary',
        category: 'comercial'
    },
    'relatorio-qtde-guias': {
        name: 'Relatório Qtde Guias',
        description: 'Relatório de quantidade de guias',
        fields: '001*,002*,003,018',
        icon: 'fa-chart-bar',
        color: 'info',
        category: 'comercial'
    },
    'dape-sem-carga-aberto': {
        name: 'DAPE Sem Carga em Aberto',
        description: 'Relatório de DAPEs sem carga em aberto',
        fields: '001*,002,003*,018',
        icon: 'fa-exclamation-triangle',
        color: 'warning',
        category: 'comercial'
    },
    'relatorio-aeronaves': {
        name: 'Relatório de Aeronaves',
        description: 'Relatório de operações com aeronaves',
        fields: '001*,002*,003*,006,008,018',
        icon: 'fa-plane-departure',
        color: 'info',
        category: 'comercial'
    },
    'cargas-recebidas-natureza': {
        name: 'Cargas Recebidas por Natureza',
        description: 'Relatório de cargas recebidas por natureza',
        fields: '001*,002,003*,017,018',
        icon: 'fa-boxes',
        color: 'primary',
        category: 'comercial'
    },
    'visoes-gerenciais': {
        name: 'Visões Gerenciais',
        description: 'Relatório com visões gerenciais',
        fields: '001*,002*,003*,018',
        icon: 'fa-eye',
        color: 'dark',
        category: 'comercial'
    },
    'descontos': {
        name: 'Descontos',
        description: 'Relatório de descontos aplicados',
        fields: '001*,002*,003*,018',
        icon: 'fa-percentage',
        color: 'success',
        category: 'comercial'
    },

    // Relatórios de Faturamento
    'baixas-guias': {
        name: 'Baixas de Guias',
        description: 'Relatório de baixas de guias',
        fields: '001*,002*,003,018',
        icon: 'fa-file-invoice-dollar',
        color: 'success',
        category: 'faturamento'
    },
    'cargas-entregues-dta': {
        name: 'Cargas Entregues DTA',
        description: 'Relatório de cargas entregues com DTA',
        fields: '001*,002*,003,004,006,008,018',
        icon: 'fa-file-alt',
        color: 'info',
        category: 'faturamento'
    },
    'custodia': {
        name: 'Custódia',
        description: 'Relatório de custódia',
        fields: '001*,002,003*,018',
        icon: 'fa-shield-alt',
        color: 'warning',
        category: 'faturamento'
    },
    'custodia-estatistico-geral': {
        name: 'Custódia + Estatístico Geral',
        description: 'Relatório estatístico geral de custódia',
        fields: '001*,002,003*,017,018',
        icon: 'fa-chart-pie',
        color: 'primary',
        category: 'faturamento'
    },
    'cargas-recebidas': {
        name: 'Cargas Recebidas',
        description: 'Relatório de cargas recebidas',
        fields: '001*,002,003*,006,008,018',
        icon: 'fa-download',
        color: 'success',
        category: 'faturamento'
    },
    'processos-aprovados': {
        name: 'Processos Aprovados',
        description: 'Relatório de processos aprovados',
        fields: '001*,002*,003*,018',
        icon: 'fa-check-double',
        color: 'success',
        category: 'faturamento'
    },
    'repasse': {
        name: 'Repasse',
        description: 'Relatório de repasses',
        fields: '001*,002*,003*,018',
        icon: 'fa-exchange-alt',
        color: 'info',
        category: 'faturamento'
    },
    'demonstrativo-cargas-analitico': {
        name: 'Demonstrativo Cargas Analítico',
        description: 'Demonstrativo analítico de cargas',
        fields: '001*,002,003*,006,008,009,018',
        icon: 'fa-chart-line',
        color: 'primary',
        category: 'faturamento'
    },
    'dta': {
        name: 'DTA',
        description: 'Relatório de DTAs',
        fields: '001*,002*,003,004,018',
        icon: 'fa-file-export',
        color: 'info',
        category: 'faturamento'
    },
    'rtac': {
        name: 'RTAC',
        description: 'Relatório de RTACs',
        fields: '001*,002*,003*,018',
        icon: 'fa-file-import',
        color: 'warning',
        category: 'faturamento'
    },
    'processos-periodo': {
        name: 'Processos por Período',
        description: 'Relatório de processos por período',
        fields: '001*,002*,003*,018',
        icon: 'fa-calendar',
        color: 'info',
        category: 'faturamento'
    },
    'nd': {
        name: 'ND',
        description: 'Relatório de NDs',
        fields: '001*,002*,003*,018',
        icon: 'fa-file-signature',
        color: 'secondary',
        category: 'faturamento'
    },
    'guias-faturadas': {
        name: 'Guias Faturadas',
        description: 'Relatório de guias faturadas',
        fields: '001*,002*,003,018',
        icon: 'fa-check-circle',
        color: 'success',
        category: 'faturamento'
    },
    'guias-emitidas-funcionarios': {
        name: 'Guias Emitidas por Funcionários',
        description: 'Relatório de guias emitidas por funcionários',
        fields: '001*,002*,003,018',
        icon: 'fa-user-tie',
        color: 'info',
        category: 'faturamento'
    },
    'guias-canceladas': {
        name: 'Guias Canceladas',
        description: 'Relatório de guias canceladas',
        fields: '001*,002*,003*,018',
        icon: 'fa-times-circle',
        color: 'danger',
        category: 'faturamento'
    },
    'dsic': {
        name: 'DSIC',
        description: 'Relatório de DSICs',
        fields: '001*,002*,003*,018',
        icon: 'fa-file-code',
        color: 'warning',
        category: 'faturamento'
    },
    'seguro-cif': {
        name: 'SEGURO - CIF',
        description: 'Relatório de seguros CIF',
        fields: '001*,002*,003*,018',
        icon: 'fa-shield-alt',
        color: 'primary',
        category: 'faturamento'
    },
    'quantidade-guias-funcionarios': {
        name: 'Quantidade Guias por Funcionários',
        description: 'Relatório de quantidade de guias por funcionários',
        fields: '001*,002*,003,018',
        icon: 'fa-chart-bar',
        color: 'info',
        category: 'faturamento'
    },
    'guias-emitidas': {
        name: 'Guias Emitidas',
        description: 'Relatório de guias emitidas',
        fields: '001*,002*,003,018',
        icon: 'fa-file-invoice',
        color: 'success',
        category: 'faturamento'
    },
    'entregas-retroativas': {
        name: 'Entregas Retroativas',
        description: 'Relatório de entregas retroativas',
        fields: '001*,002*,003*,006,008,018',
        icon: 'fa-history',
        color: 'warning',
        category: 'faturamento'
    },
    'processos-despachante': {
        name: 'Processos x Despachante',
        description: 'Relatório de processos por despachante',
        fields: '001*,002*,003*,018',
        icon: 'fa-user-check',
        color: 'info',
        category: 'faturamento'
    },

    // Relatórios Financeiros
    'relatorio-pagamentos-divergentes': {
        name: 'Relatório de Pagamentos Divergentes',
        description: 'Relatório de pagamentos divergentes',
        fields: '001*,002*,003*,018',
        icon: 'fa-exclamation-triangle',
        color: 'warning',
        category: 'financeiro'
    },
    'pagamentos-duplicados': {
        name: 'Pagamentos Duplicados',
        description: 'Relatório de pagamentos duplicados',
        fields: '001*,002*,003*,018',
        icon: 'fa-copy',
        color: 'danger',
        category: 'financeiro'
    },
    'pagamentos-estornados': {
        name: 'Pagamentos Estornados',
        description: 'Relatório de pagamentos estornados',
        fields: '001*,002*,003*,018',
        icon: 'fa-undo',
        color: 'danger',
        category: 'financeiro'
    },
    'processos-cancelados': {
        name: 'Processos Cancelados',
        description: 'Relatório de processos cancelados',
        fields: '001*,002*,003*,018',
        icon: 'fa-ban',
        color: 'danger',
        category: 'financeiro'
    },
    'relatorio-recebimentos-competencia': {
        name: 'Relatório de Recebimentos por Competência',
        description: 'Relatório de recebimentos por competência',
        fields: '001*,002*,003*,018',
        icon: 'fa-calendar-check',
        color: 'success',
        category: 'financeiro'
    },

    // Relatórios Operacionais
    'operacoes-dia': {
        name: 'Operações do Dia',
        description: 'Relatório de operações do dia',
        fields: '001*,002*,003*,018',
        icon: 'fa-calendar-day',
        color: 'primary',
        category: 'operacional'
    },
    'movimentacao-cargas': {
        name: 'Movimentação de Cargas',
        description: 'Relatório de movimentação de cargas',
        fields: '001*,002*,003*,006,008,018',
        icon: 'fa-truck-moving',
        color: 'info',
        category: 'operacional'
    },
    'status-operacoes': {
        name: 'Status das Operações',
        description: 'Relatório de status das operações',
        fields: '001*,002*,003*,018',
        icon: 'fa-tasks',
        color: 'warning',
        category: 'operacional'
    },
    'tempo-operacao': {
        name: 'Tempo de Operação',
        description: 'Relatório de tempo de operação',
        fields: '001*,002*,003*,018',
        icon: 'fa-clock',
        color: 'info',
        category: 'operacional'
    },
    'produtividade': {
        name: 'Produtividade',
        description: 'Relatório de produtividade',
        fields: '001*,002*,003*,018',
        icon: 'fa-chart-line',
        color: 'success',
        category: 'operacional'
    },

    // Relatórios Gerenciais
    'dashboard-gerencial': {
        name: 'Dashboard Gerencial',
        description: 'Dashboard com indicadores gerenciais',
        fields: '001*,002*,003*,018',
        icon: 'fa-tachometer-alt',
        color: 'primary',
        category: 'gerencial'
    },
    'indicadores-kpi': {
        name: 'Indicadores KPI',
        description: 'Relatório de indicadores KPI',
        fields: '001*,002*,003*,018',
        icon: 'fa-chart-pie',
        color: 'info',
        category: 'gerencial'
    },
    'performance-equipe': {
        name: 'Performance da Equipe',
        description: 'Relatório de performance da equipe',
        fields: '001*,002*,003*,018',
        icon: 'fa-users',
        color: 'success',
        category: 'gerencial'
    },
    'analise-tendencias': {
        name: 'Análise de Tendências',
        description: 'Relatório de análise de tendências',
        fields: '001*,002*,003*,018',
        icon: 'fa-chart-area',
        color: 'warning',
        category: 'gerencial'
    },
    'relatorio-executivo': {
        name: 'Relatório Executivo',
        description: 'Relatório executivo consolidado',
        fields: '001*,002*,003*,018',
        icon: 'fa-briefcase',
        color: 'dark',
        category: 'gerencial'
    }
};

// Função para obter todos os relatórios organizados por categoria
window.getAllReportsByCategory = function() {
    const categories = {
        'comercial': [],
        'faturamento': [],
        'financeiro': [],
        'operacional': [],
        'gerencial': []
    };
    
    Object.keys(window.ALL_REPORTS_COMPLETE).forEach(key => {
        const report = window.ALL_REPORTS_COMPLETE[key];
        if (categories[report.category]) {
            categories[report.category].push({
                id: key,
                name: report.name,
                description: report.description,
                fields: report.fields,
                icon: report.icon,
                color: report.color
            });
        }
    });
    
    return categories;
};

// Função para obter todos os relatórios em formato de lista para dropdown
window.getAllReportsForDropdown = function() {
    const categories = window.getAllReportsByCategory();
    const result = [];
    
    Object.keys(categories).forEach(categoryName => {
        const categoryReports = categories[categoryName];
        if (categoryReports.length > 0) {
            result.push({
                group: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
                reports: categoryReports
            });
        }
    });
    
    return result;
};
