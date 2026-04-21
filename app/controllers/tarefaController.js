// controllers/tarefaController.js — Padrão MVC
const tarefaModel  = require("../models/Tarefa");
const usuarioModel = require("../models/Usuario");

const tarefaController = {

  // Dashboard: dados reais do banco
  exibirDashboard: async (req, res) => {
    try {
      const uid = req.session.usuario.id;
      const [tarefas, pct, usuAtual, vinculo, profissionais] = await Promise.all([
        tarefaModel.listarPorUsuario(uid),
        tarefaModel.percentualSemanal(uid),
        usuarioModel.buscarPorId(uid),
        usuarioModel.buscarVinculo(uid),
        usuarioModel.listarProfissionais(""),
      ]);
      if (usuAtual) {
        req.session.usuario.pontos = usuAtual.pontos;
        req.session.usuario.nivel  = usuAtual.nivel;
        req.session.nivel          = usuAtual.nivel;
      }
      const tasks = tarefas.map(t => ({
        _id:t.id, title:t.titulo, completed:!!t.concluida, categoria:t.categoria, pontos:t.pontos,
      }));
      res.render("user/dashboard", {
        nome:    req.session.nome,
        nivel:   usuAtual?.nivel || req.session.nivel || "iniciante",
        pontos:  usuAtual?.pontos || 0,
        pctSemana: pct,
        tasks, vinculo, profissionais,
      });
    } catch(err) {
      console.error("Erro dashboard:", err);
      res.render("user/dashboard", {
        nome:req.session.nome, nivel:"iniciante", pontos:0,
        pctSemana:0, tasks:[], vinculo:null, profissionais:[],
      });
    }
  },

  // Listar tarefas (/tasks)
  listarTarefas: async (req, res) => {
    try {
      const tarefas = await tarefaModel.listarPorUsuario(req.session.usuario.id);
      const tasks = tarefas.map(t => ({
        _id:t.id, title:t.titulo, completed:!!t.concluida, categoria:t.categoria, pontos:t.pontos,
      }));
      res.render("user/tasks", { tasks });
    } catch(err) {
      res.render("user/tasks", { tasks:[] });
    }
  },

  // Criar tarefa via POST
  criarTarefa: async (req, res) => {
    const { titulo, descricao, pontos, categoria } = req.body;
    if (!titulo?.trim()) return res.redirect("/tasks");
    try {
      await tarefaModel.criar({
        usuarioId: req.session.usuario.id,
        titulo: titulo.trim(),
        descricao: descricao || null,
        pontos: Number(pontos) || 10,
        categoria: categoria || "geral",
      });
    } catch(e) { console.error(e); }
    res.redirect("/tasks");
  },

  // Concluir / desmarcar
  alternarConclusao: async (req, res) => {
    const { id } = req.query;
    try {
      const tarefa = await tarefaModel.alternarConclusao(id, req.session.usuario.id);
      if (tarefa?.concluida) {
        const r = await usuarioModel.atualizarPontos(req.session.usuario.id, tarefa.pontos || 10);
        if (r) {
          req.session.usuario.nivel = r.nivel;
          req.session.nivel         = r.nivel;
        }
      }
    } catch(e) { console.error(e); }
    res.redirect(req.get("Referer") || "/tasks");
  },

  // Excluir tarefa
  excluirTarefa: async (req, res) => {
    const { id } = req.params;
    try {
      await tarefaModel.excluir(id, req.session.usuario.id);
    } catch(e) { console.error(e); }
    res.redirect("/tasks");
  },

  // API JSON: buscar profissionais
  buscarProfissionais: async (req, res) => {
    const lista = await usuarioModel.listarProfissionais(req.query.q || "");
    res.json(lista);
  },

  // Solicitar vínculo com profissional
  solicitarVinculo: async (req, res) => {
    try {
      await usuarioModel.solicitarVinculo(req.session.usuario.id, req.body.profissionalId);
    } catch(e) { console.error(e); }
    res.redirect("/dashboard");
  },

  // Painel profissional com dados reais
  exibirPainelProfissional: async (req, res) => {
    try {
      const pacientes = await usuarioModel.listarPacientes();
      res.render("pages/profissional/painel-financeiro", {
        colaborador: req.session.usuario, pacientes, mensagem:null,
      });
    } catch(err) {
      res.render("pages/profissional/painel-financeiro", {
        colaborador:req.session.usuario, pacientes:[], mensagem:null,
      });
    }
  },

  // Lista pacientes (página /profissional/pacientes)
  listarPacientes: async (req, res) => {
    try {
      const pacientes = await usuarioModel.listarPacientes();
      res.render("pages/profissional/pacientes", {
        colaborador:req.session.usuario, pacientes,
      });
    } catch(e) {
      res.render("pages/profissional/pacientes", {
        colaborador:req.session.usuario, pacientes:[],
      });
    }
  },

  // Tarefas de um paciente específico
  tarefasDoPaciente: async (req, res) => {
    try {
      const { clienteId } = req.params;
      const [paciente, tarefas] = await Promise.all([
        usuarioModel.buscarPorId(clienteId),
        usuarioModel.buscarTarefasCliente(clienteId),
      ]);
      res.render("pages/profissional/tarefas-paciente", {
        colaborador:req.session.usuario, paciente, tarefas,
      });
    } catch(e) {
      res.redirect("/profissional/pacientes");
    }
  },

  // Profissional cria tarefa para paciente
  criarTarefaParaPaciente: async (req, res) => {
    const { clienteId, titulo, descricao, pontos, categoria } = req.body;
    try {
      await tarefaModel.criar({
        usuarioId:  Number(clienteId),
        criadoPor:  req.session.usuario.id,
        titulo:     titulo.trim(),
        descricao:  descricao || null,
        pontos:     Number(pontos) || 10,
        categoria:  categoria || "geral",
      });
    } catch(e) { console.error(e); }
    res.redirect(`/profissional/paciente/${clienteId}/tarefas`);
  },
};

module.exports = tarefaController;
