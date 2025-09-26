// Script principal do Projeto Aduaneiro - Flask Version

document.addEventListener("DOMContentLoaded", () => {
  // Função para exibir mensagens de erro
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

  // Lógica para alternar entre as seções de conteúdo E recolher a barra lateral
  const navLinks = document.querySelectorAll(".nav-link");
  const contentSections = document.querySelectorAll(".content-section");
  const sidebarEl = document.querySelector(".sidebar");
  const mainContentEl = document.querySelector(".main-content--shifted");
  
  const showContent = (targetId) => {
    contentSections.forEach(section => {
      if (section.id === targetId) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });
  };

  // Define o estado inicial da barra lateral
  const initialHash = window.location.hash;
  if (initialHash && initialHash !== "#home") {
      sidebarEl.classList.add("sidebar-collapsed");
      mainContentEl.classList.add("main-content--collapsed");
  }

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = e.target.getAttribute("href").substring(1);
      
      // Só executa se não for um link externo
      if (targetId && !targetId.startsWith('http') && !targetId.includes('url_for')) {
        showContent(targetId);

        navLinks.forEach(item => item.classList.remove('active'));
        e.target.classList.add('active');

        // Lógica para recolher/expandir a barra lateral
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