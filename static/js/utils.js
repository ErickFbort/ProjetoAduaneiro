// Utilitários JavaScript do Sistema Aduaneiro

// Gerenciador da Sidebar
const SidebarManager = {
    init() {
        this.setupSidebar();
        this.setupNavigation();
    },
    
    setupSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content--shifted');
        
        if (sidebar && mainContent) {
            const currentPath = window.location.pathname;
            const shouldCollapse = currentPath !== '/' && currentPath !== '/dashboard';
            
            if (shouldCollapse) {
                sidebar.classList.add('sidebar-collapsed');
                mainContent.classList.add('main-content--collapsed');
            }
        }
    },
    
    setupNavigation() {
        this.toggleSidebarMode();
    },
    
    toggleSidebarMode() {
        const sidebar = document.querySelector('.sidebar');
        const sidebarLinks = document.querySelector('.sidebar-links');
        
        if (!sidebar || !sidebarLinks) return;
        
        const currentPath = window.location.pathname;
        const module = this.getCurrentModule(currentPath);
        
        if (module) {
            this.renderModuleMenu(sidebarLinks, module, currentPath);
        } else {
            this.renderDefaultMenu(sidebarLinks, currentPath);
        }
        
        this.attachNavListeners();
    },

    getCurrentModule(path) {
        if (path.startsWith('/cadastros')) return 'cadastros';
        if (path.startsWith('/relatorios')) return 'relatorios';
        return null;
    },

    renderModuleMenu(container, moduleName, currentPath) {
        const module = AppConfig.modules[moduleName];
        if (!module) return;

        const homeLink = `<li><a href="/dashboard" class="nav-link"><i class="fas fa-home"></i> <span>Home</span></a></li>`;
        const moduleLinks = module.routes.map(route => 
            `<li><a href="${route.path}" class="nav-link ${currentPath === route.path ? 'active' : ''}">
                <i class="${route.icon}"></i> <span>${route.name}</span>
            </a></li>`
        ).join('');
        const logoutLink = `<li><a href="#" class="nav-link" onclick="logoutUser()"><i class="fas fa-sign-out-alt"></i> <span>Sair</span></a></li>`;
        
        container.innerHTML = homeLink + moduleLinks + logoutLink;
    },

    renderDefaultMenu(container, currentPath) {
        container.innerHTML = `
            <li><a href="/dashboard" class="nav-link ${currentPath === '/dashboard' ? 'active' : ''}"><i class="fas fa-home"></i> <span>Home</span></a></li>
            <li><a href="#operacional" class="nav-link"><i class="fas fa-tasks"></i> <span>Operacional</span></a></li>
            <li><a href="#faturamento" class="nav-link"><i class="fas fa-file-invoice-dollar"></i> <span>Faturamento</span></a></li>
            <li><a href="#web-cliente" class="nav-link"><i class="fas fa-user-tie"></i> <span>Web Cliente</span></a></li>
            <li><a href="#portal-adm" class="nav-link"><i class="fas fa-user-shield"></i> <span>Portal ADM</span></a></li>
            <li><a href="/cadastros" class="nav-link"><i class="fas fa-edit"></i> <span>Cadastros</span></a></li>
            <li><a href="/relatorios" class="nav-link ${currentPath === '/relatorios' ? 'active' : ''}"><i class="fas fa-chart-bar"></i> <span>Relatórios</span></a></li>
            <li><a href="#" class="nav-link" onclick="logoutUser()"><i class="fas fa-sign-out-alt"></i> <span>Sair</span></a></li>
        `;
    },
    
    attachNavListeners() {
        const navLinks = document.querySelectorAll(".nav-link");
        
        navLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                const href = e.target.getAttribute("href");
                
                // Se for um link Flask (url_for), permitir navegação normal
                if (href && (href.includes('url_for') || href.startsWith('/'))) {
                    // Se for link de cadastros, mudar para modo cadastros
                    if (href.includes('cadastros') && !href.includes('usuarios') && !href.includes('veiculos') && !href.includes('entidades')) {
                        e.preventDefault();
                        // Redirecionar para usuários por padrão
                        window.location.href = "/cadastros/usuarios";
                        return;
                    }
                    return; // Deixar o link funcionar normalmente
                }
                
                // Para links internos (hash), prevenir comportamento padrão
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    
                    this.showContent(targetId);

                    navLinks.forEach(item => item.classList.remove('active'));
                    e.target.classList.add('active');

                    // Lógica para recolher/expandir a barra lateral
                    const sidebarEl = document.querySelector(".sidebar");
                    const mainContentEl = document.querySelector(".main-content--shifted");
                    
                    if (targetId === "home") {
                        sidebarEl.classList.remove("sidebar-collapsed");
                        mainContentEl.classList.remove("main-content--collapsed");
                    } else {
                        sidebarEl.classList.add("sidebar-collapsed");
                        mainContentEl.classList.add("main-content--collapsed");
                    }
                }
            });
        });
    },
    
    showContent(targetId) {
        const contentSections = document.querySelectorAll(".content-section");
        contentSections.forEach(section => {
            if (section.id === targetId) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }
};

// Validações
const Validators = {
    validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        return this._validarDigitosCPF(cpf, 9) && this._validarDigitosCPF(cpf, 10);
    },
    
    validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]/g, '');
        if (cnpj.length !== 14) return false;
        if (/^(\d)\1{13}$/.test(cnpj)) return false;
        
        return this._validarDigitosCNPJ(cnpj, 12) && this._validarDigitosCNPJ(cnpj, 13);
    },
    
    validarPlaca(placa) {
        placa = placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (placa.length === 7) {
            const comHifen = placa.substring(0, 3) + '-' + placa.substring(3);
            return AppConfig.validations.placa.pattern.test(comHifen) || AppConfig.validations.placa.pattern.test(placa);
        }
        return AppConfig.validations.placa.pattern.test(placa);
    },
    
    validarEmail(email) {
        return AppConfig.validations.email.pattern.test(email);
    },

    // Métodos auxiliares
    _validarDigitosCPF(cpf, posicao) {
        let soma = 0;
        const multiplicador = posicao === 9 ? 10 : 11;
        
        for (let i = 0; i < posicao; i++) {
            soma += parseInt(cpf.charAt(i)) * (multiplicador - i);
        }
        
        let resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpf.charAt(posicao));
    },

    _validarDigitosCNPJ(cnpj, posicao) {
        let tamanho = posicao - 1;
        let numeros = cnpj.substring(0, tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        return resultado == cnpj.charAt(posicao);
    }
};

