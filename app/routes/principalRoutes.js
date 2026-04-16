const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");
const tarefaController = require("../controllers/tarefaController");
const verificarAutenticacao = require("../public/js/autenticacao");

/* ── MIDDLEWARES ─────────────────────────────────────────────── */
// Middleware: garante que apenas clientes acessem rotas de cliente, e profissionais acessem rotas de profissional
function apenasCliente(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.redirect("/login");
  }

  if (req.session.usuario.tipo !== "cliente") {
    return res.redirect("/profissional/painel-financeiro");
  }

  next();
}

// Middleware: garante que apenas usuários autenticados acessem certas rotas
function apenasAutenticado(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.redirect("/login");
  }
  next();
}

/* ── ROTAS GERAIS (apenas usuarios autenticados tem acesso) ───────────────────── */
router.get("/notificacoes", apenasCliente, (req, res) =>
  res.render("pages/notificacoes"),
);

router.get("/privacidade", apenasCliente, (req, res) =>
  res.render("pages/privacidade"),
);

router.get("/perfil", apenasAutenticado, (req, res) =>
  res.render("pages/perfil"),
);

/* ── ROTAS PÚBLICAS (usuarios SEM LOGIN podem acessar) ─────────────────────────────────────── */
router.get("/", (req, res) => res.render("pages/tomarammeutela"));

router.get("/tomarammeutela", (req, res) => {
  if (req.session && req.session.usuario) return res.redirect("/dashboard");
  res.render("pages/tomarammeutela");
});

router.get("/ajuda", (req, res) => res.render("pages/ajuda"));

router.get("/configuracoes", (req, res) => res.render("pages/configuracoes"));

router.get("/cadastro", (req, res) => res.render("pages/cadastro"));

router.get("/cadastroCliente", usuarioController.exibirCadastroCliente);

router.get(
  "/cadastroProfissional",
  usuarioController.exibirCadastroProfissional,
);

router.get("/login", usuarioController.exibirLogin);

// POSTs de cadastro: recebem os dados do formulário, validam e criam o usuário no banco de dados
router.post(
  "/cadastroCliente",
  usuarioController.regrasValidacaoCliente,
  usuarioController.cadastrarCliente,
);

router.post(
  "/cadastroProfissional",
  usuarioController.regrasValidacaoProfissional,
  usuarioController.cadastrarProfissional,
);

router.post("/login", usuarioController.login);

/* ── ROTAS CLIENTE (apenas usuarios como cliente tem acesso) ───────────────────── */
router.get("/dashboard", apenasCliente, tarefaController.exibirDashboard);

router.get("/tasks", apenasCliente, tarefaController.listarTarefas);

router.get(
  "/tasks/concluir",
  apenasCliente,
  tarefaController.alternarConclusao,
);

router.get("/sono", apenasCliente, (req, res) => res.render("pages/sono"));

router.get("/saude-mental", apenasCliente, (req, res) =>
  res.render("pages/saude-mental"),
);

router.get("/atividade-fisica", apenasCliente, (req, res) =>
  res.render("pages/atividade-fisica"),
);

router.get("/alimentacao", apenasCliente, (req, res) =>
  res.render("pages/alimentacao"),
);

router.get("/amizades", apenasCliente, (req, res) =>
  res.render("pages/amizades"),
);

router.get("/perfil-amizade", apenasCliente, (req, res) =>
  res.render("pages/perfil-amizade"),
);

/* ── LOGOUT (sair do admin e deslogar a conta) ─────────────────────────────────────────────── */
router.get("/sair", usuarioController.logout);

router.get("/logout", usuarioController.logout);

module.exports = router;
