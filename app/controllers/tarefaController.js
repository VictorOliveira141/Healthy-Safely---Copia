// ============================================================
// controllers/tarefaController.js
// Controller de Tarefas — gerencia fluxo entre Router e Model
// Padrão MVC (Prof. Giovani Wingter)
// ============================================================
const tarefaModel  = require("../models/Tarefa");
const usuarioModel = require("../models/Usuario");

const tarefaController = {

  // ── Listar tarefas do usuário logado ───────────────────────
  listarTarefas: async (req, res) => {
    try {
      const tarefas = await tarefaModel.listarPorUsuario(req.session.usuario.id);

      // Mapeia para o formato que a view user/tasks.ejs espera
      const tasks = tarefas.map((t) => ({
        _id:       t.id,
        title:     t.titulo,
        completed: !!t.concluida,
        categoria: t.categoria,
        pontos:    t.pontos,
      }));

      res.render("user/tasks", { tasks });
    } catch (err) {
      console.error("Erro ao carregar tarefas:", err);
      res.render("user/tasks", { tasks: [] });
    }
  },

  // ── Exibir dashboard do usuário ────────────────────────────
  exibirDashboard: async (req, res) => {
    try {
      const pct = await tarefaModel.percentualSemanal(req.session.usuario.id);
      res.render("user/dashboard", {
        nome:    req.session.nome,
        nivel:   req.session.nivel,
        pctSemana: pct,
      });
    } catch (err) {
      res.render("user/dashboard", {
        nome:    req.session.nome,
        nivel:   req.session.nivel || "iniciante",
        pctSemana: 0,
      });
    }
  },

  // ── Marcar / desmarcar tarefa como concluída ───────────────
  alternarConclusao: async (req, res) => {
    const { id } = req.query;
    try {
      const tarefa = await tarefaModel.alternarConclusao(id, req.session.usuario.id);

      // Se concluiu, adiciona pontos ao usuário
      if (tarefa && tarefa.concluida) {
        await usuarioModel.atualizarPontos(req.session.usuario.id, tarefa.pontos || 10);
      }
    } catch (err) {
      console.error("Erro ao alternar tarefa:", err);
    }

    // Redireciona de volta para a URL que chamou
    let urlChamadora = req.rawHeaders[25] || "/tasks";
    urlChamadora = urlChamadora.replace("http://localhost:3000", "");
    res.redirect(urlChamadora);
  },

  // ── Exibir painel do profissional ──────────────────────────
  exibirPainelProfissional: async (req, res) => {
    try {
      const pacientes = await usuarioModel.listarPacientes(req.session.usuario.id);
      res.render("pages/profissional/painel-financeiro", {
        colaborador: req.session.usuario,
        pacientes,
        mensagem: null,
      });
    } catch (err) {
      console.error("Erro ao carregar painel profissional:", err);
      res.render("pages/profissional/painel-financeiro", {
        colaborador: req.session.usuario,
        pacientes: [],
        mensagem: null,
      });
    }
  },

};

module.exports = tarefaController;
