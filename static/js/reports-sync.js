/**
 * Sistema de Sincronização Automática de Relatórios
 * Sincroniza automaticamente relatórios configurados com os módulos correspondentes
 */

class ReportsSyncManager {
    constructor() {
        this.modules = {
            'faturamento': {
                configKey: 'faturamentoReports',
                moduleSelector: '#reportsGrid',
                dropdownSelector: '#reportSelect'
            },
            'comercial': {
                configKey: 'comercialReports',
                moduleSelector: '.reports-grid',
                dropdownSelector: '#reportSelect'
            },
            'operacional': {
                configKey: 'operacionalReports',
                moduleSelector: '.reports-grid',
                dropdownSelector: '#reportSelect'
            },
            'gerencial': {
                configKey: 'gerencialReports',
                moduleSelector: '.reports-grid',
                dropdownSelector: '#reportSelect'
            },
            'financeiro': {
                configKey: 'financeiroReports',
                moduleSelector: '.reports-grid',
                dropdownSelector: '#reportSelect'
            }
        };
        
        this.init();
    }

    init() {
        // Verificar se estamos em uma página de módulo de relatórios
        if (this.isReportsModulePage()) {
            this.loadModuleReports();
        }
        
        // Verificar se estamos em uma página de configuração
        if (this.isConfigPage()) {
            this.setupConfigSync();
        }
    }

    isReportsModulePage() {
        return document.querySelector('.reports-grid') !== null;
    }

    isConfigPage() {
        return document.querySelector('.reports-config-section') !== null;
    }

    getCurrentModule() {
        const path = window.location.pathname;
        if (path.includes('/relatorios/faturamento')) return 'faturamento';
        if (path.includes('/relatorios/comercial')) return 'comercial';
        if (path.includes('/relatorios/operacional')) return 'operacional';
        if (path.includes('/relatorios/gerencial')) return 'gerencial';
        if (path.includes('/relatorios/financeiro')) return 'financeiro';
        return null;
    }

    getCurrentConfigModule() {
        const path = window.location.pathname;
        if (path.includes('/relatorios/configuracao/faturamento')) return 'faturamento';
        if (path.includes('/relatorios/configuracao/comercial')) return 'comercial';
        if (path.includes('/relatorios/configuracao/operacional')) return 'operacional';
        if (path.includes('/relatorios/configuracao/gerencial')) return 'gerencial';
        if (path.includes('/relatorios/configuracao/financeiro')) return 'financeiro';
        return null;
    }

    loadModuleReports(moduleName = null) {
        const module = moduleName || this.getCurrentModule();
        if (!module) return;

        const config = this.modules[module];
        const savedReports = localStorage.getItem(config.configKey);
        
        if (savedReports) {
            const reports = JSON.parse(savedReports);
            this.updateModuleDropdown(reports, config.dropdownSelector);
            this.updateModuleCards(reports, config.moduleSelector, module);
        } else {
            // Carregar relatórios padrão se não houver configuração
            this.loadDefaultReports(module);
        }
    }

    loadDefaultReports(module) {
        const defaultReports = this.getDefaultReports(module);
        const config = this.modules[module];
        
        // Salvar relatórios padrão
        localStorage.setItem(config.configKey, JSON.stringify(defaultReports));
        
        // Atualizar interface
        this.updateModuleDropdown(defaultReports, config.dropdownSelector);
        this.updateModuleCards(defaultReports, config.moduleSelector, module);
    }