// Gerenciador de Feedback Visual
const FeedbackManager = {
    showLoading(element, originalText = null) {
        if (!originalText) {
            originalText = element.innerHTML;
            element.dataset.originalText = originalText;
        }
        element.disabled = true;
        element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
    },
    
    hideLoading(element) {
        const originalText = element.dataset.originalText || 'Salvar';
        element.disabled = false;
        element.innerHTML = originalText;
    },
    
    showSuccess(message, container = null) {
        this.showAlert(message, 'success', container);
    },
    
    showError(message, container = null) {
        this.showAlert(message, 'danger', container);
    },
    
    showAlert(message, type = 'info', container = null) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Aplicar posicionamento da configuração
        Object.assign(alertDiv.style, AppConfig.notifications.position);
        
        document.body.appendChild(alertDiv);
        
        // Auto-dismiss usando configuração
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, AppConfig.notifications.duration);
    }
};

// Gerenciador de Formulários
const FormManager = {
    async submitForm(form, options = {}) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        try {
            // Mostrar loading
            FeedbackManager.showLoading(submitButton, originalText);
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Processar dados específicos se necessário
            if (options.processData) {
                data = options.processData(data, form);
            }
            
            const response = await fetch(options.url, {
                method: options.method || 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                if (options.successMessage) {
                    FeedbackManager.showSuccess(options.successMessage);
                }
                if (options.redirect) {
                    setTimeout(() => {
                        window.location.href = options.redirect;
                    }, 1000);
                } else if (options.reload) {
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                }
            } else {
                const error = await response.json();
                FeedbackManager.showError(error.error || 'Erro ao processar solicitação');
            }
        } catch (error) {
            FeedbackManager.showError('Erro de conexão. Tente novamente.');
        } finally {
            FeedbackManager.hideLoading(submitButton);
        }
    }
};

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    SidebarManager.init();
    
    // Auto-dismiss alerts após 5 segundos
    setTimeout(() => {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            if (alert.querySelector('.btn-close')) {
                alert.querySelector('.btn-close').click();
            }
        });
    }, 5000);
});

// Função global para logout
function logoutUser() {
    if (confirm('Tem certeza que deseja sair do sistema?')) {
        window.location.href = '/logout';
    }
}
