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
              resolve({ success: true, user: userEmail });
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

    if (!usuario) {
      window.location.href = "login.html";
    }

    const logoutBtn = document.querySelector("#logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("usuarioLogado");
      });
    }
  }
});// Script principal do Projeto Aduaneiro

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
              resolve({ success: true, user: userEmail });
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

    if (!usuario) {
      window.location.href = "login.html";
    }

    const logoutBtn = document.querySelector("#logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("usuarioLogado");
      });
    }
  }
});