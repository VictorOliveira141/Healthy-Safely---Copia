// ============================================================
// models/Tarefa.js — Padrão MVC (Prof. Giovani Wingter)
// ============================================================
var pool = require("../../app/config/pool_conexoes");

const tarefaModel = {

  listarPorUsuario: async (usuarioId) => {
    try {
      const [linhas] = await pool.query(
        `SELECT * FROM tarefas
         WHERE usuario_id = ?
         ORDER BY concluida ASC, id ASC`,
        [usuarioId]);
      return linhas;
    } catch (error) { return error; }
  },

  buscarPorId: async (id, usuarioId) => {
    try {
      const [linhas] = await pool.query(
        "SELECT * FROM tarefas WHERE id = ? AND usuario_id = ?",
        [id, usuarioId]);
      return linhas[0] || null;
    } catch (error) { return error; }
  },

  criar: async ({ usuarioId, titulo, descricao, pontos, categoria }) => {
    try {
      const [resultado] = await pool.query(
        `INSERT INTO tarefas (usuario_id, titulo, descricao, pontos, categoria)
         VALUES (?, ?, ?, ?, ?)`,
        [usuarioId, titulo, descricao || null, pontos || 10, categoria || "geral"]);
      return resultado;
    } catch (error) { console.log(error); return null; }
  },

  // Alterna conclusão e registra timestamp quando conclui
  alternarConclusao: async (id, usuarioId) => {
    try {
      const [linhas] = await pool.query(
        "SELECT * FROM tarefas WHERE id = ? AND usuario_id = ?",
        [id, usuarioId]);
      if (!linhas[0]) return null;

      const novoConcluida = linhas[0].concluida ? 0 : 1;
      await pool.query(
        `UPDATE tarefas
         SET concluida = ?,
             concluida_em = CASE WHEN ? = 1 THEN NOW() ELSE NULL END
         WHERE id = ?`,
        [novoConcluida, novoConcluida, id]);
      return { ...linhas[0], concluida: novoConcluida };
    } catch (error) { console.log(error); return null; }
  },

  excluir: async (id, usuarioId) => {
    try {
      const [resultado] = await pool.query(
        "DELETE FROM tarefas WHERE id = ? AND usuario_id = ?",
        [id, usuarioId]);
      return resultado;
    } catch (error) { console.log(error); return null; }
  },

  // Total e concluídas para o percentual semanal
  percentualSemanal: async (usuarioId) => {
    try {
      const [linhas] = await pool.query(
        `SELECT
           COUNT(*)                                         AS total,
           SUM(CASE WHEN concluida = 1 THEN 1 ELSE 0 END) AS concluidas
         FROM tarefas
         WHERE usuario_id = ?
         AND YEARWEEK(criado_em, 1) = YEARWEEK(NOW(), 1)`,
        [usuarioId]);
      const { total, concluidas } = linhas[0];
      if (!total) return 0;
      return Math.round((concluidas / total) * 100);
    } catch (error) { return 0; }
  },

  // Contagem de tarefas concluídas por dia (últimos 7 dias) — para admin
  concluidasPorDia: async (usuarioId) => {
    try {
      const [linhas] = await pool.query(
        `SELECT DATE(concluida_em) AS dia, COUNT(*) AS quantidade
         FROM tarefas
         WHERE usuario_id = ? AND concluida = 1 AND concluida_em IS NOT NULL
           AND concluida_em >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
         GROUP BY DATE(concluida_em)
         ORDER BY dia ASC`,
        [usuarioId]);
      return linhas;
    } catch (error) { return []; }
  },
};

module.exports = tarefaModel;
