/**
 * Utilitários Centralizados para Relatórios
 * Funções comuns compartilhadas entre todos os módulos de relatórios
 */

// Obter colunas padrão para relatórios dinâmicos
function getDefaultColumns(reportType) {
    const defaultColumns = {
        'cargas-armazenadas-60': ['ID', 'Cliente', 'Data Armazenamento', 'Dias Armazenado', 'Status'],
        'cargas-consignatario': ['ID', 'Consignatário', 'Quantidade', 'Valor Total', 'Status'],
        'cargas-isencao': ['ID', 'Cliente', 'Tipo Isenção', 'Valor', 'Status'],
        'clientes-correntistas': ['ID', 'Cliente', 'Tipo', 'Status', 'Última Movimentação'],
        'dapes-sem-carga': ['ID', 'DAPES', 'Data Emissão', 'Status', 'Observações'],
        'demonstrativo-cargas': ['ID', 'Cliente', 'Tipo Carga', 'Quantidade', 'Valor'],
        'descontos': ['ID', 'Cliente', 'Tipo Desconto', 'Valor', 'Percentual'],
        'exportacoes': ['ID', 'Cliente', 'País Destino', 'Valor', 'Status'],
        'perfil-cliente': ['ID', 'Cliente', 'Segmento', 'Volume', 'Faturamento'],
        'vistorias': ['ID', 'Cliente', 'Data Vistoria', 'Tipo', 'Resultado'],
        'operacoes-dia': ['ID', 'Operação', 'Hora', 'Status', 'Responsável'],
        'movimentacao-cargas': ['ID', 'Carga', 'Origem', 'Destino', 'Status'],
        'status-operacoes': ['Operação', 'Status', 'Progresso', 'Próxima Ação'],
        'tempo-operacao': ['Operação', 'Tempo Médio', 'Tempo Mínimo', 'Tempo Máximo'],
        'produtividade': ['Funcionário', 'Operações', 'Eficiência', 'Meta'],
        'dashboard-gerencial': ['Indicador', 'Valor Atual', 'Meta', 'Status'],
        'indicadores-kpi': ['KPI', 'Valor', 'Tendência', 'Status'],
        'performance-equipe': ['Funcionário', 'Performance', 'Meta', 'Status'],
        'analise-tendencias': ['Período', 'Tendência', 'Projeção', 'Confiança'],
        'relatorio-executivo': ['Métrica', 'Valor', 'Comparação', 'Status'],
        'fluxo-caixa': ['Período', 'Entradas', 'Saídas', 'Saldo'],
        'receitas-despesas': ['Categoria', 'Receitas', 'Despesas', 'Saldo'],
        'contas-pagar': ['Fornecedor', 'Valor', 'Vencimento', 'Status'],
        'contas-receber': ['Cliente', 'Valor', 'Vencimento', 'Status'],
        'balanco-mensal': ['Conta', 'Saldo Anterior', 'Movimentação', 'Saldo Atual'],
        'baixas-guias': ['ID', 'Guia', 'Data Baixa', 'Valor', 'Status'],
        'cargas-entregues': ['ID', 'Cliente', 'Data Entrega', 'Valor', 'Status'],
        'cargas-entregues-dta': ['ID', 'DTA', 'Cliente', 'Data Entrega', 'Valor'],
        'cargas-recebidas-natureza': ['ID', 'Natureza', 'Cliente', 'Data Recebimento', 'Valor'],
        'custodia': ['ID', 'Cliente', 'Data Entrada', 'Tipo Custódia', 'Status'],
        'guias-canceladas': ['ID', 'Guia', 'Data Cancelamento', 'Motivo', 'Status'],
        'guias-emitidas-funcionarios': ['Funcionário', 'Quantidade', 'Período', 'Valor Total'],
        'guias-faturadas': ['ID', 'Guia', 'Data Faturamento', 'Valor', 'Status'],
        'pagamentos-estornados': ['ID', 'Cliente', 'Data Estorno', 'Valor', 'Motivo'],
        'processos-cancelados': ['ID', 'Processo', 'Data Cancelamento', 'Motivo', 'Status'],
        'quantidade-guias-funcionarios': ['Funcionário', 'Quantidade', 'Período', 'Média Diária'],
        'relatorio-pagamentos-divergentes': ['ID', 'Cliente', 'Valor Esperado', 'Valor Pago', 'Diferença'],
        'servicos-faturamento': ['Serviço', 'Quantidade', 'Valor Unitário', 'Total'],
        'validacao-cobrancas-esperadas': ['ID', 'Cliente', 'Valor Esperado', 'Status', 'Observações'],
        'validacao-guias-pos-fechamento': ['ID', 'Guia', 'Data Fechamento', 'Status', 'Observações'],
        'validacao-guias-pre-fechamento': ['ID', 'Guia', 'Data Validação', 'Status', 'Próxima Ação']
    };
    
    return defaultColumns[reportType] || ['ID', 'Descrição', 'Valor', 'Status', 'Data'];
}

