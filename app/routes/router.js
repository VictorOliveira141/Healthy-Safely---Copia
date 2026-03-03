const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const verificarAutenticacao = require("../public/js/autenticacao");

/* middleware que garante usuário logado **e** do tipo "usuario/cliente" */
function verificarUsuario(req, res, next) {
  // primeiro garante que está autenticado
  if (!req.session || !req.session.usuario) {
    return res.redirect('/login');
  }

  // o projeto atualmente salva o tipo em usuario.tipo com valores
  // "cliente" ou "profissional"; alguns trechos futuros podem
  // utilizar "usuario" como sinônimo para cliente. Aceitamos ambos.
  const tipo = req.session.usuario.tipo;
  if (tipo === 'usuario' || tipo === 'cliente') {
    return next();
  }

  // caso seja profissional, vamos encaminhar à área correspondente
  return res.redirect('/profissional/dashboard');
}

const usuarios = []; /* array que armazena os usuarios*/

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
  res.render("pages/tomarammeutela");
});
router.get("/tela-inicial", (req, res) => {
  res.render("pages/tomarammeutela");
});

/*  ===================== ROTAS PRIVADAS (PRECISA DE LOGIN) ===================== */
router.get("/progressao", (req, res) => {
  // Calcular pontos totais e progresso
  const pontosTotais = tarefas
    .filter((t) => t.concluida)
    .reduce((sum, t) => sum + t.pontos, 0);
  const tarefasConcluidas = tarefas.filter((t) => t.concluida).length;
  const progresso = (tarefasConcluidas / tarefas.length) * 100;
  let medalha = "";
  if (pontosTotais >= 700) medalha = "Avançado";
  else if (pontosTotais >= 300) medalha = "Consistente";
  else if (pontosTotais >= 100) medalha = "Iniciante";

  res.render("pages/progressao", {
    pontosTotais,
    tarefasConcluidas,
    progresso,
    medalha,
    tarefas,
  });
});
router.get("/tarefas", (req, res) => {
  res.render("pages/tarefas", { tarefas });
});

// Rota exclusiva para usuário comum (cliente/usuario)
router.get("/dashboard", verificarUsuario, (req, res) => {
  // o middleware já garantiu que req.session.nome e nivel existem
  res.render("user/dashboard", {
    nome: req.session.nome,
    nivel: req.session.nivel,
  });
});

// TAREFAS
router.get("/sono", verificarAutenticacao, (req, res) => {
  res.render("pages/sono");
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

router.get("/perfil", (req, res) => {
  res.render("pages/perfil");
});

// Rota pública para painel local (front-end-only) usado pelo demo localStorage
router.get("/painel-local", (req, res) => {
  res.render("pages/painel-local");
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

  body("especialidade")
    .trim()
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("*A especialidade deve conter entre 3 e 50 caracteres!"),

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

  body("bio")
    .optional()
    .isLength({ max: 500 })
    .withMessage("*Bio deve ter no máximo 500 caracteres!"),

  body("cidadeEstado")
    .trim()
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("*Cidade/Estado deve conter entre 3 e 100 caracteres!"),

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

    // Dados do usuário são adicionados ao array
    usuarios.push({
      nome: req.body.nome,
      especialidade: req.body.especialidades,
      cref: req.body.cref,
      areaAtuacao: req.body.areaAtuacao,
      tempoExperiencia: req.body.tempoExperiencia,
      especialidades: req.body.especialidades,
      bio: req.body.bio,
      cidadeEstado: req.body.cidadeEstado,
      email: req.body.email,
      senha: req.body.senha,
      tipo: "profissional",
    });

    res.redirect("/login");
  },
);

//LOGIN SENDO CLIENTE
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  const usuarioEncontrado = usuarios.find(
    (u) => (u.email === email || u.nomeusuario === email) && u.senha === senha,
  );

  if (usuarioEncontrado) {
    // armazenamos o objeto inteiro e algumas propriedades em sessão
    req.session.usuario = usuarioEncontrado;
    req.session.nome = usuarioEncontrado.nome;
    // caso o cadastro futuro venha a possuir campo "nivel", usamos ele,
    // senão assumimos iniciante por padrão
    req.session.nivel = usuarioEncontrado.nivel || "iniciante";

    // redirecionamento por tipo de conta
    const tipo = usuarioEncontrado.tipo;
    if (tipo === 'profissional') {
      return res.redirect('/profissional/dashboard');
    }

    // tratar 'cliente' como usuário comum; aceitar também 'usuario' se existir
    if (tipo === 'cliente' || tipo === 'usuario') {
      return res.redirect('/dashboard');
    }

    // fallback: rota pública
    return res.redirect('/tomarammeutela');
  }

  // SE FALHAR:
  return res.render("pages/login", {
    erro: "Usuário ou senha incorretos!",
    valores: { email },
    erroValidacao: {},
    msgErro: {},
    sucesso: false,
  });
});

module.exports = router;
