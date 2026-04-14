const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const verificarAutenticacao = require("../public/js/autenticacao");

// ✅ Models com MySQL (substitui os arrays em memória)
const Usuario = require("../models/Usuario");
const Tarefa  = require("../models/Tarefa");

// Middleware: somente clientes acessam rotas de usuário
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

/* ROTA PARA DESLOGAR */
router.get("/sair", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

/* ===================== ROTAS PÚBLICAS ===================== */
router.get("/", (req, res) => res.render("pages/tomarammeutela"));
router.get("/tomarammeutela", (req, res) => {
  if (req.session && req.session.usuario) return res.redirect("/dashboard");
  res.render("pages/tomarammeutela");
});
router.get("/ajuda",         (req, res) => res.render("pages/ajuda"));
router.get("/configuracoes", (req, res) => res.render("pages/configuracoes"));

/* ===================== ROTAS PRIVADAS ===================== */
router.get("/tasks", verificarAutenticacao, async (req, res) => {
  try {
    const tarefas = await Tarefa.listarPorUsuario(req.session.usuario.id);
    const tasks = tarefas.map((t) => ({
      _id: t.id, title: t.titulo, completed: !!t.concluida,
    }));
    res.render("user/tasks", { tasks });
  } catch (err) {
    console.error("Erro ao carregar tarefas:", err);
    res.render("user/tasks", { tasks: [] });
  }
});

router.get("/dashboard", verificarAutenticacao, (req, res) => {
  res.render("user/dashboard", { nome: req.session.nome, nivel: req.session.nivel });
});

router.get("/sono",             verificarAutenticacao, (req, res) => res.render("pages/sono"));
router.get("/painel-local",     verificarAutenticacao, (req, res) => res.render("pages/painel-local"));
router.get("/saude-mental",     verificarAutenticacao, (req, res) => res.render("pages/saude-mental"));
router.get("/atividade-fisica", verificarAutenticacao, (req, res) => res.render("pages/atividade-fisica"));
router.get("/alimentacao",      verificarAutenticacao, (req, res) => res.render("pages/alimentacao"));
router.get("/perfil",           verificarAutenticacao, (req, res) => res.render("pages/perfil"));
router.get("/perfil-amizade",   verificarAutenticacao, (req, res) => res.render("pages/perfil-amizade"));
router.get("/notificacoes",     verificarAutenticacao, (req, res) => res.render("pages/notificacoes"));
router.get("/privacidade",      verificarAutenticacao, (req, res) => res.render("pages/privacidade"));
router.get("/amizades",         verificarAutenticacao, (req, res) => res.render("pages/amizades"));

/* ===================== LOGIN ===================== */
router.get("/login", (req, res) => {
  res.render("pages/login", {
    erro: null, valores: { email: "", senha: "" },
    erroValidacao: {}, msgErro: {}, sucesso: false,
  });
});

/* ===================== CADASTRO GETs ===================== */
router.get("/cadastro", (req, res) => res.render("pages/cadastro"));
router.get("/cadastroCliente", (req, res) => {
  res.render("pages/cadastroCliente", { valores: {}, erroValidacao: {}, msgErro: {} });
});
router.get("/cadastroProfissional", (req, res) => {
  res.render("pages/cadastroProfissional", { valores: {}, erroValidacao: {}, msgErro: {} });
});

/* ===================== CADASTRO CLIENTE POST ===================== */
router.post(
  "/cadastroCliente",
  body("email").notEmpty().withMessage("*Campo obrigatório!").bail().isEmail().withMessage("*Endereço de email inválido!"),
  body("senha").notEmpty().withMessage("*Campo obrigatório!").bail()
    .isStrongPassword({ minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    .withMessage("*Sua senha deve conter pelo menos: uma letra maiúscula, um número e um caractere especial!"),
  body("confirmarSenha").notEmpty().withMessage("*Campo obrigatório!").custom((value, { req }) => {
    if (value !== req.body.senha) throw new Error("*As senhas não conferem!");
    return true;
  }),
  body("nome").trim().notEmpty().withMessage("*Campo obrigatório!").bail()
    .isLength({ min: 3, max: 50 }).withMessage("*O Nome deve conter entre 3 e 50 caracteres!")
    .matches(/^[A-Za-zÀ-ú\s]+$/).withMessage("*O nome deve conter apenas letras!"),
  body("nomeusuario").trim().notEmpty().withMessage("*Campo obrigatório!").bail()
    .isLength({ min: 3, max: 30 }).withMessage("*Nome de usuário deve conter entre 3 e 30 caracteres!")
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage("*Nome de usuário deve conter apenas letras, números, hífen e underscore!"),

  async (req, res) => {
    const errors = validationResult(req);
    const erroValidacao = {}, msgErro = {};

    if (!errors.isEmpty()) {
      errors.array().forEach((e) => { erroValidacao[e.path] = "erro"; msgErro[e.path] = e.msg; });
      return res.render("pages/cadastroCliente", { valores: req.body, erroValidacao, msgErro, retorno: null });
    }

    try {
      if (await Usuario.emailExiste(req.body.email)) {
        erroValidacao.email = "erro"; msgErro.email = "*Este email já está cadastrado!";
        return res.render("pages/cadastroCliente", { valores: req.body, erroValidacao, msgErro, retorno: null });
      }
      if (await Usuario.nomeUsuarioExiste(req.body.nomeusuario)) {
        erroValidacao.nomeusuario = "erro"; msgErro.nomeusuario = "*Este nome de usuário já está em uso!";
        return res.render("pages/cadastroCliente", { valores: req.body, erroValidacao, msgErro, retorno: null });
      }

      await Usuario.criarCliente({
        nome: req.body.nome, nomeusuario: req.body.nomeusuario,
        email: req.body.email, senha: req.body.senha,
      });

      res.redirect("/login");
    } catch (err) {
      console.error("Erro ao cadastrar cliente:", err);
      res.render("pages/cadastroCliente", { valores: req.body, erroValidacao: {}, msgErro: {}, retorno: "Erro interno. Tente novamente." });
    }
  }
);

/* ===================== CADASTRO PROFISSIONAL POST ===================== */
router.post(
  "/cadastroProfissional",
  body("nome").trim().notEmpty().withMessage("*Campo obrigatório!").bail()
    .isLength({ min: 3, max: 50 }).withMessage("*O Nome deve conter entre 3 e 50 caracteres!")
    .matches(/^[A-Za-zÀ-ú\s]+$/).withMessage("*O nome deve conter apenas letras!"),
  body("cref").trim().notEmpty().withMessage("*Campo obrigatório!").bail()
    .isLength({ min: 5, max: 20 }).withMessage("*CREF inválido!"),
  body("areaAtuacao").notEmpty().withMessage("*Campo obrigatório!"),
  body("tempoExperiencia").isInt({ min: 0 }).withMessage("*Tempo de experiência deve ser um número positivo!"),
  body("especialidades").trim().notEmpty().withMessage("*Campo obrigatório!").bail()
    .isLength({ min: 3, max: 200 }).withMessage("*Especialidades devem conter entre 3 e 200 caracteres!"),
  body("email").notEmpty().withMessage("*Campo obrigatório!").bail().isEmail().withMessage("*Endereço de email inválido!"),
  body("senha").notEmpty().withMessage("*Campo obrigatório!").bail()
    .isStrongPassword({ minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    .withMessage("*Sua senha deve conter pelo menos: uma letra maiúscula, um número e um caractere especial!"),
  body("confirmarSenha").notEmpty().withMessage("*Campo obrigatório!").custom((value, { req }) => {
    if (value !== req.body.senha) throw new Error("*As senhas não conferem!");
    return true;
  }),

  async (req, res) => {
    const errors = validationResult(req);
    const erroValidacao = {}, msgErro = {};

    if (!errors.isEmpty()) {
      errors.array().forEach((e) => { erroValidacao[e.path] = "erro"; msgErro[e.path] = e.msg; });
      return res.render("pages/cadastroProfissional", { valores: req.body, erroValidacao, msgErro, retorno: null });
    }

    try {
      if (await Usuario.emailExiste(req.body.email)) {
        erroValidacao.email = "erro"; msgErro.email = "*Este email já está cadastrado!";
        return res.render("pages/cadastroProfissional", { valores: req.body, erroValidacao, msgErro, retorno: null });
      }

      const novoProfissional = await Usuario.criarProfissional({
        nome: req.body.nome, nomeusuario: req.body.nomeusuario,
        email: req.body.email, senha: req.body.senha,
        cref: req.body.cref, areaAtuacao: req.body.areaAtuacao,
        tempoExperiencia: req.body.tempoExperiencia, especialidades: req.body.especialidades,
      });

      req.session.usuario = novoProfissional;
      req.session.nome    = novoProfissional.nome;
      req.session.nivel   = "profissional";

      res.redirect("/profissional/painel-financeiro");
    } catch (err) {
      console.error("Erro ao cadastrar profissional:", err);
      res.render("pages/cadastroProfissional", { valores: req.body, erroValidacao: {}, msgErro: {}, retorno: "Erro interno. Tente novamente." });
    }
  }
);

/* ===================== LOGIN POST ===================== */
router.post("/login", async (req, res) => {
  const email = req.body["email-login"];
  const senha  = req.body["senha-login"];

  try {
    const usuarioEncontrado = await Usuario.buscarPorEmailOuNome(email);

    if (usuarioEncontrado && usuarioEncontrado.senha === senha) {
      req.session.usuario = usuarioEncontrado;
      req.session.nome    = usuarioEncontrado.nome;
      req.session.nivel   = usuarioEncontrado.nivel || "iniciante";

      if (usuarioEncontrado.tipo === "profissional") return res.redirect("/profissional/dashboard");
      return res.redirect("/dashboard");
    }

    return res.render("pages/login", {
      erro: "⚠️ Usuário ou senha incorretos. Tente novamente.",
      valores: { email }, erroValidacao: {}, msgErro: {}, sucesso: false,
    });
  } catch (err) {
    console.error("Erro no login:", err);
    return res.render("pages/login", {
      erro: "Erro interno. Tente novamente.",
      valores: { email }, erroValidacao: {}, msgErro: {}, sucesso: false,
    });
  }
});

module.exports = router;