// Obter dados de exemplo para relatórios dinâmicos
function getDefaultSampleData(reportType) {
    const defaultData = {
        'cargas-armazenadas-60': [
            ['001', 'Empresa ABC Ltda', '2024-01-15', '75 dias', 'Armazenada'],
            ['002', 'Comércio XYZ S/A', '2024-01-20', '65 dias', 'Armazenada'],
            ['003', 'Indústria DEF Ltda', '2024-01-25', '70 dias', 'Armazenada']
        ],
        'cargas-consignatario': [
            ['001', 'Consignatário A', '15', 'R$ 45.000,00', 'Ativo'],
            ['002', 'Consignatário B', '8', 'R$ 24.000,00', 'Ativo'],
            ['003', 'Consignatário C', '12', 'R$ 36.000,00', 'Ativo']
        ],
        'cargas-isencao': [
            ['001', 'Empresa ABC Ltda', 'Isenção Fiscal', 'R$ 5.000,00', 'Aprovada'],
            ['002', 'Comércio XYZ S/A', 'Isenção Tributária', 'R$ 3.500,00', 'Pendente'],
            ['003', 'Indústria DEF Ltda', 'Isenção Aduaneira', 'R$ 7.200,00', 'Aprovada']
        ],
        'operacoes-dia': [
            ['001', 'Descarga Caminhão', '08:30', 'Concluída', 'João Silva'],
            ['002', 'Carregamento', '10:15', 'Em Andamento', 'Maria Santos'],
            ['003', 'Vistoria', '14:20', 'Pendente', 'Pedro Costa']
        ],
        'movimentacao-cargas': [
            ['001', 'C-2024-001', 'Portão A', 'Área 1', 'Movimentada'],
            ['002', 'C-2024-002', 'Área 2', 'Portão B', 'Em Movimento'],
            ['003', 'C-2024-003', 'Área 3', 'Área 1', 'Pendente']
        ],
        'status-operacoes': [
            ['Descarga', 'Em Andamento', '75%', 'Finalizar descarga'],
            ['Carregamento', 'Aguardando', '0%', 'Aguardar liberação'],
            ['Vistoria', 'Concluída', '100%', 'Arquivar documentos']
        ],
        'tempo-operacao': [
            ['Descarga', '45 min', '30 min', '60 min'],
            ['Carregamento', '35 min', '25 min', '50 min'],
            ['Vistoria', '20 min', '15 min', '30 min']
        ],
        'produtividade': [
            ['João Silva', '25', '95%', '100%'],
            ['Maria Santos', '22', '88%', '100%'],
            ['Pedro Costa', '28', '112%', '100%']
        ],
        'dashboard-gerencial': [
            ['Produtividade', '95%', '100%', 'Abaixo da Meta'],
            ['Eficiência', '88%', '90%', 'Abaixo da Meta'],
            ['Satisfação', '92%', '95%', 'Abaixo da Meta']
        ],
        'indicadores-kpi': [
            ['Tempo Médio Operação', '45 min', '↗', 'Atenção'],
            ['Taxa de Ocupação', '78%', '↗', 'Bom'],
            ['Satisfação Cliente', '4.2/5', '↗', 'Excelente']
        ],
        'performance-equipe': [
            ['João Silva', '95%', '100%', 'Abaixo da Meta'],
            ['Maria Santos', '105%', '100%', 'Acima da Meta'],
            ['Pedro Costa', '98%', '100%', 'Abaixo da Meta']
        ],
        'analise-tendencias': [
            ['Q1 2024', 'Crescimento', '+15%', '85%'],
            ['Q2 2024', 'Estabilidade', '+5%', '70%'],
            ['Q3 2024', 'Crescimento', '+20%', '90%']
        ],
        'relatorio-executivo': [
            ['Receita Total', 'R$ 1.250.000', '+12% vs mês anterior', 'Positivo'],
            ['Custos Operacionais', 'R$ 850.000', '+8% vs mês anterior', 'Atenção'],
            ['Margem de Lucro', '32%', '+4% vs mês anterior', 'Positivo']
        ],
        'fluxo-caixa': [
            ['Janeiro 2024', 'R$ 1.250.000', 'R$ 850.000', 'R$ 400.000'],
            ['Fevereiro 2024', 'R$ 1.180.000', 'R$ 920.000', 'R$ 260.000'],
            ['Março 2024', 'R$ 1.350.000', 'R$ 780.000', 'R$ 570.000']
        ],
        'receitas-despesas': [
            ['Operacional', 'R$ 1.200.000', 'R$ 800.000', 'R$ 400.000'],
            ['Administrativo', 'R$ 0', 'R$ 150.000', 'R$ -150.000'],
            ['Financeiro', 'R$ 50.000', 'R$ 20.000', 'R$ 30.000']
        ],
        'contas-pagar': [
            ['Fornecedor A', 'R$ 25.000', '15/02/2024', 'Pendente'],
            ['Fornecedor B', 'R$ 18.500', '20/02/2024', 'Pago'],
            ['Fornecedor C', 'R$ 32.000', '25/02/2024', 'Pendente']
        ],
        'contas-receber': [
            ['Cliente A', 'R$ 45.000', '10/02/2024', 'Recebido'],
            ['Cliente B', 'R$ 38.000', '15/02/2024', 'Pendente'],
            ['Cliente C', 'R$ 52.000', '20/02/2024', 'Pendente']
        ],
        'balanco-mensal': [
            ['Caixa', 'R$ 100.000', '+R$ 50.000', 'R$ 150.000'],
            ['Bancos', 'R$ 500.000', '-R$ 30.000', 'R$ 470.000'],
            ['Estoque', 'R$ 200.000', '+R$ 25.000', 'R$ 225.000']
        ],
        'baixas-guias': [
            ['001', 'GUI-2024-001', '2024-01-15', 'R$ 1.500,00', 'Baixada'],
            ['002', 'GUI-2024-002', '2024-01-20', 'R$ 2.300,00', 'Baixada'],
            ['003', 'GUI-2024-003', '2024-01-25', 'R$ 1.800,00', 'Baixada']
        ],
        'cargas-entregues': [
            ['001', 'Empresa ABC Ltda', '2024-01-15', 'R$ 5.000,00', 'Entregue'],
            ['002', 'Comércio XYZ S/A', '2024-01-20', 'R$ 3.500,00', 'Entregue'],
            ['003', 'Indústria DEF Ltda', '2024-01-25', 'R$ 4.200,00', 'Entregue']
        ],
        'cargas-entregues-dta': [
            ['001', 'DTA-2024-001', 'Empresa ABC Ltda', '2024-01-15', 'R$ 5.000,00'],
            ['002', 'DTA-2024-002', 'Comércio XYZ S/A', '2024-01-20', 'R$ 3.500,00'],
            ['003', 'DTA-2024-003', 'Indústria DEF Ltda', '2024-01-25', 'R$ 4.200,00']
        ],
        'cargas-recebidas-natureza': [
            ['001', 'Importação', 'Empresa ABC Ltda', '2024-01-15', 'R$ 5.000,00'],
            ['002', 'Exportação', 'Comércio XYZ S/A', '2024-01-20', 'R$ 3.500,00'],
            ['003', 'Nacional', 'Indústria DEF Ltda', '2024-01-25', 'R$ 4.200,00']
        ],
        'custodia': [
            ['001', 'Empresa ABC Ltda', '2024-01-15', 'Custódia Judicial', 'Ativa'],
            ['002', 'Comércio XYZ S/A', '2024-01-20', 'Custódia Administrativa', 'Ativa'],
            ['003', 'Indústria DEF Ltda', '2024-01-25', 'Custódia Fiscal', 'Ativa']
        ],
        'guias-canceladas': [
            ['001', 'GUI-2024-001', '2024-01-15', 'Erro de digitação', 'Cancelada'],
            ['002', 'GUI-2024-002', '2024-01-20', 'Cliente desistiu', 'Cancelada'],
            ['003', 'GUI-2024-003', '2024-01-25', 'Documentação incompleta', 'Cancelada']
        ],
        'guias-emitidas-funcionarios': [
            ['João Silva', '25', 'Janeiro 2024', 'R$ 15.000,00'],
            ['Maria Santos', '18', 'Janeiro 2024', 'R$ 12.500,00'],
            ['Pedro Costa', '22', 'Janeiro 2024', 'R$ 18.200,00']
        ],
        'guias-faturadas': [
            ['001', 'GUI-2024-001', '2024-01-15', 'R$ 1.500,00', 'Faturada'],
            ['002', 'GUI-2024-002', '2024-01-20', 'R$ 2.300,00', 'Faturada'],
            ['003', 'GUI-2024-003', '2024-01-25', 'R$ 1.800,00', 'Faturada']
        ],
        'pagamentos-estornados': [
            ['001', 'Empresa ABC Ltda', '2024-01-15', 'R$ 1.500,00', 'Erro de processamento'],
            ['002', 'Comércio XYZ S/A', '2024-01-20', 'R$ 2.300,00', 'Solicitação do cliente'],
            ['003', 'Indústria DEF Ltda', '2024-01-25', 'R$ 1.800,00', 'Duplicidade']
        ],
        'processos-cancelados': [
            ['001', 'PROC-2024-001', '2024-01-15', 'Documentação incompleta', 'Cancelado'],
            ['002', 'PROC-2024-002', '2024-01-20', 'Cliente desistiu', 'Cancelado'],
            ['003', 'PROC-2024-003', '2024-01-25', 'Prazo vencido', 'Cancelado']
        ],
        'quantidade-guias-funcionarios': [
            ['João Silva', '150', 'Janeiro 2024', '5.0'],
            ['Maria Santos', '120', 'Janeiro 2024', '4.0'],
            ['Pedro Costa', '180', 'Janeiro 2024', '6.0']
        ],
        'relatorio-pagamentos-divergentes': [
            ['001', 'Empresa ABC Ltda', 'R$ 1.500,00', 'R$ 1.450,00', 'R$ -50,00'],
            ['002', 'Comércio XYZ S/A', 'R$ 2.300,00', 'R$ 2.350,00', 'R$ 50,00'],
            ['003', 'Indústria DEF Ltda', 'R$ 1.800,00', 'R$ 1.800,00', 'R$ 0,00']
        ],
        'servicos-faturamento': [
            ['Armazenagem', '150', 'R$ 50,00', 'R$ 7.500,00'],
            ['Movimentação', '300', 'R$ 25,00', 'R$ 7.500,00'],
            ['Inspeção', '75', 'R$ 100,00', 'R$ 7.500,00']
        ],
        'validacao-cobrancas-esperadas': [
            ['001', 'Empresa ABC Ltda', 'R$ 1.500,00', 'Validado', 'OK'],
            ['002', 'Comércio XYZ S/A', 'R$ 2.300,00', 'Pendente', 'Aguardando documentação'],
            ['003', 'Indústria DEF Ltda', 'R$ 1.800,00', 'Divergente', 'Valor diferente']
        ],
        'validacao-guias-pos-fechamento': [
            ['001', 'GUI-2024-001', '2024-01-15', 'Validada', 'Processo concluído'],
            ['002', 'GUI-2024-002', '2024-01-20', 'Pendente', 'Aguardando aprovação'],
            ['003', 'GUI-2024-003', '2024-01-25', 'Rejeitada', 'Documentação incompleta']
        ],
        'validacao-guias-pre-fechamento': [
            ['001', 'GUI-2024-001', '2024-01-15', 'Aprovada', 'Fechar processo'],
            ['002', 'GUI-2024-002', '2024-01-20', 'Pendente', 'Aguardar documentos'],
            ['003', 'GUI-2024-003', '2024-01-25', 'Rejeitada', 'Corrigir inconsistências']
        ]
    };
    
    return defaultData[reportType] || [
        ['001', 'Item 1', 'R$ 1.000,00', 'Ativo', '2024-01-15'],
        ['002', 'Item 2', 'R$ 2.000,00', 'Ativo', '2024-01-20'],
        ['003', 'Item 3', 'R$ 1.500,00', 'Ativo', '2024-01-25']
    ];
}

