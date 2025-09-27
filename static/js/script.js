// Script principal do Projeto Aduaneiro - Flask Version
// Funcionalidades específicas do dashboard

document.addEventListener("DOMContentLoaded", () => {
  // Função para exibir mensagens de erro específicas do login
  const showErrorMessage = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.login-container');
    if (container) {
      container.insertBefore(errorDiv, container.firstChild);
    }
  };

  // Auto-dismiss alerts after 5 seconds
  setTimeout(() => {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
      if (alert.querySelector('.btn-close')) {
        alert.querySelector('.btn-close').click();
      }
    });
  }, 5000);
});