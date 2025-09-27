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
            // Verificar se deve recolher a barra lateral
            const currentPath = window.location.pathname;
            const shouldCollapse = currentPath !== '/' && currentPath !== '/dashboard';
            
            if (shouldCollapse) {
                sidebar.classList.add('sidebar-collapsed');
                mainContent.classList.add('main-content--collapsed');
            }
        }
    },
    
    setupNavigation() {
        // Aplicar modo da barra lateral baseado na página atual
        this.toggleSidebarMode();
    },
    
    toggleSidebarMode() {
        const sidebar = document.querySelector('.sidebar');
        const sidebarLinks = document.querySelector('.sidebar-links');
        
        if (!sidebar || !sidebarLinks) return;
        
        const isCadastrosModule = () => {
            const currentPath = window.location.pathname;
            return currentPath.startsWith('/cadastros');
        };
        
        if (isCadastrosModule()) {
            // Modo cadastros - mostrar opções específicas
            sidebarLinks.innerHTML = `
                <li><a href="/dashboard" class="nav-link"><i class="fas fa-home"></i> <span>Home</span></a></li>
                <li><a href="/cadastros/usuarios" class="nav-link ${window.location.pathname === '/cadastros/usuarios' ? 'active' : ''}"><i class="fas fa-users"></i> <span>Usuários</span></a></li>
                <li><a href="/cadastros/veiculos" class="nav-link ${window.location.pathname === '/cadastros/veiculos' ? 'active' : ''}"><i class="fas fa-truck"></i> <span>Veículos</span></a></li>
                <li><a href="/cadastros/entidades" class="nav-link ${window.location.pathname === '/cadastros/entidades' ? 'active' : ''}"><i class="fas fa-building"></i> <span>Entidades</span></a></li>
                <li><a href="#" class="nav-link" onclick="logoutUser()"><i class="fas fa-sign-out-alt"></i> <span>Sair</span></a></li>
            `;
        } else {
            // Modo normal - mostrar menu completo
            sidebarLinks.innerHTML = `
                <li><a href="/dashboard" class="nav-link ${window.location.pathname === '/dashboard' ? 'active' : ''}"><i class="fas fa-home"></i> <span>Home</span></a></li>
                <li><a href="#operacional" class="nav-link"><i class="fas fa-tasks"></i> <span>Operacional</span></a></li>
                <li><a href="#faturamento" class="nav-link"><i class="fas fa-file-invoice-dollar"></i> <span>Faturamento</span></a></li>
                <li><a href="#web-cliente" class="nav-link"><i class="fas fa-user-tie"></i> <span>Web Cliente</span></a></li>
                <li><a href="#portal-adm" class="nav-link"><i class="fas fa-user-shield"></i> <span>Portal ADM</span></a></li>
                <li><a href="/cadastros" class="nav-link"><i class="fas fa-edit"></i> <span>Cadastros</span></a></li>
                <li><a href="#relatorios" class="nav-link"><i class="fas fa-chart-line"></i> <span>Relatórios</span></a></li>
                <li><a href="#" class="nav-link" onclick="logoutUser()"><i class="fas fa-sign-out-alt"></i> <span>Sair</span></a></li>
            `;
        }
        
        // Reaplicar event listeners após mudança do HTML
        this.attachNavListeners();
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
    // Validação de CPF
    validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        if (cpf.length !== 11) return false;
        
        // Verificar se todos os dígitos são iguais
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        // Algoritmo de validação do CPF
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;
        
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpf.charAt(10));
    },
    
    // Validação de CNPJ
    validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]/g, '');
        if (cnpj.length !== 14) return false;
        
        // Verificar se todos os dígitos são iguais
        if (/^(\d)\1{13}$/.test(cnpj)) return false;
        
        // Algoritmo de validação do CNPJ
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) return false;
        
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        return resultado == digitos.charAt(1);
    },
    
    // Validação de placa (formato brasileiro)
    validarPlaca(placa) {
        // Formato antigo: ABC-1234
        const formatoAntigo = /^[A-Z]{3}-[0-9]{4}$/;
        // Formato Mercosul: ABC-1A23
        const formatoMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
        
        placa = placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        if (placa.length === 7) {
            // Formato sem hífen
            const comHifen = placa.substring(0, 3) + '-' + placa.substring(3);
            return formatoAntigo.test(comHifen) || formatoMercosul.test(placa);
        }
        
        return formatoAntigo.test(placa) || formatoMercosul.test(placa);
    },
    
    // Validação de email
    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
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
        
        const targetContainer = container || document.querySelector('.container-fluid') || document.body;
        targetContainer.insertBefore(alertDiv, targetContainer.firstChild);
        
        // Auto-dismiss após 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
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
