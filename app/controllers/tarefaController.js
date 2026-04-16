// ============================================================
// controllers/tarefaController.js — Padrão MVC
// ============================================================
const tarefaModel  = require("../models/Tarefa");
const usuarioModel = require("../models/Usuario");

const tarefaController = {

  // ── Dashboard do usuário ───────────────────────────────────
  exibirDashboard: async (req, res) => {
    try {
      const uid = req.session.usuario.id;

      const [tarefas, pct, usuarioAtualizado, vincTmp, profissAptos] = await Promise.all([
        tarefaModel.listarPorUsuario(uid),
        tarefaModel.percentualSemanal(uid),
        usuarioModel.buscarPorId(uid),
        usuarioModel.buscarVinculoAtivo(uid),
        usuarioModel.listarProfissionais(""),
      ]);

      // Atualizar sessão com pontos/nível real do banco
      if (usuarioAtualizado) {
        req.session.usuario.pontos = usuarioAtualizado.pontos;
        req.session.usuario.nivel  = usuarioAtualizado.nivel;
        req.session.nivel          = usuarioAtualizado.nivel;
      }

      const tasks = tarefas.map(t => ({
        _id:       t.id,
        title:     t.titulo,
        completed: !!t.concluida,
        categoria: t.categoria,
        pontos:    t.pontos,
      }));

      res.render("user/dashboard", {
        nome:         req.session.nome,
        nivel:        usuarioAtualizado?.nivel || req.session.nivel || "iniciante",
        pontos:       usuarioAtualizado?.pontos || 0,
        pctSemana:    pct,
        tasks,
        vinculo:      vincTmp,
        profissionais: profissAptos,
      });
    } catch (err) {
      console.error("Erro no dashboard:", err);
      res.render("user/dashboard", {
        nome: req.session.nome,
        nivel: req.session.nivel || "iniciante",
        pontos: 0, pctSemana: 0,
        tasks: [], vinculo: null, profissionais: [],
      });
    }
  },

  // ── Listar tarefas (página /tasks) ─────────────────────────
  listarTarefas: async (req, res) => {
    try {
      const tarefas = await tarefaModel.listarPorUsuario(req.session.usuario.id);
      const tasks = tarefas.map(t => ({
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

  // ── Alternar conclusão de tarefa ───────────────────────────
  alternarConclusao: async (req, res) => {
    const { id } = req.query;
    try {
      const tarefa = await tarefaModel.alternarConclusao(id, req.session.usuario.id);
      if (tarefa && tarefa.concluida) {
        const resultado = await usuarioModel.atualizarPontos(
          req.session.usuario.id, tarefa.pontos || 10);
        // Atualizar sessão com novo nível
        if (resultado && resultado.nivel) {
          req.session.usuario.nivel = resultado.nivel;
          req.session.nivel = resultado.nivel;
        }
      }
    } catch (err) {
      console.error("Erro ao alternar tarefa:", err);
    }
    let url = req.rawHeaders[25] || "/tasks";
    url = url.replace("http://localhost:3000", "");
    res.redirect(url);
  },

  // ── API: buscar profissionais (search em tempo real) ───────
  buscarProfissionais: async (req, res) => {
    try {
      const busca = req.query.q || "";
      const lista = await usuarioModel.listarProfissionais(busca);
      res.json(lista);
    } catch (err) {
      res.json([]);
    }
  },

  // ── Solicitar vínculo com profissional ─────────────────────
  solicitarVinculo: async (req, res) => {
    try {
      const { profissionalId } = req.body;
      await usuarioModel.solicitarVinculo(
        req.session.usuario.id, profissionalId);
    } catch (err) {
      console.error("Erro ao solicitar vínculo:", err);
    }
    res.redirect("/dashboard");
  },

  // ── Painel do profissional ─────────────────────────────────
  exibirPainelProfissional: async (req, res) => {
    try {
      const pacientes = await usuarioModel.listarPacientes();
      res.render("pages/profissional/painel-financeiro", {
        colaborador: req.session.usuario,
        pacientes,
        mensagem: null,
      });
    } catch (err) {
      console.error("Erro no painel profissional:", err);
      res.render("pages/profissional/painel-financeiro", {
        colaborador: req.session.usuario,
        pacientes: [],
        mensagem: null,
      });
    }
  },
};

module.exports = tarefaController;
