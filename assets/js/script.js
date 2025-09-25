// Script principal do Projeto Aduaneiro

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login-form");

  // Se estiver na tela de login
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.querySelector("#email").value.trim();
      const password = document.querySelector("#password").value.trim();

      if (!email || !password) {
        alert("Preencha todos os campos!");
        return;
      }

      // Simulação de login (poderia ser validado em API futuramente)
      if (email === "admin@teste.com" && password === "1234") {
        // Armazena sessão simulada
        localStorage.setItem("usuarioLogado", email);
        window.location.href = "main.html";
      } else {
        alert("Usuário ou senha inválidos!");
      }
    });
  }

  // Se estiver na tela principal
  if (window.location.pathname.includes("main.html")) {
    const usuario = localStorage.getItem("usuarioLogado");

    if (!usuario) {
      // Se não tiver sessão, volta pro login
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