// Função centralizada para obter dados de relatório
function getReportDataFromCentral(reportType) {
    if (window.ALL_REPORTS_DATA && window.ALL_REPORTS_DATA[reportType]) {
        const reportData = window.ALL_REPORTS_DATA[reportType];
        return {
            name: reportData.name,
            description: reportData.description || 'Relatório personalizado',
            fields: reportData.fields,
            icon: reportData.icon,
            color: reportData.color,
            columns: getDefaultColumns(reportType),
            sampleData: getDefaultSampleData(reportType)
        };
    }
    return null;
}

// Função centralizada para atualizar seção de favoritos
function updateFavoritesSectionCentral(favorites, containerId, moduleName) {
    const section = document.getElementById('favorites-section');
    const container = document.getElementById(containerId);
    
    if (favorites.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    container.innerHTML = '';
    
    favorites.forEach(reportType => {
        let report = getReportDataFromCentral(reportType);
        
        if (!report) {
            // Fallback para dados locais específicos do módulo
            const localData = window[`${moduleName}ReportsData`];
            if (localData && localData[reportType]) {
                report = localData[reportType];
            }
        }
        
        if (report) {
            const card = createFavoriteCardCentral(reportType, report);
            container.appendChild(card);
        }
    });
}

// Função centralizada para criar card de favorito
function createFavoriteCardCentral(reportType, report) {
    const card = document.createElement('div');
    card.className = 'favorite-card';
    card.innerHTML = `
        <div class="favorite-content">
            <div class="favorite-icon">
                <i class="fas ${report.icon}"></i>
            </div>
            <div class="favorite-info">
                <h6>${report.name}</h6>
                <p>${report.description}</p>
            </div>
        </div>
        <div class="favorite-actions">
            <button class="btn btn-sm btn-primary" onclick="openReport('${reportType}')" title="Abrir relatório">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="toggleFavorite('${reportType}')" title="Remover dos favoritos">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    return card;
}

// Exportar funções para uso global
window.getDefaultColumns = getDefaultColumns;
window.getDefaultSampleData = getDefaultSampleData;
window.getReportDataFromCentral = getReportDataFromCentral;
window.updateFavoritesSectionCentral = updateFavoritesSectionCentral;
window.createFavoriteCardCentral = createFavoriteCardCentral;
