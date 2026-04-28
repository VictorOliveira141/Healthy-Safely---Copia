const express = require("express");
const router  = express.Router();

// CONTROLERS
const tarefaController = require("../controllers/tarefaController");

function apenasProfissional(req, res, next) {
  if (!req.session?.usuario) return res.redirect("/login");
  if (req.session.usuario.tipo !== "profissional") return res.redirect("/dashboard");
  // Injeta currentPath para o sidebar destacar o link ativo
  res.locals.currentPath = req.path === '/' ? '/profissional' : '/profissional' + req.path;
  next();
}

// ──────────────── Apenas profissionais podem acessar ────────────────
router.get("/painel-financeiro", apenasProfissional, tarefaController.exibirPainelProfissional);
router.get("/dashboard",         apenasProfissional, (req,res) => res.redirect("/profissional/painel-financeiro"));
router.get("/pacientes",         apenasProfissional, tarefaController.listarPacientes);
router.get("/planos", apenasProfissional, (req, res) => {
  res.render("pages/profissional/planos", {
    colaborador: req.session.usuario
  });
});
router.get("/configuracoes", apenasProfissional, (req, res) => {
  res.render("pages/profissional/configuracoes", {
    colaborador: req.session.usuario,
  });
});
router.get("/perfil-profissional", apenasProfissional, (req,res) => {
  res.render("pages/profissional/perfil-profissional", { colaborador:req.session.usuario, mensagem:null });
});
router.get("/agenda", apenasProfissional, (req,res) => {
  res.render("pages/profissional/agenda", { colaborador:req.session.usuario });
});

/*Ver tarefas de um paciente específico*/
router.get("/paciente/:clienteId/tarefas", apenasProfissional, tarefaController.tarefasDoPaciente);
/*Criar tarefa para paciente*/
router.post("/paciente/tarefa/criar", apenasProfissional, tarefaController.criarTarefaParaPaciente);

module.exports = router;