    getDefaultReports(module) {
        const defaults = {
            'faturamento': [
                { id: 'baixas-guias', name: 'Baixas de Guias', fields: '001*,002*,003,018' },
                { id: 'cargas-entregues', name: 'Cargas Entregues', fields: '001*,002*,003*,006,008,009,011,018' },
                { id: 'cargas-entregues-dta', name: 'Cargas Entregues DTA', fields: '001*,002*,003,004,006,008,018' },
                { id: 'cargas-recebidas-natureza', name: 'Cargas Recebidas por Natureza', fields: '001*,002,003*,017,018' },
                { id: 'custodia', name: 'Custódia', fields: '001*,002,003*,018' },
                { id: 'guias-canceladas', name: 'Guias Canceladas', fields: '001*,002*,003*,018' },
                { id: 'guias-emitidas-funcionarios', name: 'Guias Emitidas por Funcionários', fields: '001*,002*,003,018' },
                { id: 'guias-faturadas', name: 'Guias Faturadas', fields: '001*,002*,003,018' },
                { id: 'pagamentos-estornados', name: 'Pagamentos Estornados', fields: '001*,002*,003*,018' },
                { id: 'processos-cancelados', name: 'Processos Cancelados', fields: '001*,002*,003*,018' },
                { id: 'quantidade-guias-funcionarios', name: 'Quantidade Guias por Funcionários', fields: '001*,002*,003,018' },
                { id: 'relatorio-pagamentos-divergentes', name: 'Relatório de Pagamentos Divergentes', fields: '001*,002*,003*,018' },
                { id: 'servicos-faturamento', name: 'Serviços x Faturamento', fields: '001*,002*,003*,006,007,008,009,018' },
                { id: 'validacao-cobrancas-esperadas', name: 'Validação Cobranças Esperadas', fields: '001*,002*,003*,018' },
                { id: 'validacao-guias-pos-fechamento', name: 'Validação Guias Pós-Fechamento', fields: '001*,002*,003*,018' },
                { id: 'validacao-guias-pre-fechamento', name: 'Validação Guias Pré-Fechamento', fields: '001*,002*,003*,018' }
            ],
            'comercial': [
                { id: 'cargas-armazenadas-60', name: 'Cargas Armazenadas +60 Dias', fields: '001*,002*,003,018' },
                { id: 'cargas-consignatario', name: 'Cargas Armazenadas por Consignatário', fields: '001*,002*,003*,009' },
                { id: 'cargas-isencao', name: 'Cargas com Isenção', fields: '001*,002,003*,018,006,008' },
                { id: 'cargas-entregues', name: 'Cargas Entregues', fields: '001*,002*,003*,004,006,008,009,014,018' },
                { id: 'cargas-entregues-processo', name: 'Cargas Entregues (Processo)', fields: '001*,002*,003*,004,006,008,009,014,018' },
                { id: 'cargas-entregues-dta', name: 'Cargas Entregues DTA', fields: '001*,002*,003,004,006,008,018' },
                { id: 'clientes-correntistas', name: 'Clientes Correntistas', fields: '001*,002*,003,006,008,018' },
                { id: 'custodia', name: 'Custódia', fields: '001*,002,003*,018,006,008,009' },
                { id: 'dapes-sem-carga', name: 'DAPES Sem Carga em Aberto', fields: '001*,002*,003,006,008,007,018' },
                { id: 'demonstrativo-cargas', name: 'Demonstrativo Cargas Analítico', fields: '001*,002,003*,018' },
                { id: 'descontos', name: 'Descontos', fields: '001*,002,003,018,006,008' },
                { id: 'exportacoes', name: 'Exportações', fields: '001*,002*,003,006,008,018,027' },
                { id: 'perfil-cliente', name: 'Perfil de Cliente', fields: '001*,002,003,006,008,018,024,025' },
                { id: 'servicos-faturamento', name: 'Serviços x Faturamento', fields: '001*,002*,003,006,007,008,009,018' },
                { id: 'vistorias', name: 'Vistorias', fields: '001*,002,003,018,006,008,021' }
            ],
            'operacional': [
                { id: 'operacoes-dia', name: 'Operações do Dia', fields: '001*,002*,003,018' },
                { id: 'movimentacao-cargas', name: 'Movimentação de Cargas', fields: '001*,002*,003*,006,008,009,018' },
                { id: 'status-operacoes', name: 'Status das Operações', fields: '001*,002*,003*,018' },
                { id: 'tempo-operacao', name: 'Tempo de Operação', fields: '001*,002*,003,006,008,018' },
                { id: 'produtividade', name: 'Produtividade', fields: '001*,002*,003,006,007,008,018' }
            ],
            'gerencial': [
                { id: 'dashboard-gerencial', name: 'Dashboard Gerencial', fields: '001*,002*,003,006,007,008,018' },
                { id: 'indicadores-kpi', name: 'Indicadores KPI', fields: '001*,002*,003,006,007,008,018' },
                { id: 'performance-equipe', name: 'Performance da Equipe', fields: '001*,002*,003,006,008,018' },
                { id: 'analise-tendencias', name: 'Análise de Tendências', fields: '001*,002*,003,006,007,008,018' },
                { id: 'relatorio-executivo', name: 'Relatório Executivo', fields: '001*,002*,003,006,007,008,009,018' }
            ],
            'financeiro': [
                { id: 'fluxo-caixa', name: 'Fluxo de Caixa', fields: '001*,002*,003,006,007,008,018' },
                { id: 'receitas-despesas', name: 'Receitas e Despesas', fields: '001*,002*,003,006,007,008,018' },
                { id: 'contas-pagar', name: 'Contas a Pagar', fields: '001*,002*,003,006,008,018' },
                { id: 'contas-receber', name: 'Contas a Receber', fields: '001*,002*,003,006,008,018' },
                { id: 'balanco-mensal', name: 'Balanço Mensal', fields: '001*,002*,003,006,007,008,018' }
            ]
        };
        
        return defaults[module] || [];
    }

