// ============================================================
// routes/router.js — Padrão MVC (Prof. Giovani Wingter)
// ============================================================
const express = require("express");
const router  = express.Router();

const usuarioController = require("../controllers/usuarioController");
const tarefaController  = require("../controllers/tarefaController");
const verificarAutenticacao = require("../public/js/autenticacao");

function verificarUsuario(req, res, next) {
  if (!req.session || !req.session.usuario) return res.redirect("/login");
  if (req.session.usuario.tipo === "profissional")
    return res.redirect("/profissional/painel-financeiro");
  return next();
}

/* ── LOGOUT ─────────────────────────────────────────────── */
router.get("/sair",   usuarioController.logout);
router.get("/logout", usuarioController.logout);

/* ── PÚBLICAS ───────────────────────────────────────────── */
router.get("/",              (req, res) => res.render("pages/tomarammeutela"));
router.get("/tomarammeutela",(req, res) => {
  if (req.session && req.session.usuario) return res.redirect("/dashboard");
  res.render("pages/tomarammeutela");
});
router.get("/ajuda",         (req, res) => res.render("pages/ajuda"));
router.get("/configuracoes", (req, res) => res.render("pages/configuracoes"));

/* ── CADASTRO ───────────────────────────────────────────── */
router.get("/cadastro",             (req, res) => res.render("pages/cadastro"));
router.get("/cadastroCliente",      usuarioController.exibirCadastroCliente);
router.get("/cadastroProfissional", usuarioController.exibirCadastroProfissional);
router.post("/cadastroCliente",
  usuarioController.regrasValidacaoCliente,
  usuarioController.cadastrarCliente);
router.post("/cadastroProfissional",
  usuarioController.regrasValidacaoProfissional,
  usuarioController.cadastrarProfissional);

/* ── LOGIN ──────────────────────────────────────────────── */
router.get("/login",  usuarioController.exibirLogin);
router.post("/login", usuarioController.login);

/* ── PRIVADAS (cliente) ─────────────────────────────────── */
router.get("/dashboard",       verificarUsuario,      tarefaController.exibirDashboard);
router.get("/tasks",           verificarAutenticacao, tarefaController.listarTarefas);
router.get("/tasks/concluir",  verificarAutenticacao, tarefaController.alternarConclusao);

// API: busca profissionais em tempo real (JSON)
router.get("/api/profissionais", verificarAutenticacao, tarefaController.buscarProfissionais);

// Solicitar vínculo com profissional
router.post("/vincular-profissional", verificarAutenticacao, tarefaController.solicitarVinculo);

router.get("/sono",             verificarAutenticacao, (req, res) => res.render("pages/sono"));
router.get("/saude-mental",     verificarAutenticacao, (req, res) => res.render("pages/saude-mental"));
router.get("/atividade-fisica", verificarAutenticacao, (req, res) => res.render("pages/atividade-fisica"));
router.get("/alimentacao",      verificarAutenticacao, (req, res) => res.render("pages/alimentacao"));
router.get("/perfil",           verificarAutenticacao, (req, res) => res.render("pages/perfil"));
router.get("/notificacoes",     verificarAutenticacao, (req, res) => res.render("pages/notificacoes"));
router.get("/privacidade",      verificarAutenticacao, (req, res) => res.render("pages/privacidade"));
router.get("/amizades",         verificarAutenticacao, (req, res) => res.render("pages/amizades"));
router.get("/perfil-amizade",   verificarAutenticacao, (req, res) => res.render("pages/perfil-amizade"));
router.get("/painel-local",     verificarAutenticacao, (req, res) => res.render("pages/painel-local"));

module.exports = router;
