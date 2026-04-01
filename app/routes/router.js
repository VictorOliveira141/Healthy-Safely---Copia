const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const verificarAutenticacao = require("../public/js/autenticacao");

const usuarios = [];

// middleware para verificar se o usuário está logado
function verificarUsuario(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.redirect("/login");
  }
  const tipo = req.session.usuario.tipo;
  if (tipo === "usuario" || tipo === "cliente") {
    return next();
  }

  return res.redirect("/profissional/dashboard");
}

// Dados mockados para tarefas
const tarefas = [
  { id: 1, nome: "Beber água (2L)", pontos: 10, concluida: false },
  { id: 2, nome: "Dormir bem (8h)", pontos: 15, concluida: true },
  { id: 3, nome: "Fazer exercício físico", pontos: 20, concluida: false },
  { id: 4, nome: "Comer frutas e vegetais", pontos: 10, concluida: true },
  { id: 5, nome: "Meditar por 10 minutos", pontos: 15, concluida: false },
];

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
  if (req.session && req.session.usuario) {
    return res.redirect("/dashboard");
  } else {
    res.render("pages/tomarammeutela");
  }
});
router.get("/ajuda", (req, res) => {
  res.render("pages/ajuda");
});

router.get("/plano-premium", (req, res) => {
  res.render("pages/plano-premium");
});
router.get("/plano-comum", (req, res) => {
  res.render("pages/plano-comum");
});

/*  ===================== ROTAS PRIVADAS (PRECISA DE LOGIN) ===================== */

router.get("/tasks", verificarAutenticacao, (req, res) => {
  const tasks = tarefas.map((t) => ({
    _id: t.id,
    title: t.nome,
    completed: t.concluida,
  }));
  res.render("user/tasks", { tasks });
});
router.get("/dashboard", verificarAutenticacao, (req, res) => {
  res.render("user/dashboard", {
    nome: req.session.nome,
    nivel: req.session.nivel,
  });
});
router.get("/sono", verificarAutenticacao, (req, res) => {
  res.render("pages/sono");
});
//PROGRESSÃO E PAINEL LOCAL
router.get("/perfil", verificarAutenticacao, (req, res) => {
  res.render("pages/perfil");
});
router.get("/painel-local", verificarAutenticacao, (req, res) => {
  res.render("pages/painel-local");
});
router.get("/saude-mental", verificarAutenticacao, (req, res) => {
  res.render("pages/saude-mental");
});
router.get("/atividade-fisica", verificarAutenticacao, (req, res) => {
  res.render("pages/atividade-fisica");
});
router.get("/alimentacao", verificarAutenticacao, (req, res) => {
  res.render("pages/alimentacao");
});
router.get("/configuracoes", verificarAutenticacao, (req, res) => {
  res.render("pages/configuracoes");
});
router.get("/notificacoes", verificarAutenticacao, (req, res) => {
  res.render("pages/notificacoes");
});
router.get("/privacidade", verificarAutenticacao, (req, res) => {
  res.render("pages/privacidade");
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

//CADASTRO
router.get("/cadastro", (req, res) => {
  res.render("pages/cadastro");
});
router.get("/cadastroCliente", (req, res) => {
  res.render("pages/cadastroCliente", {
    valores: {},
    erroValidacao: {},
    msgErro: {},
  });
});
router.get("/cadastroProfissional", (req, res) => {
  res.render("pages/cadastroProfissional", {
    valores: {},
    erroValidacao: {},
    msgErro: {},
  });
});

/* ===================== ROUTER POST(VALIDAÇÕES) ===================== */

//CADASTRO SENDO CLIENTE
router.post(
  "/cadastroCliente",
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
      "*Sua senha deve conter pelo menos: uma letra maiúscula, um número e um caractere especial!",
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

  body("nome")
    .trim()
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("*O Nome deve conter entre 3 e 50 caracteres!")
    .matches(/^[A-Za-zÀ-ú\s]+$/)
    .withMessage("*O nome deve conter apenas letras!"),

  body("nomeusuario")
    .trim()
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("*Nome de usuário deve conter entre 3 e 30 caracteres!")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "*Nome de usuário deve conter apenas letras, números, hífen e underscore!",
    ),

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

    //os dados do usuario sao puxados para o array usuarios
    usuarios.push({
      nome: req.body.nome,
      nomeusuario: req.body.nomeusuario,
      email: req.body.email,
      senha: req.body.senha,

      tipo: "cliente",
    });

    res.redirect("/login");
  },
);

//CADASTRO PROFISSIONAL
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

  body("cref")
    .trim()
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isLength({ min: 5, max: 20 })
    .withMessage("*CREF inválido!"),

  body("areaAtuacao").notEmpty().withMessage("*Campo obrigatório!"),

  body("tempoExperiencia")
    .isInt({ min: 0 })
    .withMessage("*Tempo de experiência deve ser um número positivo!"),

  body("especialidades")
    .trim()
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isLength({ min: 3, max: 200 })
    .withMessage("*Especialidades devem conter entre 3 e 200 caracteres!"),

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
      "*Sua senha deve conter pelo menos: uma letra maiúscula, um número e um caractere especial!",
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

      return res.render("pages/cadastroProfissional", {
        valores: req.body,
        erroValidacao,
        msgErro,
        retorno: null,
      });
    }

    //Dados do usuário são adicionados ao array
    const novoProfissional = {
      nome: req.body.nome,
      nomeusuario: req.body.nomeusuario,
      especialidade: req.body.especialidades,
      cref: req.body.cref,
      areaAtuacao: req.body.areaAtuacao,
      tempoExperiencia: req.body.tempoExperiencia,
      especialidades: req.body.especialidades,
      email: req.body.email,
      senha: req.body.senha,
      tipo: "profissional",
      nivel: "profissional",
    };
    usuarios.push(novoProfissional);

    // Criar sessão imediatamente após cadastro
    req.session.usuario = novoProfissional;
    req.session.nome = novoProfissional.nome;
    req.session.nivel = "profissional";

    res.redirect("/profissional/painel-financeiro");
  },
);

//LOGIN SENDO CLIENTE
router.post("/login", (req, res) => {
  const email = req.body["email-login"];
  const senha = req.body["senha-login"];

  const usuarioEncontrado = usuarios.find(
    (u) => (u.email === email || u.nomeusuario === email) && u.senha === senha,
  );

  if (usuarioEncontrado) {
    req.session.usuario = usuarioEncontrado;
    req.session.nome = usuarioEncontrado.nome;
    req.session.nivel = usuarioEncontrado.nivel || "iniciante";

    const tipo = usuarioEncontrado.tipo;

    if (tipo === "profissional") {
      return res.redirect("/profissional/dashboard");
    }

    if (tipo === "cliente" || tipo === "usuario") {
      return res.redirect("/dashboard");
    }

    return res.redirect("/tomarammeutela");
  }

  return res.render("pages/login", {
    erro: "⚠️Usuário ou senha incorretos.Tente novamente.",
    valores: { email },
    erroValidacao: {},
    msgErro: {},
    sucesso: false,
  });
});

module.exports = router;