    updateModuleDropdown(reports, dropdownSelector) {
        const select = document.querySelector(dropdownSelector);
        if (!select) return;

        select.innerHTML = '<option value="">Selecione...</option>';
        
        reports.forEach(report => {
            const option = document.createElement('option');
            option.value = report.id;
            option.textContent = report.name;
            select.appendChild(option);
        });
    }

    updateModuleCards(reports, gridSelector, module) {
        const grid = document.querySelector(gridSelector);
        if (!grid) return;

        grid.innerHTML = '';
        
        reports.forEach(report => {
            const card = this.createReportCard(report, module);
            grid.appendChild(card);
        });
    }

    createReportCard(report, module) {
        const card = document.createElement('div');
        card.className = 'report-card';
        card.setAttribute('data-report', report.id);
        
        // Obter dados do relatório (ícone, cor, etc.)
        const reportData = this.getReportData(report.id, module);
        
        card.innerHTML = `
            <div class="report-header">
                <button class="btn-favorite" onclick="toggleFavorite('${report.id}')" title="Adicionar aos favoritos">
                    <i class="far fa-star"></i>
                </button>
            </div>
            <div class="report-icon">
                <i class="fas ${reportData.icon}"></i>
            </div>
            <div class="report-content">
                <h4>${report.name}</h4>
                <p>${reportData.description}</p>
                <div class="report-stats">
                    <span class="stat-item">
                        <i class="fas fa-cog text-info"></i>
                        Campos: ${report.fields}
                    </span>
                </div>
            </div>
            <div class="report-actions">
                <button class="btn btn-primary btn-sm" onclick="openReport('${report.id}')">
                    <i class="fas fa-eye"></i> Visualizar
                </button>
                <button class="btn btn-outline-primary btn-sm" onclick="exportReport('${report.id}')">
                    <i class="fas fa-download"></i> Exportar
                </button>
            </div>
        `;
        
        return card;
    }

