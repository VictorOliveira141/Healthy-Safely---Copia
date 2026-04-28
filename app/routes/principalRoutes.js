const express = require("express");
const router  = express.Router();

// Controllers
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

// LOGOUT 
router.get("/sair",   usuarioController.logout);
router.get("/logout", usuarioController.logout);

/* ── ROTAS PÚBLICAS ────────────────────────────────────────────── */
router.get("/", (req, res) => {
  if (req.session?.usuario) {
    if (req.session.usuario.tipo === "profissional")
      //caso seja profissional vai para o painel-financeiro
      return res.redirect("/profissional/painel-financeiro");
      //se não,vai para o dashboard do usuario
    return res.redirect("/dashboard");
  }
  //e se não for nenhum dos 2, vai para a pagina inicial publica
  res.render("pages/tomarammeutela");
});


// ──────────────── Qualquer um podem acessar ────────────────
router.get("/ajuda",         (req,res) => res.render("pages/ajuda"));
router.get("/configuracoes", (req,res) => res.render("pages/configuracoes"));
router.get("/cadastro",      (req,res) => res.render("pages/cadastro"));
router.get("/cadastroCliente",      usuarioController.exibirCadastroCliente);
router.get("/cadastroProfissional", usuarioController.exibirCadastroProfissional);
router.get("/login", usuarioController.exibirLogin);

// ──────────────── Apenas CLIENTE podem acessar ────────────────
router.get("/dashboard", apenasCliente, tarefaController.exibirDashboard);

/*tarefas*/
router.get("/tasks",          apenasCliente, tarefaController.listarTarefas);
router.post("/tasks/criar",   apenasCliente, tarefaController.criarTarefa);
router.get("/tasks/concluir", apenasCliente, tarefaController.alternarConclusao);
router.post("/tasks/excluir/:id", apenasCliente, tarefaController.excluirTarefa);

/*conectar-profissionais*/
router.get("/api/profissionais", apenasCliente, tarefaController.buscarProfissionais);
router.post("/vincular-profissional", apenasCliente, tarefaController.solicitarVinculo);

/*paginas-de-tarefas*/
router.get("/sono",             apenasCliente, (req,res) => res.render("pages/sono"));
router.get("/saude-mental",     apenasCliente, (req,res) => res.render("pages/saude-mental"));
router.get("/atividade-fisica", apenasCliente, (req,res) => res.render("pages/atividade-fisica"));
router.get("/alimentacao",      apenasCliente, (req,res) => res.render("pages/alimentacao"));
router.get("/amizades",         apenasCliente, (req,res) => res.render("pages/amizades"));
router.get("/perfil-amizade",   apenasCliente, (req,res) => res.render("pages/perfil-amizade"));

// ──────────────── Apenas Autenticado (cliente ou profissional) ────────────────
router.get("/perfil",        apenasAutenticado, (req,res) => res.render("pages/perfil"));
router.get("/notificacoes",  apenasAutenticado, (req,res) => res.render("pages/notificacoes"));
router.get("/privacidade",   apenasAutenticado, (req,res) => res.render("pages/privacidade"));


// ──────────────── POST cadastro / login  ────────────────
router.post("/cadastroCliente",
  usuarioController.regrasValidacaoCliente,
  usuarioController.cadastrarCliente);
router.post("/cadastroProfissional",
  usuarioController.regrasValidacaoProfissional,
  usuarioController.cadastrarProfissional);
router.post("/login", usuarioController.login);

module.exports = router;
