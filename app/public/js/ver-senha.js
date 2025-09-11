/* =============== SCRIPT PARA CONSEGUIR VER A SENHA NOS FORMULARIOS ============ */
function mostrarSenha(inputId, icone) {
  const inputPass = document.getElementById(inputId);

  if (inputPass.type === "password") {
    inputPass.type = "text"; /*Transforma o input em texto*/
    icone.classList.remove("bi-eye-slash-fill"); /*remove icone olho fechado*/
    icone.classList.add("bi-eye-fill"); /*adiciona icone olho aberto*/
  } else {
    inputPass.type = "password";
    icone.classList.remove("bi-eye-fill"); /*remove icone olho aberto*/
    icone.classList.add(
      "bi-eye-slash-fill"
    ); /*adiciona icone olho fechado novamente*/
  }
}
