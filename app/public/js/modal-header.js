// Modal de cadastro
const abrirBtns = document.querySelectorAll(".abrir-cadastro");
const modal = document.getElementById("headerModalCadastro");
const closeBtn = document.getElementById("headerCloseCadastroModal");

abrirBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
});

// Dropdown do perfil
const perfilToggle = document.getElementById("perfilMenuToggle");
const perfilMenu = document.getElementById("perfilMenu");

perfilToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  perfilMenu.classList.toggle("hidden");
});

window.addEventListener("click", (e) => {
  if (!perfilToggle.contains(e.target) && !perfilMenu.contains(e.target)) {
    perfilMenu.classList.add("hidden");
  }
});
