// ============================================================
// routes/router-adm.js
// Router da área profissional — padrão MVC
// (Prof. Giovani Wingter)
// ============================================================
const express = require("express");
const router  = express.Router();

const tarefaController = require("../controllers/tarefaController");

// ── Middleware: verifica se é profissional logado ────────────
function verificarProfissional(req, res, next) {
  if (req.session && req.session.usuario && req.session.usuario.tipo === "profissional") {
    return next();
  }
  return res.redirect("/login");
}

/* ── PAINEL GERAL ─────────────────────────────────────────── */
router.get("/painel-financeiro", verificarProfissional, tarefaController.exibirPainelProfissional);

// Alias: /profissional/dashboard → painel-financeiro
router.get("/dashboard", verificarProfissional, (req, res) => {
  res.redirect("/profissional/painel-financeiro");
});

/* ── SUB-PÁGINAS ─────────────────────────────────────────── */
router.get("/perfil-profissional", verificarProfissional, (req, res) => {
  res.render("pages/profissional/perfil-profissional", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});

router.get("/pacientes", verificarProfissional, (req, res) => {
  res.render("pages/profissional/pacientes", {
    colaborador: req.session.usuario,
  });
});

router.get("/agenda", verificarProfissional, (req, res) => {
  res.render("pages/profissional/agenda", {
    colaborador: req.session.usuario,
  });
});

module.exports = router;
