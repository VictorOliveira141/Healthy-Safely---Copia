const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const verificarAutenticacao = require("../public/js/autenticacao");

const usuarios = []; /* array que armazena os usuarios*/
var { validarCNPJ } = require("../helpers/validacaoPersonalizada");

/* ROTA PARA DESLOGAR O USUÁRIO */
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

/* ==================== ROTAS PÚBLICAS(NÃO PRECISA DE LOGIN) ===================== */
router.get("/", (req, res) => {
  res.render("pages/tomarammeutela");
});
router.get("/tomarammeutela", (req, res) => {
  res.render("pages/tomarammeutela");
});
router.get("/loja", (req, res) => {
  res.render("pages/loja");
});
router.get("/produto", (req, res) => {
  res.render("pages/produto");
});
router.get("/shoes", (req, res) => {
  res.render("pages/shoes");
});
router.get("/tela-inicial", (req, res) => {
  res.render("pages/tomarammeutela");
});
router.get("/informacoes", (req, res) => {
  res.render("pages/informacoes");
});

// CATEGORIAS DA LOJA
router.get("/esportes-performance", (req, res) => {
  res.render("pages/esportes-performance");
});
router.get("/beleza-cuidados", (req, res) => {
  res.render("pages/beleza-cuidados");
});
router.get("/suplementos-vitaminas", (req, res) => {
  res.render("pages/suplementos-vitaminas");
});
router.get("/bebes-criancas", (req, res) => {
  res.render("pages/bebes-criancas");
});
router.get("/saude-prevencao", (req, res) => {
  res.render("pages/saude-prevencao");
});
router.get("/higiene", (req, res) => {
  res.render("pages/higiene");
});

/*  ===================== ROTAS PRIVADAS (PRECISA DE LOGIN) ===================== */
router.get("/progressao", verificarAutenticacao, (req, res) => {
  res.render("pages/progressao");
});
router.get("/tarefas", verificarAutenticacao, (req, res) => {
  res.render("pages/tarefas");
});

// TAREFAS
router.get("/sono", verificarAutenticacao, (req, res) => {
  res.render("pages/sono");
});
router.get("/alimentacao", verificarAutenticacao, (req, res) => {
  res.render("pages/alimentacao");
});
router.get("/saudemen", verificarAutenticacao, (req, res) => {
  res.render("pages/saudemen");
});
router.get("/atividadefis", verificarAutenticacao, (req, res) => {
  res.render("pages/atividadefis");
});

// DOAÇÃO
router.get("/doacao", verificarAutenticacao, (req, res) => {
  res.render("pages/doacao");
});

// AGENDAMENTO DE CONSULTA
router.get("/agendamento1", verificarAutenticacao, (req, res) => {
  res.render("pages/agendamento1");
});
router.get("/agendamento2", verificarAutenticacao, (req, res) => {
  res.render("pages/agendamento2");
});
router.get("/agendamento3", verificarAutenticacao, (req, res) => {
  res.render("pages/agendamento3");
});
router.get("/agendamento4", verificarAutenticacao, (req, res) => {
  res.render("pages/agendamento4");
});

// PERFIL DO USUÁRIO
router.get("/perfil", verificarAutenticacao, (req, res) => {
  res.render("pages/perfil");
});
router.get("/minhaidentidade", verificarAutenticacao, (req, res) => {
  res.render("pages/minhaidentidade");
});
router.get("/minhasconsultas", verificarAutenticacao, (req, res) => {
  res.render("pages/minhasconsultas");
});
router.get("/meuspedidos", verificarAutenticacao, (req, res) => {
  res.render("pages/meuspedidos");
});
router.get("/meusfavoritos", verificarAutenticacao, (req, res) => {
  res.render("pages/meusfavoritos");
});
router.get("/meuscupons", verificarAutenticacao, (req, res) => {
  res.render("pages/meuscupons");
});
router.get("/minhasdoacoes", verificarAutenticacao, (req, res) => {
  res.render("pages/minhasdoacoes");
});
router.get("/meuspagamentos", verificarAutenticacao, (req, res) => {
  res.render("pages/meuspagamentos");
});
router.get("/suporte", verificarAutenticacao, (req, res) => {
  res.render("pages/suporte");
});

/*  ===================== ROTAS COM VALIDAÇÕES  ===================== */

//LOGIN
router.get("/login", (req, res) => {
  res.render("pages/login", {
    erro: null,
    valores: {
      usuarioDigitado: "",
      senhaDigitada: "",
    },
    sucesso: false,
  });
});

