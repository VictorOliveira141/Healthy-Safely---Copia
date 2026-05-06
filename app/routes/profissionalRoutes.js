const express = require("express");
const router  = express.Router();

const tarefaController = require("../controllers/tarefaController");

function apenasProfissional(req, res, next) {
  if (!req.session?.usuario) return res.redirect("/login");
  if (req.session.usuario.tipo !== "profissional") return res.redirect("/dashboard");
  res.locals.currentPath = req.path === '/' ? '/profissional' : '/profissional' + req.path;
  next();
}

router.get("/painel-financeiro", apenasProfissional, tarefaController.exibirPainelProfissional);
router.get("/dashboard",         apenasProfissional, (req,res) => res.redirect("/profissional/painel-financeiro"));
router.get("/pacientes",         apenasProfissional, tarefaController.listarPacientes);
router.get("/planos",            apenasProfissional, (req,res) =>
  res.render("pages/profissional/planos", { colaborador: req.session.usuario }));
router.get("/configuracoes",     apenasProfissional, (req,res) =>
  res.render("pages/profissional/configuracoes", { colaborador: req.session.usuario }));
router.get("/perfil-profissional", apenasProfissional, (req,res) =>
  res.render("pages/profissional/perfil-profissional", { colaborador:req.session.usuario, mensagem:null }));
router.get("/agenda",            apenasProfissional, (req,res) =>
  res.render("pages/profissional/agenda", { colaborador:req.session.usuario }));

// Tarefas de um paciente
router.get("/paciente/:clienteId/tarefas",  apenasProfissional, tarefaController.tarefasDoPaciente);
router.post("/paciente/tarefa/criar",        apenasProfissional, tarefaController.criarTarefaParaPaciente);

// Feedback do profissional para o paciente
router.post("/paciente/:clienteId/feedback",
  apenasProfissional,
  tarefaController.regrasValidacaoFeedback,
  tarefaController.enviarFeedback);

// Gerenciar vínculo (aceitar/recusar solicitação)
router.post("/gerenciar-vinculo", apenasProfissional, tarefaController.gerenciarVinculo);

module.exports = router;