    getReportData(reportId, module) {
        // Dados base para cada módulo
        const reportData = {
            'faturamento': {
                'baixas-guias': { icon: 'fa-file-invoice-dollar', color: 'success', description: 'Relatório de baixas de guias de faturamento' },
                'cargas-entregues': { icon: 'fa-truck', color: 'primary', description: 'Relatório de cargas entregues para faturamento' },
                'cargas-entregues-dta': { icon: 'fa-file-alt', color: 'info', description: 'Relatório de cargas entregues com DTA' },
                'cargas-recebidas-natureza': { icon: 'fa-warehouse', color: 'warning', description: 'Relatório de cargas recebidas por natureza' },
                'custodia': { icon: 'fa-shield-alt', color: 'warning', description: 'Relatório de cargas em custódia' },
                'guias-canceladas': { icon: 'fa-times-circle', color: 'danger', description: 'Relatório de guias canceladas' },
                'guias-emitidas-funcionarios': { icon: 'fa-user-tie', color: 'info', description: 'Relatório de guias emitidas por funcionários' },
                'guias-faturadas': { icon: 'fa-check-circle', color: 'success', description: 'Relatório de guias que foram faturadas' },
                'pagamentos-estornados': { icon: 'fa-undo', color: 'danger', description: 'Relatório de pagamentos estornados' },
                'processos-cancelados': { icon: 'fa-ban', color: 'danger', description: 'Relatório de processos cancelados' },
                'quantidade-guias-funcionarios': { icon: 'fa-chart-bar', color: 'info', description: 'Relatório de quantidade de guias por funcionários' },
                'relatorio-pagamentos-divergentes': { icon: 'fa-exclamation-triangle', color: 'warning', description: 'Relatório de pagamentos com divergências' },
                'servicos-faturamento': { icon: 'fa-calculator', color: 'success', description: 'Análise de serviços versus faturamento' },
                'validacao-cobrancas-esperadas': { icon: 'fa-search-dollar', color: 'primary', description: 'Relatório de validação de cobranças esperadas' },
                'validacao-guias-pos-fechamento': { icon: 'fa-clipboard-check', color: 'info', description: 'Relatório de validação de guias pós-fechamento' },
                'validacao-guias-pre-fechamento': { icon: 'fa-clipboard-list', color: 'warning', description: 'Relatório de validação de guias pré-fechamento' }
            },
            'comercial': {
                'cargas-armazenadas-60': { icon: 'fa-warehouse', color: 'warning', description: 'Relatório de cargas armazenadas há mais de 60 dias' },
                'cargas-consignatario': { icon: 'fa-building', color: 'info', description: 'Análise de cargas agrupadas por consignatário' },
                'cargas-isencao': { icon: 'fa-gift', color: 'success', description: 'Relatório de cargas com isenção fiscal aplicada' },
                'cargas-entregues': { icon: 'fa-truck', color: 'success', description: 'Relatório de cargas entregues aos clientes' },
                'cargas-entregues-processo': { icon: 'fa-cogs', color: 'primary', description: 'Relatório de cargas entregues por processo' },
                'cargas-entregues-dta': { icon: 'fa-file-alt', color: 'info', description: 'Relatório de cargas entregues com DTA' },
                'clientes-correntistas': { icon: 'fa-user-tie', color: 'primary', description: 'Relatório de clientes correntistas do sistema' },
                'custodia': { icon: 'fa-shield-alt', color: 'warning', description: 'Relatório de cargas em custódia' },
                'dapes-sem-carga': { icon: 'fa-exclamation-triangle', color: 'danger', description: 'Relatório de DAPES sem carga em aberto' },
                'demonstrativo-cargas': { icon: 'fa-chart-pie', color: 'info', description: 'Demonstrativo analítico de cargas' },
                'descontos': { icon: 'fa-percent', color: 'success', description: 'Relatório de descontos aplicados' },
                'exportacoes': { icon: 'fa-ship', color: 'primary', description: 'Relatório de operações de exportação' },
                'perfil-cliente': { icon: 'fa-user-circle', color: 'info', description: 'Relatório de perfil dos clientes' },
                'servicos-faturamento': { icon: 'fa-calculator', color: 'success', description: 'Relatório de serviços versus faturamento' },
                'vistorias': { icon: 'fa-search', color: 'warning', description: 'Relatório de vistorias realizadas' }
            },
            'operacional': {
                'operacoes-dia': { icon: 'fa-calendar-day', color: 'primary', description: 'Relatório de operações realizadas no dia' },
                'movimentacao-cargas': { icon: 'fa-truck-loading', color: 'info', description: 'Relatório de movimentação de cargas no terminal' },
                'status-operacoes': { icon: 'fa-tasks', color: 'warning', description: 'Relatório de status atual das operações' },
                'tempo-operacao': { icon: 'fa-clock', color: 'primary', description: 'Relatório de tempo médio de operações' },
                'produtividade': { icon: 'fa-chart-line', color: 'primary', description: 'Relatório de produtividade da equipe' }
            },
            'gerencial': {
                'dashboard-gerencial': { icon: 'fa-tachometer-alt', color: 'primary', description: 'Dashboard com indicadores gerenciais principais' },
                'indicadores-kpi': { icon: 'fa-chart-bar', color: 'info', description: 'Relatório de indicadores-chave de performance' },
                'performance-equipe': { icon: 'fa-users', color: 'success', description: 'Relatório de performance individual e da equipe' },
                'analise-tendencias': { icon: 'fa-chart-line', color: 'warning', description: 'Análise de tendências e projeções' },
                'relatorio-executivo': { icon: 'fa-file-alt', color: 'primary', description: 'Relatório executivo consolidado' }
            },
            'financeiro': {
                'fluxo-caixa': { icon: 'fa-money-bill-wave', color: 'primary', description: 'Relatório de fluxo de caixa mensal' },
                'receitas-despesas': { icon: 'fa-chart-pie', color: 'info', description: 'Relatório de receitas e despesas por categoria' },
                'contas-pagar': { icon: 'fa-credit-card', color: 'warning', description: 'Relatório de contas a pagar' },
                'contas-receber': { icon: 'fa-hand-holding-usd', color: 'primary', description: 'Relatório de contas a receber' },
                'balanco-mensal': { icon: 'fa-balance-scale', color: 'primary', description: 'Relatório de balanço mensal consolidado' }
            }
        };
        
        return reportData[module]?.[reportId] || {
            icon: 'fa-file-alt',
            color: 'primary',
            description: 'Relatório personalizado'
        };
    }

