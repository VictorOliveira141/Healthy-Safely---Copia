const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// Array em memória (simulação de banco)
const usuarios = [];

// ── Middlewares ───────────────────────────────────────────
function verificarAutenticacao(req, res, next) {
  if (!req.session || !req.session.usuario) return res.redirect("/login");
  const tipo = req.session.usuario.tipo;
  if (tipo === "profissional") return res.redirect("/profissional/painel");
  return next();
}

function apenasUsuario(req, res, next) {
  if (!req.session || !req.session.usuario) return res.redirect("/login");
  return next();
}

// Dados mockados de tarefas
const tarefasMock = [
  { id: 1, nome: "Beber água (2L)",          pontos: 10, concluida: false },
  { id: 2, nome: "Dormir bem (8h)",           pontos: 15, concluida: true  },
  { id: 3, nome: "Fazer exercício físico",    pontos: 20, concluida: false },
  { id: 4, nome: "Comer frutas e vegetais",   pontos: 10, concluida: true  },
  { id: 5, nome: "Meditar por 10 minutos",    pontos: 15, concluida: false },
];

/* ── LOGOUT ──────────────────────────────────────────────── */
router.get("/sair",   (req, res) => { req.session.destroy(() => res.redirect("/login")); });
router.get("/logout", (req, res) => { req.session.destroy(() => res.redirect("/login")); });

/* ── ROTAS PÚBLICAS ─────────────────────────────────────── */
router.get("/",              (req, res) => res.render("pages/tomarammeutela"));
router.get("/tomarammeutela",(req, res) => {
  if (req.session && req.session.usuario) return res.redirect("/dashboard");
  res.render("pages/tomarammeutela");
});
router.get("/ajuda",         (req, res) => res.render("pages/ajuda"));
router.get("/planos",        (req, res) => res.render("pages/planos"));

/* ── ROTAS PRIVADAS (usuário) ───────────────────────────── */
router.get("/dashboard", verificarAutenticacao, (req, res) => {
  res.render("user/dashboard", {
    nome:  req.session.nome,
    nivel: req.session.nivel,
  });
});

router.get("/tasks", verificarAutenticacao, (req, res) => {
  const tasks = tarefasMock.map(t => ({ _id: t.id, title: t.nome, completed: t.concluida }));
  res.render("user/tasks", { tasks });
});

router.get("/historico",       verificarAutenticacao, (req, res) => res.render("user/historico"));
router.get("/sono",            verificarAutenticacao, (req, res) => res.render("pages/sono"));
router.get("/saude-mental",    verificarAutenticacao, (req, res) => res.render("pages/saude-mental"));
router.get("/atividade-fisica",verificarAutenticacao, (req, res) => res.render("pages/atividade-fisica"));
router.get("/alimentacao",     verificarAutenticacao, (req, res) => res.render("pages/alimentacao"));
router.get("/perfil",          verificarAutenticacao, (req, res) => res.render("pages/perfil"));
router.get("/notificacoes",    verificarAutenticacao, (req, res) => res.render("pages/notificacoes"));
router.get("/configuracoes",   apenasUsuario,         (req, res) => res.render("pages/configuracoes"));
router.get("/privacidade",     apenasUsuario,         (req, res) => res.render("pages/privacidade"));
router.get("/amizades",        verificarAutenticacao, (req, res) => res.render("pages/amizades"));
router.get("/perfil-amizade",  verificarAutenticacao, (req, res) => res.render("pages/perfil-amizade"));
router.get("/painel-local",    verificarAutenticacao, (req, res) => res.render("pages/painel-local"));

/* ── LOGIN / CADASTRO ───────────────────────────────────── */
router.get("/login", (req, res) => res.render("pages/login", {
  erro: null, valores: { email: "" }, erroValidacao: {}, msgErro: {}, sucesso: false,
}));

router.get("/cadastro",              (req, res) => res.render("pages/cadastro"));
router.get("/cadastroCliente",       (req, res) => res.render("pages/cadastroCliente",      { valores: {}, erroValidacao: {}, msgErro: {} }));
router.get("/cadastroProfissional",  (req, res) => res.render("pages/cadastroProfissional", { valores: {}, erroValidacao: {}, msgErro: {} }));