//CADASTRO CLIENTE
router.get("/cadastroCliente", (req, res) => {
  res.render("pages/cadastroCliente", {
    erros: null,
    valores: {
      nome: "",
      nomeusuario: "",
      email: "",
      data: "",
      senha: "",
      confirmarSenha: "",
    },
    retorno: null,
    erroValidacao: {},
    msgErro: {},
  });
});

//CADASTRO COLABORADOR (FARMÁCIA OU PROFISSIONAL)
router.get("/cadastroColaborador", (req, res) => {
  res.render("pages/cadastroColaborador", {
    // Farmácia
    valoresFarmacia: {
      nomeFarmacia: "",
      nomeusuario: "",
      CNPJ: "",
      responsavel: "",
      cidade: "",
      estado: "",
      email: "",
      data: "",
      senha: "",
      confirmarSenha: "",
    },
    erroValidacaoFarmacia: {},
    msgErroFarmacia: {},

    // Profissional
    valoresProfissional: {
      nome: "",
      nomeusuario: "",
      profissao: "",
      CREF: "",
      email: "",
      data: "",
      senha: "",
      confirmarSenha: "",
    },
    erroValidacaoProfissional: {},
    msgErroProfissional: {},

    retorno: null,
  });
});

/* ===================== ROUTER POST(VALIDAÇÕES) ===================== */

//CADASTRO SENDO CLIENTE
router.post(
  "/cadastroCliente",
  body("nome")
    .trim()
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("*O Nome de usuário deve conter entre 3 e 50 caracteres!")
    .matches(/^[A-Za-zÀ-ú\s]+$/)
    .withMessage("*O nome deve conter apenas letras!"),

  body("email")
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isEmail()
    .withMessage("*Endereço de email inválido!"),

  body("data")
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .custom((value) => {
      const dataNascimento = new Date(value);
      const hoje = new Date();
      const idadeMinima = 14;
      const idade = hoje.getFullYear() - dataNascimento.getFullYear();
      const mes = hoje.getMonth() - dataNascimento.getMonth();
      if (idade < idadeMinima || (idade === idadeMinima && mes < 0)) {
        throw new Error(`*Você deve ter pelo menos ${idadeMinima} anos.`);
      }
      return true;
    }),

  body("senha")
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isStrongPassword({
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "*Sua senha deve conter pelo menos: uma letra maiúscula, um número e um caractere especial!"
    ),

  body("confirmarSenha")
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .custom((value, { req }) => {
      if (value !== req.body.senha) {
        throw new Error("*As senhas não conferem!");
      }
      return true;
    }),

  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const erroValidacao = {};
      const msgErro = {};

      errors.array().forEach((erro) => {
        erroValidacao[erro.path] = "erro";
        msgErro[erro.path] = erro.msg;
      });

      return res.render("pages/cadastroCliente", {
        erros: errors,
        valores: req.body,
        retorno: null,
        erroValidacao,
        msgErro,
      });
    }

    // os dados do usuario sao puxados para o array usuarios
    usuarios.push({
      nome: req.body.nome,
      nomeusuario: req.body.nomeusuario,
      email: req.body.email,
      data: req.body.data,
      senha: req.body.senha,

      tipo: "cliente",
    });

    res.redirect("/login");
  }
);

//CADASTRO SENDO FARMÁCIA
router.post(
  "/cadastroFarmacia",
  body("nomeFarmacia")
    .trim()
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("*O Nome da farmácia deve conter entre 3 e 50 caracteres!"),

  body("CNPJ")
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .custom((value) => {
      const apenasNumeros = value.replace(/[^\d]+/g, "");
      if (apenasNumeros.length !== 14) {
        throw new Error("*O CNPJ deve conter exatamente 14 números!");
      }
      if (!validarCNPJ(value)) {
        throw new Error("*CNPJ inválido!");
      }
      return true;
    }),

  body("responsavel")
    .trim()
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("*O Nome do responsável deve conter entre 3 e 50 caracteres!"),

  body("cidade")
    .trim()
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("*A cidade deve conter entre 2 e 50 caracteres!"),

  body("estado")
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isLength({ min: 2, max: 2 })
    .withMessage("*O estado deve conter exatamente 2 caracteres!"),

  body("email")
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isEmail()
    .withMessage("*Endereço de email inválido!"),

  body("senha")
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isStrongPassword({
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minLength: 8,
    })
    .withMessage(
      "*Sua senha deve conter pelo menos: uma letra maiúscula, um número e um caractere especial!"
    ),

  body("confirmarSenha")
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .custom((value, { req }) => {
      if (value !== req.body.senha) {
        throw new Error("*As senhas não conferem!");
      }
      return true;
    }),

  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const erroValidacaoFarmacia = {};
      const msgErroFarmacia = {};

      errors.array().forEach((erro) => {
        erroValidacaoFarmacia[erro.path] = "erro";
        msgErroFarmacia[erro.path] = erro.msg;
      });

      return res.render("pages/cadastroColaborador", {
        valoresFarmacia: req.body,
        erroValidacaoFarmacia,
        msgErroFarmacia,

        // manter área profissional intacta
        valoresProfissional: {
          nome: "",
          nomeusuario: "",
          profissao: "",
          CREF: "",
          email: "",
          data: "",
          senha: "",
        },
        erroValidacaoProfissional: {},
        msgErroProfissional: {},
        retorno: null,
        formularioAtivo: "farmacia",
      });
    }
    // os dados do usuario sao puxados para o array usuarios
    usuarios.push({
      nomeFarmacia: req.body.nomeFarmacia,
      nomeusuario: req.body.nomeusuario,
      cnpj: req.body.CNPJ,
      responsavel: req.body.responsavel,
      cidade: req.body.cidade,
      estado: req.body.estado,
      email: req.body.email,
      data: req.body.data,
      senha: req.body.senha,
      tipo: "farmacia",
    });
    res.redirect("/login");
  }
);