    setupConfigSync() {
        const module = this.getCurrentConfigModule();
        if (!module) return;

        // Observar mudanças no localStorage
        this.observeStorageChanges(module);
        
        // Interceptar funções de salvar do configurador
        this.interceptConfigSave(module);
    }

    observeStorageChanges(module) {
        const originalSetItem = localStorage.setItem;
        const self = this;
        
        localStorage.setItem = function(key, value) {
            originalSetItem.apply(this, arguments);
            
            // Verificar se é uma mudança de relatórios
            if (key === self.modules[module]?.configKey) {
                self.notifyModulesUpdate(module, value);
            }
        };
    }

    interceptConfigSave(module) {
        // Interceptar função de salvar do configurador
        const originalSaveReports = window.saveReports;
        if (originalSaveReports) {
            window.saveReports = function() {
                originalSaveReports.apply(this, arguments);
                
                // Notificar outros módulos sobre a mudança
                const reports = JSON.parse(localStorage.getItem(self.modules[module].configKey) || '[]');
                self.notifyModulesUpdate(module, JSON.stringify(reports));
            };
        }
    }

    notifyModulesUpdate(module, reportsData) {
        // Disparar evento customizado para notificar outros módulos
        const event = new CustomEvent('reportsUpdated', {
            detail: {
                module: module,
                reports: JSON.parse(reportsData)
            }
        });
        
        window.dispatchEvent(event);
    }

    // Método público para forçar sincronização
    forceSync(module) {
        if (module) {
            this.loadModuleReports(module);
        } else {
            // Sincronizar todos os módulos
            Object.keys(this.modules).forEach(mod => {
                this.loadModuleReports(mod);
            });
        }
    }
}

// Inicializar o sistema de sincronização
const reportsSync = new ReportsSyncManager();

// Escutar eventos de atualização
window.addEventListener('reportsUpdated', function(event) {
    const { module, reports } = event.detail;
    console.log(`Relatórios atualizados para módulo ${module}:`, reports);
    
    // Recarregar a página se estivermos no módulo correspondente
    const currentModule = reportsSync.getCurrentModule();
    if (currentModule === module) {
        location.reload();
    }
});

// Exportar para uso global
window.ReportsSyncManager = ReportsSyncManager;
window.reportsSync = reportsSync;
