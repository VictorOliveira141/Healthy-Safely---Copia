// ============================================================
// models/Admin.js — Padrão MVC (Prof. Giovani Wingter)
// ============================================================
const pool = require("../config/pool_conexoes");

const adminModel = {

  // Lista todos os usuários com progresso de tarefas
  listarTodosUsuarios: async () => {
    const [linhas] = await pool.query(
      `SELECT
         u.id, u.nome, u.nomeusuario, u.email, u.tipo,
         u.nivel, u.pontos, u.foto_perfil, u.criado_em,
         COUNT(t.id)                                          AS total_tarefas,
         SUM(CASE WHEN t.concluida = 1 THEN 1 ELSE 0 END)   AS tarefas_concluidas,
         ROUND(
           IFNULL(SUM(CASE WHEN t.concluida = 1 THEN 1 ELSE 0 END), 0)
           / NULLIF(COUNT(t.id), 0) * 100, 0
         )                                                   AS pct_conclusao,
         MAX(t.concluida_em)                                 AS ultima_atividade
       FROM usuarios u
       LEFT JOIN tarefas t ON t.usuario_id = u.id
       GROUP BY u.id
       ORDER BY u.pontos DESC, u.criado_em DESC`
    );
    return linhas;
  },

  // Estatísticas gerais do sistema
  estatisticasGerais: async () => {
    const [[totais]] = await pool.query(
      `SELECT
         COUNT(*)                                                AS total_usuarios,
         SUM(CASE WHEN tipo = 'cliente'      THEN 1 ELSE 0 END) AS total_clientes,
         SUM(CASE WHEN tipo = 'profissional' THEN 1 ELSE 0 END) AS total_profissionais,
         SUM(pontos)                                             AS pontos_totais
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

  // Cadastros por dia (últimos 7 dias)
  cadastrosPorDia: async () => {
    const [linhas] = await pool.query(
      `SELECT DATE(criado_em) AS dia, COUNT(*) AS quantidade
       FROM usuarios
       WHERE criado_em >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(criado_em)
       ORDER BY dia ASC`
    );
    return linhas;
  },

  // Tarefas concluídas por dia (últimos 7 dias) — gráfico de atividade
  tarefasConcluidasPorDia: async () => {
    const [linhas] = await pool.query(
      `SELECT DATE(concluida_em) AS dia, COUNT(*) AS quantidade
       FROM tarefas
       WHERE concluida = 1
         AND concluida_em >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
         AND concluida_em IS NOT NULL
       GROUP BY DATE(concluida_em)
       ORDER BY dia ASC`
    );
    return linhas;
  },

  // Top 5 usuários por pontos
  rankingUsuarios: async () => {
    const [linhas] = await pool.query(
      `SELECT u.id, u.nome, u.nomeusuario, u.nivel, u.pontos,
              SUM(CASE WHEN t.concluida = 1 THEN 1 ELSE 0 END) AS tarefas_concluidas
       FROM usuarios u
       LEFT JOIN tarefas t ON t.usuario_id = u.id
       WHERE u.tipo = 'cliente'
       GROUP BY u.id
       ORDER BY u.pontos DESC
       LIMIT 5`
    );
    return linhas;
  },
};

module.exports = adminModel;
