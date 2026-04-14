// ============================================================
// MODEL: Tarefas — operações no MySQL
// ============================================================
const db = require("../database/db");

const Tarefa = {

  // Lista todas as tarefas do usuário
  async listarPorUsuario(usuarioId) {
    const [rows] = await db.query(
      "SELECT * FROM tarefas WHERE usuario_id = ? ORDER BY concluida ASC, id ASC",
      [usuarioId]
    );
    return rows;
  },

  // Alterna concluída/pendente e retorna a tarefa atualizada
  async alternarConclusao(id, usuarioId) {
    const [rows] = await db.query(
      "SELECT * FROM tarefas WHERE id = ? AND usuario_id = ?",
      [id, usuarioId]
    );
    if (!rows[0]) return null;

    const novoConcluida = rows[0].concluida ? 0 : 1;
    await db.query(
      "UPDATE tarefas SET concluida = ? WHERE id = ?",
      [novoConcluida, id]
    );
    return { ...rows[0], concluida: novoConcluida };
  },
};

module.exports = Tarefa;
