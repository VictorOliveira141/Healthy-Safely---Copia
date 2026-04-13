const express = require("express");
const router = express.Router();

// Middleware: só deixa passar se o usuário logado for profissional
function verificarProfissional(req, res, next) {
  if (req.session && req.session.usuario && req.session.usuario.tipo === "profissional") {
    return next();
  }
  return res.redirect("/login");   // FIX: era /cadastroColaborador (não existe)
}

/* ── ROTAS DA ÁREA PROFISSIONAL ─────────────────────────── */

router.get("/dashboard", verificarProfissional, (req, res) => {
  res.redirect("/profissional/painel");
});

router.get("/painel", verificarProfissional, (req, res) => {
  res.render("pages/profissional/painel-financeiro", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});

// alias legado
router.get("/painel-financeiro", verificarProfissional, (req, res) => {
  res.render("pages/profissional/painel-financeiro", {
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

router.get("/perfil-profissional", verificarProfissional, (req, res) => {
  res.render("pages/profissional/perfil-profissional", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});

router.get("/feedback", verificarProfissional, (req, res) => {
  res.render("pages/profissional/feedback", {
    colaborador: req.session.usuario,
  });
});

module.exports = router;
