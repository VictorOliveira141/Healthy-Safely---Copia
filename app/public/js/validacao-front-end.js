/**
 * Sistema de Validação Front-end Melhorado
 * Foco em UX e Usabilidade
 */

$(document).ready(function () {
  // ============ MÁSCARAS ============
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

  // ============ VALIDAÇÕES EM TEMPO REAL (BLUR) ============

  // Cliente - Validação de Campo Único
  $("form input[name='nome']").on("blur", function () {
    validarCampo(this, validarNome);
  });

  $("form input[name='nomeusuario']").on("blur", function () {
    validarCampo(this, validarNomeUsuario);
  });

  $("form input[name='email']").on("blur", function () {
    validarCampo(this, validarEmail);
  });

  $("form input[name='nomeFarmacia']").on("blur", function () {
    validarCampo(this, validarNomeFarmacia);
  });

  $("form input[name='CNPJ']").on("blur", function () {
    validarCampo(this, validarCNPJ);
  });

  $("form input[name='senha']").on("blur", function () {
    validarCampo(this, validarSenha);
  });

  $("form input[name='confirmarSenha']").on("blur", function () {
    validarConfirmarSenha(this);
  });

  // ============ SUBMIT FORM ============
  $("form").on("submit", function (e) {
    const inputs = $(this).find(
      "input[type='text'], input[type='email'], input[type='password']"
    );
    let isValid = true;

    inputs.each(function () {
      if (!validarCampoAoSubmit(this)) {
        isValid = false;
      }
    });

    if (!isValid) {
      e.preventDefault();
      mostrarMensagemErro("Por favor, corrija os erros acima");
    }
  });

  // ============ FUNÇÕES AUXILIARES ============

  /**
   * Valida um campo individual e exibe feedback
   */
  function validarCampo(input, validarFuncao) {
    const $input = $(input);
    const resultado = validarFuncao($input.val().trim());

    if (resultado.valido) {
      mostrarSucesso($input);
    } else {
      mostrarErro($input, resultado.mensagem);
    }
  }

  /**
   * Valida campo no submit (mais rigoroso)
   */
  function validarCampoAoSubmit(input) {
    const $input = $(input);
    const nome = $input.attr("name");
    let resultado;

    switch (nome) {
      case "nome":
        resultado = validarNome($input.val().trim());
        break;
      case "nomeusuario":
        resultado = validarNomeUsuario($input.val().trim());
        break;
      case "nomeFarmacia":
        resultado = validarNomeFarmacia($input.val().trim());
        break;
      case "email":
        resultado = validarEmail($input.val().trim());
        break;
      case "CNPJ":
        resultado = validarCNPJ($input.val().trim());
        break;
      case "senha":
        resultado = validarSenha($input.val());
        break;
      case "confirmarSenha":
        const $senha = $input.closest("form").find("input[name='senha']");
        resultado = validarConfirmarSenhaSubmit($input.val(), $senha.val());
        break;
      default:
        return true;
    }

    if (resultado.valido) {
      mostrarSucesso($input);
      return true;
    } else {
      mostrarErro($input, resultado.mensagem);
      return false;
    }
  }

  // ============ VALIDADORES ============

  function validarNome(valor) {
    if (!valor) {
      return { valido: false, mensagem: "Nome é obrigatório" };
    }
    if (valor.length < 3) {
      return { valido: false, mensagem: "Mínimo 3 caracteres" };
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(valor)) {
      return { valido: false, mensagem: "Apenas letras permitidas" };
    }
    return { valido: true, mensagem: "" };
  }

  function validarNomeUsuario(valor) {
    if (!valor) {
      return { valido: false, mensagem: "Nome de usuário é obrigatório" };
    }
    if (valor.length < 3) {
      return { valido: false, mensagem: "Mínimo 3 caracteres" };
    }
    if (!/^[A-Za-z0-9_]+$/.test(valor)) {
      return {
        valido: false,
        mensagem: "Apenas letras, números e _",
      };
    }
    return { valido: true, mensagem: "" };
  }

  function validarEmail(valor) {
    if (!valor) {
      return { valido: false, mensagem: "E-mail é obrigatório" };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
      return { valido: false, mensagem: "E-mail inválido" };
    }
    return { valido: true, mensagem: "" };
  }

  function validarNomeFarmacia(valor) {
    if (!valor) {
      return { valido: false, mensagem: "Nome da farmácia é obrigatório" };
    }
    if (valor.length < 3) {
      return { valido: false, mensagem: "Mínimo 3 caracteres" };
    }
    return { valido: true, mensagem: "" };
  }

  function validarCNPJ(valor) {
    if (!valor) {
      return { valido: false, mensagem: "CNPJ é obrigatório" };
    }
    const apenasNumeros = valor.replace(/\D/g, "");
    if (apenasNumeros.length !== 14) {
      return { valido: false, mensagem: "CNPJ deve ter 14 números" };
    }
    return { valido: true, mensagem: "" };
  }

  function validarSenha(valor) {
    if (!valor) {
      return { valido: false, mensagem: "Senha é obrigatória" };
    }
    if (valor.length < 8) {
      return { valido: false, mensagem: "Mínimo 8 caracteres" };
    }
    if (!/[A-Z]/.test(valor)) {
      return { valido: false, mensagem: "Precisa de letra maiúscula (A-Z)" };
    }
    if (!/[0-9]/.test(valor)) {
      return { valido: false, mensagem: "Precisa de número (0-9)" };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(valor)) {
      return {
        valido: false,
        mensagem: "Precisa de caractere especial (!@#$%^&*)",
      };
    }
    return { valido: true, mensagem: "" };
  }

  function validarConfirmarSenha(input) {
    const $input = $(input);
    const $senha = $input.closest("form").find("input[name='senha']");
    const valor = $input.val();
    const senhaValor = $senha.val();

    if (!valor) {
      mostrarErro($input, "Confirmação é obrigatória");
      return false;
    }
    if (valor !== senhaValor) {
      mostrarErro($input, "Senhas não coincidem");
      return false;
    }
    mostrarSucesso($input);
    return true;
  }

  function validarConfirmarSenhaSubmit(valor, senhaValor) {
    if (!valor) {
      return { valido: false, mensagem: "Confirmação é obrigatória" };
    }
    if (valor !== senhaValor) {
      return { valido: false, mensagem: "Senhas não coincidem" };
    }
    return { valido: true, mensagem: "" };
  }

  // ============ FEEDBACK VISUAL ============

  function mostrarErro($input, mensagem) {
    $input.addClass("erro-input").removeClass("sucesso-input");

    // Encontra a mensagem de erro
    let $mensagemErro = $input.next(".msg-erro");

    // Se for um campo de senha, pode estar dentro de .campo-senha
    if (!$mensagemErro.length) {
      const $campoSenha = $input.closest(".campo-senha");
      if ($campoSenha.length) {
        $mensagemErro = $campoSenha.next(".msg-erro");
      }
    }

    if ($mensagemErro.length) {
      $mensagemErro.text(mensagem).show();
    } else {
      // Se não encontrar, cria a mensagem
      $input.after(`<span class="msg-erro">${mensagem}</span>`);
    }
  }

  function mostrarSucesso($input) {
    $input.removeClass("erro-input").addClass("sucesso-input");

    let $mensagemErro = $input.next(".msg-erro");

    if (!$mensagemErro.length) {
      const $campoSenha = $input.closest(".campo-senha");
      if ($campoSenha.length) {
        $mensagemErro = $campoSenha.next(".msg-erro");
      }
    }

    if ($mensagemErro.length) {
      $mensagemErro.empty().hide();
    }
  }

  function mostrarMensagemErro(mensagem) {
    // Cria um toast/alerta de erro no topo
    const $alerta = $(`
      <div class="alerta-erro" style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
      ">
        <i class="bi bi-exclamation-circle"></i> ${mensagem}
      </div>
    `);

    $("body").append($alerta);

    setTimeout(() => {
      $alerta.fadeOut(300, function () {
        $(this).remove();
      });
    }, 4000);
  }

  // ============ LIMPEZA EM REAL-TIME ============
  $("form input").on("input", function () {
    const $input = $(this);
    if ($input.hasClass("erro-input")) {
      // Remove a classe de erro enquanto o usuário digita
      $input.removeClass("erro-input");

      let $mensagemErro = $input.next(".msg-erro");
      if (!$mensagemErro.length) {
        const $campoSenha = $input.closest(".campo-senha");
        if ($campoSenha.length) {
          $mensagemErro = $campoSenha.next(".msg-erro");
        }
      }
      if ($mensagemErro.length) {
        $mensagemErro.empty();
      }
    }
  });
});
