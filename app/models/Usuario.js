// ============================================================
// models/Usuario.js — Padrão MVC (Prof. Giovani Wingter)
// ============================================================
var pool = require("../../app/config/pool_conexoes");

const usuarioModel = {

  buscarPorId: async (id) => {
    try {
      const [linhas] = await pool.query(
        "SELECT * FROM usuarios WHERE id = ?", [id]);
      return linhas[0] || null;
    } catch (error) { return error; }
  },

  buscarPorLogin: async (valor) => {
    try {
      const [linhas] = await pool.query(
        "SELECT * FROM usuarios WHERE email = ? OR nomeusuario = ?",
        [valor, valor]);
      return linhas[0] || null;
    } catch (error) { return error; }
  },

  emailExiste: async (email) => {
    try {
      const [linhas] = await pool.query(
        "SELECT id FROM usuarios WHERE email = ?", [email]);
      return linhas.length > 0;
    } catch (error) { return error; }
  },

  nomeUsuarioExiste: async (nomeusuario) => {
    try {
      const [linhas] = await pool.query(
        "SELECT id FROM usuarios WHERE nomeusuario = ?", [nomeusuario]);
      return linhas.length > 0;
    } catch (error) { return error; }
  },

  // Cria cliente + copia tarefas padrão em transação
  criarCliente: async ({ nome, nomeusuario, email, senha }) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [resultado] = await conn.query(
        `INSERT INTO usuarios (nome, nomeusuario, email, senha, tipo, nivel)
         VALUES (?, ?, ?, ?, 'cliente', 'iniciante')`,
        [nome, nomeusuario, email, senha]);
      const novoId = resultado.insertId;
      await conn.query(
        `INSERT INTO tarefas (usuario_id, titulo, pontos, categoria)
         SELECT ?, titulo, pontos, categoria FROM tarefas_padrao`,
        [novoId]);
      await conn.commit();
      const [linhas] = await conn.query(
        "SELECT * FROM usuarios WHERE id = ?", [novoId]);
      return linhas[0];
    } catch (error) {
      await conn.rollback();
      console.log(error);
      return null;
    } finally { conn.release(); }
  },

  // Cria profissional + dados extras em transação
  criarProfissional: async ({ nome, nomeusuario, email, senha, cref, areaAtuacao, tempoExperiencia, especialidades }) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [resultado] = await conn.query(
        `INSERT INTO usuarios (nome, nomeusuario, email, senha, tipo, nivel)
         VALUES (?, ?, ?, ?, 'profissional', 'profissional')`,
        [nome, nomeusuario || null, email, senha]);
      const novoId = resultado.insertId;
      await conn.query(
        `INSERT INTO profissionais (usuario_id, cref, area_atuacao, tempo_experiencia, especialidades)
         VALUES (?, ?, ?, ?, ?)`,
        [novoId, cref, areaAtuacao, tempoExperiencia, especialidades]);
      await conn.commit();
      const [linhas] = await conn.query(
        "SELECT * FROM usuarios WHERE id = ?", [novoId]);
      return linhas[0];
    } catch (error) {
      await conn.rollback();
      console.log(error);
      return null;
    } finally { conn.release(); }
  },

  // Atualiza pontos e recalcula nível automaticamente
  atualizarPontos: async (usuarioId, pontosGanhos) => {
    try {
      await pool.query(
        "UPDATE usuarios SET pontos = pontos + ? WHERE id = ?",
        [pontosGanhos, usuarioId]);

      // Recalcular nível com base nos pontos totais
      const [linhas] = await pool.query(
        "SELECT pontos FROM usuarios WHERE id = ?", [usuarioId]);
      const totalPontos = linhas[0]?.pontos || 0;
      let novoNivel = "iniciante";
      if (totalPontos >= 600) novoNivel = "elite";
      else if (totalPontos >= 300) novoNivel = "avancado";
      else if (totalPontos >= 100) novoNivel = "intermediario";

      await pool.query(
        "UPDATE usuarios SET nivel = ? WHERE id = ?",
        [novoNivel, usuarioId]);

      return { pontos: totalPontos, nivel: novoNivel };
    } catch (error) { return error; }
  },

  // ── Profissionais ────────────────────────────────────────

  // Lista todos os profissionais disponíveis com dados extras
  listarProfissionais: async (busca = "") => {
    try {
      const termoBusca = `%${busca}%`;
      const [linhas] = await pool.query(
        `SELECT
           u.id, u.nome, u.nomeusuario, u.email, u.foto_perfil,
           p.cref, p.area_atuacao, p.especialidades,
           p.tempo_experiencia, p.disponivel
         FROM usuarios u
         INNER JOIN profissionais p ON p.usuario_id = u.id
         WHERE u.tipo = 'profissional'
           AND p.disponivel = 1
           AND (u.nome LIKE ? OR p.area_atuacao LIKE ? OR p.especialidades LIKE ?)
         ORDER BY u.nome ASC`,
        [termoBusca, termoBusca, termoBusca]);
      return linhas;
    } catch (error) { return []; }
  },

  // Lista pacientes vinculados (para painel do profissional)
  listarPacientes: async () => {
    try {
      const [linhas] = await pool.query(
        `SELECT
           u.id, u.nome, u.nomeusuario, u.email, u.nivel, u.pontos,
           u.criado_em,
           COUNT(t.id)                                           AS total_tarefas,
           SUM(CASE WHEN t.concluida = 1 THEN 1 ELSE 0 END)    AS tarefas_concluidas
         FROM usuarios u
         LEFT JOIN tarefas t ON t.usuario_id = u.id
         WHERE u.tipo = 'cliente'
         GROUP BY u.id
         ORDER BY u.pontos DESC, u.nome ASC`);
      return linhas;
    } catch (error) { return []; }
  },

  // ── Vínculos profissional ↔ paciente ─────────────────────

  // Solicitar vínculo (paciente pede profissional)
  solicitarVinculo: async (pacienteId, profissionalId) => {
    try {
      await pool.query(
        `INSERT IGNORE INTO vinculos (paciente_id, profissional_id, status)
         VALUES (?, ?, 'solicitado')`,
        [pacienteId, profissionalId]);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  // Busca vínculo ativo entre paciente e algum profissional
  buscarVinculoAtivo: async (pacienteId) => {
    try {
      const [linhas] = await pool.query(
        `SELECT v.*, u.nome AS profissional_nome,
                p.area_atuacao, p.especialidades
         FROM vinculos v
         INNER JOIN usuarios u ON u.id = v.profissional_id
         INNER JOIN profissionais p ON p.usuario_id = v.profissional_id
         WHERE v.paciente_id = ? AND v.status IN ('solicitado','ativo')
         LIMIT 1`,
        [pacienteId]);
      return linhas[0] || null;
    } catch (error) { return null; }
  },
};

module.exports = usuarioModel;
