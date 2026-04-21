// models/Admin.js — Padrão MVC (Prof. Giovani Wingter)
const pool = require("../config/pool_conexoes");

const adminModel = {

  listarTodosUsuarios: async () => {
    const [linhas] = await pool.query(
      `SELECT u.id, u.nome, u.nomeusuario, u.email, u.tipo, u.nivel, u.pontos,
              u.foto_perfil, u.criado_em,
              COUNT(t.id)                                         AS total_tarefas,
              SUM(CASE WHEN t.concluida=1 THEN 1 ELSE 0 END)     AS tarefas_concluidas,
              ROUND(IFNULL(SUM(CASE WHEN t.concluida=1 THEN 1 ELSE 0 END),0)
                    / NULLIF(COUNT(t.id),0)*100, 0)              AS pct_conclusao,
              MAX(t.concluida_em)                                 AS ultima_atividade
       FROM usuarios u
       LEFT JOIN tarefas t ON t.usuario_id = u.id
       GROUP BY u.id ORDER BY u.pontos DESC, u.criado_em DESC`);
    return linhas;
  },

  estatisticasGerais: async () => {
    const [[totais]] = await pool.query(
      `SELECT COUNT(*) AS total_usuarios,
              SUM(CASE WHEN tipo='cliente'       THEN 1 ELSE 0 END) AS total_clientes,
              SUM(CASE WHEN tipo='profissional'  THEN 1 ELSE 0 END) AS total_profissionais,
              SUM(pontos) AS pontos_totais
       FROM usuarios`);
    const [[tarefas]] = await pool.query(
      `SELECT COUNT(*) AS total_tarefas,
              SUM(CASE WHEN concluida=1 THEN 1 ELSE 0 END) AS tarefas_concluidas
       FROM tarefas`);
    const [[solic]] = await pool.query(
      `SELECT COUNT(*) AS total_solicitacoes FROM solicitacoes WHERE status='pendente'`);
    return { ...totais, ...tarefas, ...solic };
  },

  cadastrosPorDia: async () => {
    const [linhas] = await pool.query(
      `SELECT DATE(criado_em) AS dia, COUNT(*) AS quantidade
       FROM usuarios
       WHERE criado_em >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(criado_em) ORDER BY dia ASC`);
    return linhas;
  },

  tarefasConcluidasPorDia: async () => {
    const [linhas] = await pool.query(
      `SELECT DATE(concluida_em) AS dia, COUNT(*) AS quantidade
       FROM tarefas WHERE concluida=1 AND concluida_em IS NOT NULL
         AND concluida_em >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(concluida_em) ORDER BY dia ASC`);
    return linhas;
  },

  rankingUsuarios: async () => {
    const [linhas] = await pool.query(
      `SELECT u.id, u.nome, u.nomeusuario, u.nivel, u.pontos,
              SUM(CASE WHEN t.concluida=1 THEN 1 ELSE 0 END) AS tarefas_concluidas
       FROM usuarios u LEFT JOIN tarefas t ON t.usuario_id=u.id
       WHERE u.tipo='cliente'
       GROUP BY u.id ORDER BY u.pontos DESC LIMIT 5`);
    return linhas;
  },

  listarSolicitacoes: async () => {
    const [linhas] = await pool.query(
      `SELECT s.id, s.tipo, s.status, s.mensagem, s.criado_em,
              up.nome AS paciente_nome, up.email AS paciente_email,
              uf.nome AS profissional_nome, uf.email AS prof_email,
              pf.area_atuacao
       FROM solicitacoes s
       JOIN usuarios up ON up.id = s.paciente_id
       JOIN usuarios uf ON uf.id = s.profissional_id
       JOIN profissionais pf ON pf.usuario_id = s.profissional_id
       ORDER BY s.criado_em DESC`);
    return linhas;
  },

  aprovarSolicitacao: async (id) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [[s]] = await conn.query("SELECT * FROM solicitacoes WHERE id = ?", [id]);
      if (!s) { await conn.rollback(); return false; }
      await conn.query("UPDATE solicitacoes SET status='aprovada' WHERE id=?", [id]);
      await conn.query(
        `INSERT INTO vinculos (paciente_id, profissional_id, status)
         VALUES (?,?,'ativo')
         ON DUPLICATE KEY UPDATE status='ativo'`,
        [s.paciente_id, s.profissional_id]);
      await conn.commit();
      return true;
    } catch (e) { await conn.rollback(); return false; }
    finally { conn.release(); }
  },

  rejeitarSolicitacao: async (id) => {
    try {
      await pool.query("UPDATE solicitacoes SET status='rejeitada' WHERE id=?", [id]);
      return true;
    } catch (e) { return false; }
  },

  deletarUsuario: async (id) => {
    try {
      await pool.query("DELETE FROM usuarios WHERE id=?", [id]);
      return true;
    } catch (e) { return false; }
  },

  vincularPacienteProf: async (pacienteId, profissionalId) => {
    try {
      await pool.query(
        `INSERT INTO vinculos (paciente_id, profissional_id, status)
         VALUES (?,?,'ativo')
         ON DUPLICATE KEY UPDATE status='ativo'`,
        [pacienteId, profissionalId]);
      return true;
    } catch (e) { return false; }
  },
};

module.exports = adminModel;
