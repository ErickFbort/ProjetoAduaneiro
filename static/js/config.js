// Configuração centralizada do Sistema Aduaneiro

const AppConfig = {
    // Configuração dos módulos da sidebar
    modules: {
        cadastros: {
            name: 'Cadastros',
            icon: 'fas fa-edit',
            routes: [
                { path: '/cadastros/usuarios', name: 'Usuários', icon: 'fas fa-users' },
                { path: '/cadastros/veiculos', name: 'Veículos', icon: 'fas fa-truck' },
                { path: '/cadastros/entidades', name: 'Entidades', icon: 'fas fa-building' }
            ]
        },
        relatorios: {
            name: 'Relatórios',
            icon: 'fas fa-chart-bar',
            routes: [
                { path: '/relatorios/configuracao', name: 'Configuração', icon: 'fas fa-cog' },
                { path: '/relatorios/comercial', name: 'Comercial', icon: 'fas fa-file-alt' },
                { path: '/relatorios/faturamento', name: 'Faturamento', icon: 'fas fa-building' },
                { path: '/relatorios/financeiro', name: 'Financeiro', icon: 'fas fa-dollar-sign' },
                { path: '/relatorios/gerencial', name: 'Gerencial', icon: 'fas fa-users-cog' },
                { path: '/relatorios/operacional', name: 'Operacional', icon: 'fas fa-truck' }
            ]
        },
        web_clientes: {
            name: 'Web Cliente',
            icon: 'fas fa-user-tie',
            routes: [
                { path: '/web-clientes/processos', name: 'Processos', icon: 'fas fa-clipboard-list' },
                { path: '/web-clientes/dape-sem-carga', name: 'DAPE sem Carga', icon: 'fas fa-file-alt' },
                { path: '/web-clientes/agendamento-carregamento', name: 'Agendamento de Carregamento', icon: 'fas fa-truck-loading' },
                { path: '/web-clientes/agendamento-vistorias', name: 'Agendamento de Vistorias', icon: 'fas fa-search' },
                { path: '/web-clientes/autorizacao-carregamento', name: 'Autorização de Carregamento', icon: 'fas fa-check-circle' },
                { path: '/web-clientes/perdimento', name: 'Perdimento', icon: 'fas fa-exclamation-triangle' }
            ]
        }
    },

    // Configuração de validações
    validations: {
        cpf: {
            pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
            message: 'CPF deve estar no formato 000.000.000-00'
        },
        cnpj: {
            pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
            message: 'CNPJ deve estar no formato 00.000.000/0000-00'
        },
        placa: {
            pattern: /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/,
            message: 'Placa deve estar no formato ABC-1234 ou ABC1A23'
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Email deve ter formato válido'
        }
    },

    // Configuração de notificações
    notifications: {
        duration: 5000,
        position: {
            top: '10px',
            right: '10px'
        }
    },

    // Configuração de relatórios
    reports: {
        defaultDateRange: 30, // dias
        exportFormats: ['PDF', 'Excel', 'CSV'],
        maxRows: 1000
    }
};

// Exportar para uso global
window.AppConfig = AppConfig;
