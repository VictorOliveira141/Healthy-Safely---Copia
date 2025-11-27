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
router.get("/acessorios", (req, res) => {
  res.render("pages/acessorios");
});
router.get("/equipa", (req, res) => {
  res.render("pages/equipa");
});
router.get("/roupasesp", (req, res) => {
  res.render("pages/roupasseps");
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

// PRODUTOS
router.get("/produto2", (req, res) => {
  res.render("pages/produto2");
});
router.get("/produto3", (req, res) => {
  res.render("pages/produto3");
});
router.get("/produto4", (req, res) => {
  res.render("pages/produto4");
});
router.get("/produto5", (req, res) => {
  res.render("pages/produto5");
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
      email: "",
      senha: "",
    },
    erroValidacao: {},
    msgErro: {},
    sucesso: false,
  });
});

//CADASTRO CLIENTE
router.get("/cadastroCliente", (req, res) => {
  res.render("pages/cadastroCliente", {
    erros: null,
    valores: {
      nomeusuario: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    },
    retorno: null,
    erroValidacao: {},
    msgErro: {},
  });
});

//CADASTRO COLABORADOR (FARMÁCIA)
router.get("/cadastroColaborador", (req, res) => {
  res.render("pages/cadastroColaborador", {
    valores: {
      nome: "",
      nomeFarmacia: "",
      nomeusuario: "",
      CNPJ: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    },
    erroValidacao: {},
    msgErro: {},
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
      senha: req.body.senha,

      tipo: "cliente",
    });

    res.redirect("/login");
  }
);

//CADASTRO SENDO COLABORADOR (FARMÁCIA)
router.post(
  "/cadastroColaborador",
  body("nome")
    .trim()
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("*O Nome do Responsável deve conter entre 3 e 50 caracteres!")
    .matches(/^[A-Za-zÀ-ú\s]+$/)
    .withMessage("*O nome deve conter apenas letras!"),

  body("nomeFarmacia")
    .trim()
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("*O Nome da Farmácia deve conter entre 3 e 50 caracteres!"),

  body("nomeusuario")
    .trim()
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("*O Nome de usuário deve conter entre 3 e 30 caracteres!"),

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
      const erroValidacao = {};
      const msgErro = {};

      errors.array().forEach((erro) => {
        erroValidacao[erro.path] = "erro";
        msgErro[erro.path] = erro.msg;
      });

      return res.render("pages/cadastroColaborador", {
        valores: req.body,
        erroValidacao,
        msgErro,
        retorno: null,
      });
    }

    // Dados do usuário são adicionados ao array
    usuarios.push({
      nome: req.body.nome,
      nomeFarmacia: req.body.nomeFarmacia,
      nomeusuario: req.body.nomeusuario,
      cnpj: req.body.CNPJ,
      email: req.body.email,
      senha: req.body.senha,
      tipo: "farmacia",
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
    } else {
      // cliente → vai pro perfil normal
      return res.redirect("/tomarammeutela");
    }
  }
});

module.exports = router;
