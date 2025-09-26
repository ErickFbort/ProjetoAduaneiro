// Script principal do Projeto Aduaneiro

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login-form");
  const errorMessageEl = document.querySelector("#error-message");
  
  // Função para exibir mensagens de erro
  const showErrorMessage = (message) => {
    errorMessageEl.textContent = message;
    errorMessageEl.style.display = 'block';
  };

  // Se estiver na tela de login
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.querySelector("#email").value.trim();
      const password = document.querySelector("#password").value.trim();

      showErrorMessage(''); // Limpa a mensagem de erro

      if (!email || !password) {
        showErrorMessage("Preencha todos os campos!");
        return;
      }

      // Simulando uma chamada a uma API de autenticação
      const simulatedLogin = async (userEmail, userPassword) => {
        // Credenciais simuladas (em um sistema real, viriam de um banco de dados)
        const validUser = "admin@teste.com";
        const validPassword = "1234";

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (userEmail === validUser && userPassword === validPassword) {
              resolve({ success: true, user: userEmail, name: "ADM" }); // Retorna o nome do usuário
            } else {
              reject({ success: false, message: "Usuário ou senha inválidos!" });
            }
          }, 500); // Atraso para simular requisição de rede
        });
      };

      try {
        const response = await simulatedLogin(email, password);
        if (response.success) {
          localStorage.setItem("usuarioLogado", response.user);
          localStorage.setItem("nomeUsuario", response.name); // Salva o nome do usuário no localStorage
          window.location.href = "main.html";
        }
      } catch (error) {
        showErrorMessage(error.message);
      }
    });
  }

  // Se estiver na tela principal
  if (window.location.pathname.includes("main.html")) {
    const usuario = localStorage.getItem("usuarioLogado");
    const nomeUsuario = localStorage.getItem("nomeUsuario");

    if (!usuario) {
      window.location.href = "login.html";
    }

    // Exibe a mensagem de boas-vindas com o nome do usuário
    const userGreetingEl = document.querySelector("#user-greeting");
    if (userGreetingEl && nomeUsuario) {
      userGreetingEl.textContent = `Bem-vindo(a), ${nomeUsuario}!`;
    }

    // Lógica de logout para a barra lateral
    const logoutSidebarBtn = document.querySelector("#logout-sidebar");
    if (logoutSidebarBtn) {
      logoutSidebarBtn.addEventListener("click", () => {
        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("nomeUsuario"); // Remove o nome do usuário ao fazer logout
      });
    }

    // Lógica para alternar entre as seções de conteúdo
    const navLinks = document.querySelectorAll(".sidebar-links a");
    const contentSections = document.querySelectorAll(".content-section");
    
    const showContent = (targetId) => {
      contentSections.forEach(section => {
        if (section.id === targetId) {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      });
    };

    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = e.target.getAttribute("href").substring(1);
        showContent(targetId);

        navLinks.forEach(item => item.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    // Lógica para o formulário de Adicionar Usuário
    const addUserBtn = document.querySelector("#add-user-btn");
    const cancelAddBtn = document.querySelector("#cancel-add-btn");
    const userListView = document.querySelector("#user-list-view");
    const addUserForm = document.querySelector("#add-user-form");

    if (addUserBtn) {
      addUserBtn.addEventListener("click", () => {
        userListView.style.display = 'none';
        addUserForm.style.display = 'block';
      });
    }

    if (cancelAddBtn) {
      cancelAddBtn.addEventListener("click", () => {
        userListView.style.display = 'block';
        addUserForm.style.display = 'none';
      });
    }
  }
});