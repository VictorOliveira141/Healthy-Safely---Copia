// routes/principalRoutes.js — Padrão MVC
const express = require("express");
const router  = express.Router();
const usuarioController = require("../controllers/usuarioController");
const tarefaController  = require("../controllers/tarefaController");

function apenasCliente(req, res, next) {
  if (!req.session?.usuario) return res.redirect("/login");
  if (req.session.usuario.tipo !== "cliente") return res.redirect("/profissional/painel-financeiro");
  next();
}
function apenasAutenticado(req, res, next) {
  if (!req.session?.usuario) return res.redirect("/login");
  next();
}

/* ── LOGOUT ──────────────────────────────────────────────── */
router.get("/sair",   usuarioController.logout);
router.get("/logout", usuarioController.logout);

/* ── PÚBLICAS ────────────────────────────────────────────── */
// Rota raiz "/" — ao clicar na logo redireciona conforme tipo de usuário
router.get("/", (req, res) => {
  if (req.session?.usuario) {
    if (req.session.usuario.tipo === "profissional")
      return res.redirect("/profissional/painel-financeiro");
    return res.redirect("/dashboard");
  }
  res.render("pages/tomarammeutela");
});
router.get("/tomarammeutela", (req, res) => {
  if (req.session?.usuario) {
    if (req.session.usuario.tipo === "profissional")
      return res.redirect("/profissional/painel-financeiro");
    return res.redirect("/dashboard");
  }
  res.render("pages/tomarammeutela");
});
router.get("/ajuda",         (req,res) => res.render("pages/ajuda"));
router.get("/configuracoes", (req,res) => res.render("pages/configuracoes"));
router.get("/cadastro",      (req,res) => res.render("pages/cadastro"));
router.get("/cadastroCliente",      usuarioController.exibirCadastroCliente);
router.get("/cadastroProfissional", usuarioController.exibirCadastroProfissional);
router.get("/login", usuarioController.exibirLogin);

/* ── POST cadastro / login ───────────────────────────────── */
router.post("/cadastroCliente",
  usuarioController.regrasValidacaoCliente,
  usuarioController.cadastrarCliente);
router.post("/cadastroProfissional",
  usuarioController.regrasValidacaoProfissional,
  usuarioController.cadastrarProfissional);
router.post("/login", usuarioController.login);

/* ── CLIENTE ─────────────────────────────────────────────── */
router.get("/dashboard", apenasCliente, tarefaController.exibirDashboard);

// Tarefas — CRUD completo
router.get("/tasks",          apenasCliente, tarefaController.listarTarefas);
router.post("/tasks/criar",   apenasCliente, tarefaController.criarTarefa);
router.get("/tasks/concluir", apenasCliente, tarefaController.alternarConclusao);
router.post("/tasks/excluir/:id", apenasCliente, tarefaController.excluirTarefa);

// API JSON profissionais
router.get("/api/profissionais", apenasCliente, tarefaController.buscarProfissionais);
router.post("/vincular-profissional", apenasCliente, tarefaController.solicitarVinculo);

// Páginas de saúde
router.get("/sono",             apenasCliente, (req,res) => res.render("pages/sono"));
router.get("/saude-mental",     apenasCliente, (req,res) => res.render("pages/saude-mental"));
router.get("/atividade-fisica", apenasCliente, (req,res) => res.render("pages/atividade-fisica"));
router.get("/alimentacao",      apenasCliente, (req,res) => res.render("pages/alimentacao"));
router.get("/amizades",         apenasCliente, (req,res) => res.render("pages/amizades"));
router.get("/perfil-amizade",   apenasCliente, (req,res) => res.render("pages/perfil-amizade"));

// Autenticado (cliente ou profissional)
router.get("/perfil",        apenasAutenticado, (req,res) => res.render("pages/perfil"));
router.get("/notificacoes",  apenasAutenticado, (req,res) => res.render("pages/notificacoes"));
router.get("/privacidade",   apenasAutenticado, (req,res) => res.render("pages/privacidade"));

module.exports = router;