/* ── POST: CADASTRO CLIENTE ─────────────────────────────── */
router.post("/cadastroCliente",
  body("email").notEmpty().withMessage("*Campo obrigatório!").bail().isEmail().withMessage("*E-mail inválido!"),
  body("senha").notEmpty().withMessage("*Campo obrigatório!").bail()
    .isStrongPassword({ minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1 })
    .withMessage("*Senha fraca: use maiúscula, número e símbolo!"),
  body("confirmarSenha").notEmpty().withMessage("*Campo obrigatório!")
    .custom((v, { req }) => { if (v !== req.body.senha) throw new Error("*As senhas não conferem!"); return true; }),
  body("nome").trim().notEmpty().withMessage("*Campo obrigatório!").bail()
    .isLength({ min:3, max:50 }).withMessage("*Entre 3 e 50 caracteres!")
    .matches(/^[A-Za-zÀ-ú\s]+$/).withMessage("*Somente letras!"),
  body("nomeusuario").trim().notEmpty().withMessage("*Campo obrigatório!").bail()
    .isLength({ min:3, max:30 }).withMessage("*Entre 3 e 30 caracteres!")
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage("*Somente letras, números, hífen e underscore!"),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const erroValidacao = {}, msgErro = {};
      errors.array().forEach(e => { erroValidacao[e.path] = "erro"; msgErro[e.path] = e.msg; });
      return res.render("pages/cadastroCliente", { erros: errors, valores: req.body, erroValidacao, msgErro });
    }
    const novoUsuario = {
      nome: req.body.nome, nomeusuario: req.body.nomeusuario,
      email: req.body.email, senha: req.body.senha, tipo: "cliente", nivel: "iniciante",
    };
    usuarios.push(novoUsuario);
    req.session.usuario = novoUsuario;
    req.session.nome    = novoUsuario.nome;
    req.session.nivel   = "iniciante";
    res.redirect("/dashboard");
  }
);

/* ── POST: CADASTRO PROFISSIONAL ────────────────────────── */
router.post("/cadastroProfissional",
  body("nome").trim().notEmpty().withMessage("*Campo obrigatório!").bail()
    .isLength({ min:3, max:50 }).withMessage("*Entre 3 e 50 caracteres!")
    .matches(/^[A-Za-zÀ-ú\s]+$/).withMessage("*Somente letras!"),
  body("email").notEmpty().withMessage("*Campo obrigatório!").bail().isEmail().withMessage("*E-mail inválido!"),
  body("cref").trim().notEmpty().withMessage("*Campo obrigatório!").bail()
    .isLength({ min:5, max:20 }).withMessage("*CREF inválido!"),
  body("areaAtuacao").notEmpty().withMessage("*Selecione a área de atuação!"),
  body("tempoExperiencia").isInt({ min:0 }).withMessage("*Informe anos de experiência (0 ou mais)!"),
  body("especialidades").trim().notEmpty().withMessage("*Campo obrigatório!").bail()
    .isLength({ min:3, max:200 }).withMessage("*Entre 3 e 200 caracteres!"),
  body("senha").notEmpty().withMessage("*Campo obrigatório!").bail()
    .isStrongPassword({ minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1 })
    .withMessage("*Senha fraca: use maiúscula, número e símbolo!"),
  body("confirmarSenha").notEmpty().withMessage("*Campo obrigatório!")
    .custom((v, { req }) => { if (v !== req.body.senha) throw new Error("*As senhas não conferem!"); return true; }),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const erroValidacao = {}, msgErro = {};
      errors.array().forEach(e => { erroValidacao[e.path] = "erro"; msgErro[e.path] = e.msg; });
      return res.render("pages/cadastroProfissional", { valores: req.body, erroValidacao, msgErro });
    }
    const novoProfissional = {
      nome: req.body.nome, nomeusuario: req.body.nomeusuario || req.body.nome.toLowerCase().replace(/\s+/g,"_"),
      email: req.body.email, senha: req.body.senha,
      cref: req.body.cref, areaAtuacao: req.body.areaAtuacao,
      tempoExperiencia: req.body.tempoExperiencia,
      especialidades: req.body.especialidades,
      tipo: "profissional", nivel: "profissional",
    };
    usuarios.push(novoProfissional);
    req.session.usuario = novoProfissional;
    req.session.nome    = novoProfissional.nome;
    req.session.nivel   = "profissional";
    res.redirect("/profissional/painel");   // ← rota correta
  }
);

/* ── POST: LOGIN ────────────────────────────────────────── */
router.post("/login", (req, res) => {
  const email = req.body["email-login"];
  const senha  = req.body["senha-login"];
  const found  = usuarios.find(u => (u.email === email || u.nomeusuario === email) && u.senha === senha);
  if (!found) {
    return res.render("pages/login", {
      erro: "⚠️ Usuário ou senha incorretos.", valores: { email },
      erroValidacao: {}, msgErro: {}, sucesso: false,
    });
  }
  req.session.usuario = found;
  req.session.nome    = found.nome;
  req.session.nivel   = found.nivel || "iniciante";
  if (found.tipo === "profissional") return res.redirect("/profissional/painel");
  return res.redirect("/dashboard");
});

module.exports = router;
