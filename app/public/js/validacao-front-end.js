$(document).ready(function () {
  // Máscara para CNPJ
  window.mascaraCNPJ = function (input) {
    let value = input.value.replace(/\D/g, "");
    value = value.replace(/^([\d]{2})([\d])/, "$1.$2");
    value = value.replace(/^([\d]{2})\.([\d]{3})([\d])/, "$1.$2.$3");
    value = value.replace(
      /^([\d]{2})\.([\d]{3})\.([\d]{3})([\d])/,
      "$1.$2.$3/$4"
    );
    value = value.replace(
      /^([\d]{2})\.([\d]{3})\.([\d]{3})\/([\d]{4})([\d]{1,2})/,
      "$1.$2.$3/$4-$5"
    );
    input.value = value;
  };
  // ======= Validação em blur Cliente =======
  $("#nome").on("blur", validateNome);
  $("#nomeusuario").on("blur", validateNomeUsuario);
  $("#email").on("blur", validateEmail);
  $("#data").on("blur", validateData);
  $("#senha").on("blur", validateSenha);
  $("#confirmarSenha").on("blur", validateConfirmarSenha);

  // ======= Validação em blur Farmácia =======
  $("#formFarmacia input[name='nomeFarmacia']").on(
    "blur",
    validateNomeFarmacia
  );
  $("#formFarmacia input[name='nomeusuario']").on(
    "blur",
    validateNomeUsuarioFarmacia
  );
  $("#formFarmacia input[name='CNPJ']").on("blur", validateCNPJ);
  $("#formFarmacia input[name='responsavel']").on("blur", validateResponsavel);
  $("#formFarmacia input[name='cidade']").on("blur", validateCidade);
  $("#formFarmacia input[name='estado']").on("blur", validateEstado);
  $("#formFarmacia input[name='email']").on("blur", validateEmailFarmacia);
  $("#formFarmacia input[name='senha']").on("blur", validateSenhaFarmacia);
  $("#formFarmacia input[name='confirmarSenha']").on(
    "blur",
    validateConfirmarSenhaFarmacia
  );

  // ======= Validação em blur Profissional =======
  $("#formProfissional input[name='nome']").on(
    "blur",
    validateNomeProfissional
  );
  $("#formProfissional input[name='nomeusuario']").on(
    "blur",
    validateNomeUsuarioProfissional
  );
  $("#formProfissional select[name='profissao']").on(
    "blur change",
    validateProfissao
  );
  $("#formProfissional input[name='CREF']").on("blur", validateCREF);
  $("#formProfissional input[name='whatsapp']").on("blur", validateWhatsapp);
  $("#formProfissional input[name='email']").on(
    "blur",
    validateEmailProfissional
  );
  $("#formProfissional input[name='senha']").on(
    "blur",
    validateSenhaProfissional
  );
  $("#formProfissional input[name='confirmarSenha']").on(
    "blur",
    validateConfirmarSenhaProfissional
  );

  // ======= Validação no submit =======
  $("form").on("submit", function (e) {
    // Cliente
    if ($(this).attr("id") === undefined) {
      let isValid =
        validateNome() &
        validateNomeUsuario() &
        validateEmail() &
        validateData() &
        validateSenha() &
        validateConfirmarSenha();
      if (!isValid) e.preventDefault();
    }
    // Farmácia
    if ($(this).attr("id") === "formFarmacia") {
      let isValid =
        validateNomeFarmacia() &
        validateNomeUsuarioFarmacia() &
        validateCNPJ() &
        validateResponsavel() &
        validateCidade() &
        validateEstado() &
        validateEmailFarmacia() &
        validateSenhaFarmacia() &
        validateConfirmarSenhaFarmacia();
      if (!isValid) e.preventDefault();
    }
    // Profissional
    if ($(this).attr("id") === "formProfissional") {
      let isValid =
        validateNomeProfissional() &
        validateNomeUsuarioProfissional() &
        validateProfissao() &
        validateCREF() &
        validateWhatsapp() &
        validateEmailProfissional() &
        validateSenhaProfissional() &
        validateConfirmarSenhaProfissional();
      if (!isValid) e.preventDefault();
    }
  });

  // ======= Funções de validação Cliente =======
  function validateNome() {
    const nome = $("#nome").val().trim();
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{5,}$/;
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
    const regex = /^[A-Za-z0-9_]{3,}$/;
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

  // ======= Funções de validação Farmácia =======
  function validateNomeFarmacia() {
    const nome = $("#formFarmacia input[name='nomeFarmacia']").val().trim();
    if (nome === "") {
      showError(
        "#formFarmacia input[name='nomeFarmacia']",
        "O nome da farmácia é obrigatório"
      );
      return false;
    } else if (nome.length < 3) {
      showError(
        "#formFarmacia input[name='nomeFarmacia']",
        "Digite pelo menos 3 caracteres"
      );
      return false;
    } else {
      showSuccess("#formFarmacia input[name='nomeFarmacia']");
      return true;
    }
  }

  function validateNomeUsuarioFarmacia() {
    const usuario = $("#formFarmacia input[name='nomeusuario']").val().trim();
    const regex = /^[A-Za-z0-9_]{3,}$/;
    if (usuario === "") {
      showError(
        "#formFarmacia input[name='nomeusuario']",
        "O nome de usuário é obrigatório"
      );
      return false;
    } else if (!regex.test(usuario)) {
      showError(
        "#formFarmacia input[name='nomeusuario']",
        "O nome de usuário deve ter ao menos 3 caracteres e conter apenas letras, números ou _"
      );
      return false;
    } else {
      showSuccess("#formFarmacia input[name='nomeusuario']");
      return true;
    }
  }

  function validateCNPJ() {
    let cnpj = $("#formFarmacia input[name='CNPJ']").val().replace(/\D/g, "");
    const regex = /^\d{14}$/;
    if (cnpj === "") {
      showError("#formFarmacia input[name='CNPJ']", "O CNPJ é obrigatório");
      return false;
    } else if (!regex.test(cnpj)) {
      showError(
        "#formFarmacia input[name='CNPJ']",
        "Digite um CNPJ válido (apenas números, 14 dígitos)"
      );
      return false;
    } else {
      // Formata o CNPJ: 12.345.678/0001-95
      const cnpjFormatado = cnpj.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
      $("#formFarmacia input[name='CNPJ']").val(cnpjFormatado);
      showSuccess("#formFarmacia input[name='CNPJ']");
      return true;
    }
  }

  function validateResponsavel() {
    const resp = $("#formFarmacia input[name='responsavel']").val().trim();
    if (resp === "") {
      showError(
        "#formFarmacia input[name='responsavel']",
        "O responsável é obrigatório"
      );
      return false;
    } else {
      showSuccess("#formFarmacia input[name='responsavel']");
      return true;
    }
  }

  function validateCidade() {
    const cidade = $("#formFarmacia input[name='cidade']").val().trim();
    if (cidade === "") {
      showError("#formFarmacia input[name='cidade']", "A cidade é obrigatória");
      return false;
    } else {
      showSuccess("#formFarmacia input[name='cidade']");
      return true;
    }
  }

  function validateEstado() {
    const estado = $("#formFarmacia input[name='estado']").val().trim();
    const regex = /^[A-Za-z]{2}$/;
    if (estado === "") {
      showError("#formFarmacia input[name='estado']", "O estado é obrigatório");
      return false;
    } else if (!regex.test(estado)) {
      showError(
        "#formFarmacia input[name='estado']",
        "Digite a sigla do estado (Ex: SP)"
      );
      return false;
    } else {
      showSuccess("#formFarmacia input[name='estado']");
      return true;
    }
  }

  function validateEmailFarmacia() {
    const email = $("#formFarmacia input[name='email']").val().trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
      showError("#formFarmacia input[name='email']", "O e-mail é obrigatório");
      return false;
    } else if (!regex.test(email)) {
      showError("#formFarmacia input[name='email']", "Digite um e-mail válido");
      return false;
    } else {
      showSuccess("#formFarmacia input[name='email']");
      return true;
    }
  }

  function validateSenhaFarmacia() {
    const senha = $("#formFarmacia input[name='senha']").val();
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;
    if (senha === "") {
      showError("#formFarmacia input[name='senha']", "A senha é obrigatória");
      return false;
    } else if (!regex.test(senha)) {
      showError(
        "#formFarmacia input[name='senha']",
        "A senha deve conter 1 maiúscula, 1 número e 1 caractere especial"
      );
      return false;
    } else {
      showSuccess("#formFarmacia input[name='senha']");
      return true;
    }
  }

  function validateConfirmarSenhaFarmacia() {
    const senha = $("#formFarmacia input[name='senha']").val();
    const confirmar = $("#formFarmacia input[name='confirmarSenha']").val();
    if (confirmar === "") {
      showError(
        "#formFarmacia input[name='confirmarSenha']",
        "Confirme sua senha"
      );
      return false;
    } else if (senha !== confirmar) {
      showError(
        "#formFarmacia input[name='confirmarSenha']",
        "As senhas não coincidem"
      );
      return false;
    } else {
      showSuccess("#formFarmacia input[name='confirmarSenha']");
      return true;
    }
  }

  // ======= Funções de validação Profissional =======
  function validateNomeProfissional() {
    const nome = $("#formProfissional input[name='nome']").val().trim();
    if (nome === "") {
      showError("#formProfissional input[name='nome']", "O nome é obrigatório");
      return false;
    } else if (nome.length < 5) {
      showError(
        "#formProfissional input[name='nome']",
        "Digite pelo menos 5 caracteres"
      );
      return false;
    } else {
      showSuccess("#formProfissional input[name='nome']");
      return true;
    }
  }

  function validateNomeUsuarioProfissional() {
    const usuario = $("#formProfissional input[name='nomeusuario']")
      .val()
      .trim();
    const regex = /^[A-Za-z0-9_]{3,}$/;
    if (usuario === "") {
      showError(
        "#formProfissional input[name='nomeusuario']",
        "O nome de usuário é obrigatório"
      );
      return false;
    } else if (!regex.test(usuario)) {
      showError(
        "#formProfissional input[name='nomeusuario']",
        "O nome de usuário deve ter ao menos 3 caracteres e conter apenas letras, números ou _"
      );
      return false;
    } else {
      showSuccess("#formProfissional input[name='nomeusuario']");
      return true;
    }
  }

  function validateProfissao() {
    const profissao = $("#formProfissional select[name='profissao']").val();
    if (!profissao || profissao === "") {
      showError(
        "#formProfissional select[name='profissao']",
        "Selecione a profissão"
      );
      return false;
    } else {
      showSuccess("#formProfissional select[name='profissao']");
      return true;
    }
  }

  function validateCREF() {
    const cref = $("#formProfissional input[name='CREF']").val().trim();
    if (cref === "") {
      showError(
        "#formProfissional input[name='CREF']",
        "O registro profissional é obrigatório"
      );
      return false;
    } else {
      showSuccess("#formProfissional input[name='CREF']");
      return true;
    }
  }

  function validateWhatsapp() {
    const whatsapp = $("#formProfissional input[name='whatsapp']").val().trim();
    const regex = /^\d{10,13}$/;
    if (whatsapp === "") {
      showError(
        "#formProfissional input[name='whatsapp']",
        "O WhatsApp é obrigatório"
      );
      return false;
    } else if (!regex.test(whatsapp)) {
      showError(
        "#formProfissional input[name='whatsapp']",
        "Digite um número válido (apenas números)"
      );
      return false;
    } else {
      showSuccess("#formProfissional input[name='whatsapp']");
      return true;
    }
  }

  function validateEmailProfissional() {
    const email = $("#formProfissional input[name='email']").val().trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
      showError(
        "#formProfissional input[name='email']",
        "O e-mail é obrigatório"
      );
      return false;
    } else if (!regex.test(email)) {
      showError(
        "#formProfissional input[name='email']",
        "Digite um e-mail válido"
      );
      return false;
    } else {
      showSuccess("#formProfissional input[name='email']");
      return true;
    }
  }

  function validateSenhaProfissional() {
    const senha = $("#formProfissional input[name='senha']").val();
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;
    if (senha === "") {
      showError(
        "#formProfissional input[name='senha']",
        "A senha é obrigatória"
      );
      return false;
    } else if (!regex.test(senha)) {
      showError(
        "#formProfissional input[name='senha']",
        "A senha deve conter 1 maiúscula, 1 número e 1 caractere especial"
      );
      return false;
    } else {
      showSuccess("#formProfissional input[name='senha']");
      return true;
    }
  }

  function validateConfirmarSenhaProfissional() {
    const senha = $("#formProfissional input[name='senha']").val();
    const confirmar = $("#formProfissional input[name='confirmarSenha']").val();
    if (confirmar === "") {
      showError(
        "#formProfissional input[name='confirmarSenha']",
        "Confirme sua senha"
      );
      return false;
    } else if (senha !== confirmar) {
      showError(
        "#formProfissional input[name='confirmarSenha']",
        "As senhas não coincidem"
      );
      return false;
    } else {
      showSuccess("#formProfissional input[name='confirmarSenha']");
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
