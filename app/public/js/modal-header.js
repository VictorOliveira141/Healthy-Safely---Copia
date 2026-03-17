// Modal de cadastro
const abrirBtns = document.querySelectorAll(".abrir-cadastro");
const modal = document.getElementById("headerModalCadastro");
const closeBtn = document.getElementById("headerCloseCadastroModal");

abrirBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!modal) return;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });
});

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    if (!modal) return;
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  });
}

window.addEventListener("click", (e) => {
  if (modal && e.target === modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
});

// Dropdown do perfil
const perfilToggle = document.getElementById("perfilMenuToggle");
const perfilMenu = document.getElementById("perfilMenu");

if (perfilToggle && perfilMenu) {
  perfilToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    perfilMenu.classList.toggle("hidden");
  });

  window.addEventListener("click", (e) => {
    if (!perfilToggle.contains(e.target) && !perfilMenu.contains(e.target)) {
      perfilMenu.classList.add("hidden");
    }
  });
}

// Dropdown de notificações
const notificationToggles = document.querySelectorAll(".notification-toggle");
const notificationMenu = document.getElementById("notificationMenu");

if (notificationToggles.length && notificationMenu) {
  notificationToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      notificationMenu.classList.toggle("hidden");
    });
  });

  window.addEventListener("click", (e) => {
    if (!notificationMenu.contains(e.target)) {
      notificationMenu.classList.add("hidden");
    }
  });
}
