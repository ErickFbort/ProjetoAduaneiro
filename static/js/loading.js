// Loading Screen Manager
class LoadingManager {
    constructor() {
        this.overlay = document.getElementById('loadingOverlay');
        this.isLoading = false;
    }

    show() {
        if (this.overlay && !this.isLoading) {
            this.isLoading = true;
            this.overlay.style.display = 'flex';
            
            // Reset animations
            const airplane = this.overlay.querySelector('.airplane-icon');
            const dots = this.overlay.querySelector('.loading-dots');
            
            if (airplane) {
                airplane.style.animation = 'none';
                airplane.offsetHeight; // Trigger reflow
                airplane.style.animation = 'airplaneFly 3s ease-in-out infinite';
            }
            
            if (dots) {
                dots.style.animation = 'none';
                dots.offsetHeight; // Trigger reflow
                dots.style.animation = 'loadingDots 1.5s infinite';
            }
        }
    }

    hide() {
        if (this.overlay && this.isLoading) {
            this.isLoading = false;
            this.overlay.style.display = 'none';
        }
    }

    // Método para simular carregamento com delay
    showWithDelay(delay = 2000) {
        this.show();
        setTimeout(() => {
            this.hide();
        }, delay);
    }
}

// Instância global
window.loadingManager = new LoadingManager();

// Funções globais para facilitar uso
function showLoading() {
    window.loadingManager.show();
}

function hideLoading() {
    window.loadingManager.hide();
}

function showLoadingWithDelay(delay = 2000) {
    window.loadingManager.showWithDelay(delay);
}

// Interceptar cliques em links para mostrar loading
document.addEventListener('DOMContentLoaded', function() {
    // Interceptar cliques em links de navegação
    const navLinks = document.querySelectorAll('a[href*="/web-clientes/"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Verificar se é um link interno
            if (this.href && !this.href.includes('#')) {
                showLoading();
                
                // Se for um link interno, permitir navegação normal
                // O loading será escondido quando a nova página carregar
                setTimeout(() => {
                    hideLoading();
                }, 1500);
            }
        });
    });
    
    // Interceptar formulários
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            showLoading();
        });
    });
    
    // TESTE ESPECÍFICO: Interceptar clique no módulo Web Cliente
    const webClientLinks = document.querySelectorAll('a[href*="/web-clientes/"]');
    webClientLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Navegando para Web Cliente - Mostrando loading...');
            showLoadingWithDelay(2000); // Mostrar loading por 2 segundos
        });
    });
    
    // TESTE: Botão para testar loading manualmente
    const testButton = document.createElement('button');
    testButton.innerHTML = '🧪 Testar Loading';
    testButton.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10000;
        background: #007bff;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
    `;
    testButton.addEventListener('click', function() {
        console.log('Teste manual do loading...');
        showLoadingWithDelay(3000);
    });
    document.body.appendChild(testButton);
});