//CADASTRO SENDO PROFISSIONAL
router.post(
  "/cadastroProfissional",

  body("nome")
    .trim()
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("*O Nome deve conter entre 3 e 50 caracteres!")
    .matches(/^[A-Za-zÀ-ú\s]+$/)
    .withMessage("*O nome deve conter apenas letras!"),

  body("profissao")
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("*A profissão deve conter entre 3 e 50 caracteres!"),

  body("CREF")
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .custom((value) => {
      const apenasNumeros = value.replace(/[^\d]+/g, "");
      if (apenasNumeros.length < 5 || apenasNumeros.length > 10) {
        throw new Error("*O CREF deve conter entre 5 e 10 números!");
      }
      return true;
    }),

  body("email")
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isEmail()
    .withMessage("*Endereço de email inválido!"),

  body("senha")
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isStrongPassword({
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minLength: 8,
    })
    .withMessage(
      "*Sua senha deve conter pelo menos: uma letra maiúscula, um número e um caractere especial!"
    ),

  body("confirmarSenha")
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .custom((value, { req }) => {
      if (value !== req.body.senha) {
        throw new Error("*As senhas não conferem!");
      }
      return true;
    }),

  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const erroValidacaoProfissional = {};
      const msgErroProfissional = {};

      errors.array().forEach((erro) => {
        erroValidacaoProfissional[erro.path] = "erro";
        msgErroProfissional[erro.path] = erro.msg;
      });

      return res.render("pages/cadastroColaborador", {
        valoresProfissional: req.body,
        erroValidacaoProfissional,
        msgErroProfissional,

        erroValidacaoFarmacia: {},
        msgErroFarmacia: {},

        valoresFarmacia: {
          nomeFarmacia: "",
          nomeusuario: "",
          CNPJ: "",
          responsavel: "",
          cidade: "",
          estado: "",
          email: "",
          senha: "",
          confirmarSenha: "",
        },

        retorno: null,
        formularioAtivo: "profissional",
      });
    }
    // os dados do usuario sao puxados para o array usuarios
    usuarios.push({
      nome: req.body.nome,
      profissao: req.body.profissao,
      CREF: req.body.CREF,
      email: req.body.email,
      nomeusuario: req.body.nomeusuario,
      senha: req.body.senha,
      tipo: "profissional",
    });

    res.redirect("/login");
  }
);

//LOGIN SENDO CLIENTE OU COLABORADOR
router.post("/login", (req, res) => {
  const { usuarioDigitado, senhaDigitada } = req.body;

  // Permitir login tanto por email quanto por nome de usuário
  const usuarioEncontrado = usuarios.find(
    (u) =>
      (u.email === usuarioDigitado || u.nomeusuario === usuarioDigitado) &&
      u.senha === senhaDigitada
  );

  if (usuarioEncontrado) {
    req.session.usuario = usuarioEncontrado;

    if (usuarioEncontrado.tipo === "farmacia") {
      // colaborador farmacia → vai pro painel admin
      return res.redirect("adm/home2");
    }
    if (usuarioEncontrado.tipo === "profissional") {
      // colaborador profissional → vai para o painel admin
      return res.redirect("adm/home3");
    }
    {
      // cliente → vai pro perfil normal
      return res.redirect("/tomarammeutela");
    }
  }
});

module.exports = router;
