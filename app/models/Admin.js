// ============================================================
// models/Admin.js
// Model do Painel Administrativo — leitura de dados no MySQL
// Padrão MVC (Prof. Giovani Wingter)
// ============================================================
const pool = require("../config/pool_conexoes");

const adminModel = {

  // ── Listar todos os usuários com estatísticas ──────────────
  listarTodosUsuarios: async () => {
    const [linhas] = await pool.query(
      `SELECT
         u.id,
         u.nome,
         u.nomeusuario,
         u.email,
         u.tipo,
         u.nivel,
         u.pontos,
         u.foto_perfil,
         u.criado_em,
         COUNT(t.id)                                          AS total_tarefas,
         SUM(CASE WHEN t.concluida = 1 THEN 1 ELSE 0 END)   AS tarefas_concluidas
       FROM usuarios u
       LEFT JOIN tarefas t ON t.usuario_id = u.id
       GROUP BY u.id
       ORDER BY u.criado_em DESC`
    );
    return linhas;
  },

  // ── Estatísticas gerais do sistema ────────────────────────
  estatisticasGerais: async () => {
    const [[totais]] = await pool.query(
      `SELECT
         COUNT(*)                                              AS total_usuarios,
         SUM(CASE WHEN tipo = 'cliente'       THEN 1 ELSE 0 END) AS total_clientes,
         SUM(CASE WHEN tipo = 'profissional'  THEN 1 ELSE 0 END) AS total_profissionais,
         SUM(pontos)                                           AS pontos_totais
       FROM usuarios`
    );
    const [[tarefas]] = await pool.query(
      `SELECT
         COUNT(*)                                              AS total_tarefas,
         SUM(CASE WHEN concluida = 1 THEN 1 ELSE 0 END)      AS tarefas_concluidas
       FROM tarefas`
    );
    return { ...totais, ...tarefas };
  },

  // ── Usuários cadastrados por dia (últimos 7 dias) ──────────
  cadastrosPorDia: async () => {
    const [linhas] = await pool.query(
      `SELECT
         DATE(criado_em) AS dia,
         COUNT(*)        AS quantidade
       FROM usuarios
       WHERE criado_em >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(criado_em)
       ORDER BY dia ASC`
    );
    return linhas;
  },

};

module.exports = adminModel;
