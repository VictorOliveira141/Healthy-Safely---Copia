const express = require("express");
const router = express.Router();
const tarefaController = require("../controllers/tarefaController");

// Middleware: garante que apenas profissionais acessem rotas de profissional
function apenasProfissional(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.redirect("/login");
  }

  if (req.session.usuario.tipo !== "profissional") {
    return res.redirect("/dashboard");
  }

  next();
}

/* ── ROTAS PROFISSIONAL (apenas usuarios profissionais tem acesso) ───────────────────── */
router.get(
  "/painel-financeiro",
  apenasProfissional,
  tarefaController.exibirPainelProfissional,
);

router.get("/dashboard", apenasProfissional, (req, res) => {
  res.redirect("/profissional/painel-financeiro");
});

router.get("/perfil-profissional", apenasProfissional, (req, res) => {
  res.render("pages/profissional/perfil-profissional", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});

router.get("/pacientes", apenasProfissional, (req, res) => {
  res.render("pages/profissional/pacientes", {
    colaborador: req.session.usuario,
  });
});

router.get("/agenda", apenasProfissional, (req, res) => {
  res.render("pages/profissional/agenda", {
    colaborador: req.session.usuario,
  });
});

router.get("/painel-local", apenasProfissional, (req, res) =>
  res.render("pages/painel-local"),
);

module.exports = router;
