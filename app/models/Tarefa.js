// ============================================================
// models/Tarefa.js
// Model de Tarefas — acesso e manipulação no MySQL
// Padrão MVC (Prof. Giovani Wingter)
// ============================================================
var pool = require("../../app/config/pool_conexoes");

const tarefaModel = {

  // ── Listar todas as tarefas do usuário ─────────────────────
  listarPorUsuario: async (usuarioId) => {
    try {
      const [linhas] = await pool.query(
        `SELECT * FROM tarefas
         WHERE usuario_id = ?
         ORDER BY concluida ASC, id ASC`,
        [usuarioId]
      );
      return linhas;
    } catch (error) {
      return error;
    }
  },

  // ── Buscar tarefa por ID (verifica se pertence ao usuário) ──
  buscarPorId: async (id, usuarioId) => {
    try {
      const [linhas] = await pool.query(
        "SELECT * FROM tarefas WHERE id = ? AND usuario_id = ?",
        [id, usuarioId]
      );
      return linhas[0] || null;
    } catch (error) {
      return error;
    }
  },

  // ── Criar nova tarefa ──────────────────────────────────────
  criar: async ({ usuarioId, titulo, descricao, pontos, categoria }) => {
    try {
      const [resultado] = await pool.query(
        `INSERT INTO tarefas (usuario_id, titulo, descricao, pontos, categoria)
         VALUES (?, ?, ?, ?, ?)`,
        [usuarioId, titulo, descricao || null, pontos || 10, categoria || "geral"]
      );
      return resultado;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  // ── Alternar concluída / pendente ──────────────────────────
  alternarConclusao: async (id, usuarioId) => {
    try {
      const [linhas] = await pool.query(
        "SELECT * FROM tarefas WHERE id = ? AND usuario_id = ?",
        [id, usuarioId]
      );
      if (!linhas[0]) return null;

      const novoConcluida = linhas[0].concluida ? 0 : 1;
      await pool.query(
        "UPDATE tarefas SET concluida = ? WHERE id = ?",
        [novoConcluida, id]
      );
      return { ...linhas[0], concluida: novoConcluida };
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  // ── Excluir tarefa ─────────────────────────────────────────
  excluir: async (id, usuarioId) => {
    try {
      const [resultado] = await pool.query(
        "DELETE FROM tarefas WHERE id = ? AND usuario_id = ?",
        [id, usuarioId]
      );
      return resultado;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  // ── Contar tarefas concluídas hoje (para gamificação) ──────
  contarConcluidasHoje: async (usuarioId) => {
    try {
      const [linhas] = await pool.query(
        `SELECT COUNT(*) AS total FROM tarefas
         WHERE usuario_id = ? AND concluida = 1
         AND DATE(criado_em) = CURDATE()`,
        [usuarioId]
      );
      return linhas[0].total;
    } catch (error) {
      return 0;
    }
  },

  // ── Percentual semanal (para dashboard) ────────────────────
  percentualSemanal: async (usuarioId) => {
    try {
      const [linhas] = await pool.query(
        `SELECT
           COUNT(*)                                            AS total,
           SUM(CASE WHEN concluida = 1 THEN 1 ELSE 0 END)    AS concluidas
         FROM tarefas
         WHERE usuario_id = ?
         AND YEARWEEK(criado_em, 1) = YEARWEEK(NOW(), 1)`,
        [usuarioId]
      );
      const { total, concluidas } = linhas[0];
      if (!total) return 0;
      return Math.round((concluidas / total) * 100);
    } catch (error) {
      return 0;
    }
  },

};

module.exports = tarefaModel;
