const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const usuarios = [];
var { validarCNPJ } = require("../helpers/validacaoPersonalizada");

/* ROTAS DAS PÁGINAS */
router.get("/", (req, res) => {
  res.render("pages/tomarammeutela");
});

router.get("/tomarammeutela", (req, res) => {
  res.render("pages/tomarammeutela");
});

router.get("/progressao", (req, res) => {
  res.render("pages/progressao");
});

router.get("/tarefas", (req, res) => {
  res.render("pages/tarefas");
});

router.get("/loja", (req, res) => {
  res.render("pages/loja");
});
router.get("/sono", (req, res) => {
  res.render("pages/sono");
});
router.get("/alimentacao", (req, res) => {
  res.render("pages/alimentacao");
});
router.get("/saudemen", (req, res) => {
  res.render("pages/saudemen");
});
router.get("/atividadefis", (req, res) => {
  res.render("pages/atividadefis");
});

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

router.get("/cadastroCliente", (req, res) => {
  res.render("pages/cadastroCliente", {
    erros: null,
    valores: {
      nome: "",
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

router.get("/cadastroColaborador", (req, res) => {
  res.render("pages/cadastroColaborador", {
    // Farmácia
    valoresFarmacia: {
      nomeFarmacia: "",
      CNPJ: "",
      responsavel: "",
      cidade: "",
      estado: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    },
    erroValidacaoFarmacia: {},
    msgErroFarmacia: {},

    // Profissional
    valoresProfissional: {
      nome: "",
      profissao: "",
      CREF: "",
      especialidade: "",
      whatsapp: "",
      senha: "",
      confirmarSenha: "",
    },
    erroValidacaoProfissional: {},
    msgErroProfissional: {},

    retorno: null,
  });
});

router.get("/tela-inicial", (req, res) => {
  res.render("pages/tomarammeutela");
});

router.get("/informacoes", (req, res) => {
  res.render("pages/informacoes");
});

router.get("/orientacoes", (req, res) => {
  res.render("pages/orientacoes");
});

/* CADASTRO SENDO CLIENTE */
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
      email: req.body.email,
      senha: req.body.senha,
    });

    res.redirect("/login");
  }
);

/* CADASTRO SENDO FARMÁCIA */
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
          profissao: "",
          CREF: "",
          especialidade: "",
          whatsapp: "",
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
      email: req.body.email,
      senha: req.body.senha,
    });
    res.redirect("/login");
  }
);

/* CADASTRO SENDO PROFISSIONAL */
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

  body("especialidade")
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("*A especialidade deve conter entre 3 e 50 caracteres!"),

  body("whatsapp")
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .matches(/^\d{11}$/)
    .withMessage("*O WhatsApp deve conter exatamente 11 dígitos!"),

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
      email: req.body.email,
      senha: req.body.senha,
    });

    res.redirect("/login");
  }
);

/* LOGIN */
router.post("/login", (req, res) => {
  const { usuarioDigitado, senhaDigitada } = req.body;

  const usuarioEncontrado = usuarios.find(
    (u) => u.email === usuarioDigitado && u.senha === senhaDigitada
  );

  if (usuarioEncontrado) {
    return res.render("pages/tomarammeutela");
  } else {
    return res.render("pages/login", {
      erro: "*Não reconhecemos estas credenciais. Tente novamente.",
      sucesso: false,
      valores: {
        usuarioDigitado: usuarioDigitado,
        senhaDigitada: senhaDigitada,
      },
    });
  }
});

module.exports = router;
