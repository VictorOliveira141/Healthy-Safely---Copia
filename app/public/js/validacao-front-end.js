$(document).ready(function () {
  // ======= Validação em blur =======
  $("#nome").on("blur", validateNome);
  $("#nomeusuario").on("blur", validateNomeUsuario);
  $("#email").on("blur", validateEmail);
  $("#data").on("blur", validateData);
  $("#senha").on("blur", validateSenha);
  $("#confirmarSenha").on("blur", validateConfirmarSenha);

  // ======= Validação no submit =======
  $("form").on("submit", function (e) {
    let isValid =
      validateNome() &
      validateNomeUsuario() &
      validateEmail() &
      validateData() &
      validateSenha() &
      validateConfirmarSenha();

    if (!isValid) {
      e.preventDefault(); // impede envio se algum campo inválido
    }
  });

  // ======= Funções de validação =======
  function validateNome() {
    const nome = $("#nome").val().trim();
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{5,}$/; // pelo menos 5 letras
    if (nome === "") {
      showError("#nome", "O nome é obrigatório");
      return false;
    } else if (!regex.test(nome)) {
      showError("#nome", "Digite pelo menos 5 letras, apenas letras");
      return false;
    } else {
      showSuccess("#nome");
      return true;
    }
  }

  function validateNomeUsuario() {
    const usuario = $("#nomeusuario").val().trim();
    const regex = /^[A-Za-z0-9_]{3,}$/; // letras, números e underline, mínimo 3 caracteres
    if (usuario === "") {
      showError("#nomeusuario", "O nome de usuário é obrigatório");
      return false;
    } else if (!regex.test(usuario)) {
      showError(
        "#nomeusuario",
        "O nome de usuário deve ter ao menos 3 caracteres e conter apenas letras, números ou _"
      );
      return false;
    } else {
      showSuccess("#nomeusuario");
      return true;
    }
  }

  function validateEmail() {
    const email = $("#email").val().trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
      showError("#email", "O e-mail é obrigatório");
      return false;
    } else if (!regex.test(email)) {
      showError("#email", "Digite um e-mail válido");
      return false;
    } else {
      showSuccess("#email");
      return true;
    }
  }

  function validateData() {
    const data = $("#data").val().trim();
    if (data === "") {
      showError("#data", "A data de nascimento é obrigatória");
      return false;
    } else {
      showSuccess("#data");
      return true;
    }
  }

  function validateSenha() {
    const senha = $("#senha").val();
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;
    if (senha === "") {
      showError("#senha", "A senha é obrigatória");
      return false;
    } else if (!regex.test(senha)) {
      showError(
        "#senha",
        "A senha deve conter 1 maiúscula, 1 número e 1 caractere especial"
      );
      return false;
    } else {
      showSuccess("#senha");
      return true;
    }
  }

  function validateConfirmarSenha() {
    const senha = $("#senha").val();
    const confirmar = $("#confirmarSenha").val();
    if (confirmar === "") {
      showError("#confirmarSenha", "Confirme sua senha");
      return false;
    } else if (senha !== confirmar) {
      showError("#confirmarSenha", "As senhas não coincidem");
      return false;
    } else {
      showSuccess("#confirmarSenha");
      return true;
    }
  }

  // ======= Funções auxiliares =======
  function showError(selector, message) {
    $(selector).addClass("error").removeClass("success");
    $(selector).siblings(".msgErro").text(message);
  }

  function showSuccess(selector) {
    $(selector).addClass("success").removeClass("error");
    $(selector).siblings(".msgErro").text("");
  }
});
