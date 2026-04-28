var pool   = require("../../app/config/pool_conexoes");
var bcrypt = require("bcryptjs");

const usuarioModel = {

  buscarPorId: async (id) => {
    try {
      const [linhas] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
      return linhas[0] || null;
    } catch (e) { return null; }
  },

  buscarPorLogin: async (valor) => {
    try {
      const [linhas] = await pool.query(
        "SELECT * FROM usuarios WHERE email = ? OR nomeusuario = ?", [valor, valor]);
      return linhas[0] || null;
    } catch (e) { return null; }
  },

  emailExiste: async (email) => {
    try {
      const [linhas] = await pool.query("SELECT id FROM usuarios WHERE email = ?", [email]);
      return linhas.length > 0;
    } catch (e) { return false; }
  },

  nomeUsuarioExiste: async (nomeusuario) => {
    try {
      const [linhas] = await pool.query("SELECT id FROM usuarios WHERE nomeusuario = ?", [nomeusuario]);
      return linhas.length > 0;
    } catch (e) { return false; }
  },

  // Cria cliente + copia tarefas_padrao (transação)
  criarCliente: async ({ nome, nomeusuario, email, senha }) => {
    const senhaHash = await bcrypt.hash(senha, 10);
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [r] = await conn.query(
        `INSERT INTO usuarios (nome, nomeusuario, email, senha, tipo, nivel)
         VALUES (?, ?, ?, ?, 'cliente', 'iniciante')`,
        [nome, nomeusuario, email, senhaHash]);
      const novoId = r.insertId;
      await conn.query(
        `INSERT INTO tarefas (usuario_id, titulo, pontos, categoria)
         SELECT ?, titulo, pontos, categoria FROM tarefas_padrao`, [novoId]);
      await conn.commit();
      const [linhas] = await conn.query("SELECT * FROM usuarios WHERE id = ?", [novoId]);
      return linhas[0];
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally { conn.release(); }
  },

  // Cria profissional + dados extras (transação)
  criarProfissional: async ({ nome, nomeusuario, email, senha, cref, areaAtuacao, tempoExperiencia, especialidades }) => {
    const senhaHash = await bcrypt.hash(senha, 10);
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [r] = await conn.query(
        `INSERT INTO usuarios (nome, nomeusuario, email, senha, tipo, nivel)
         VALUES (?, ?, ?, ?, 'profissional', 'profissional')`,
        [nome, nomeusuario || null, email, senhaHash]);
      const novoId = r.insertId;
      await conn.query(
        `INSERT INTO profissionais (usuario_id, cref, area_atuacao, tempo_experiencia, especialidades)
         VALUES (?, ?, ?, ?, ?)`,
        [novoId, cref, areaAtuacao, tempoExperiencia, especialidades]);
      await conn.commit();
      const [linhas] = await conn.query("SELECT * FROM usuarios WHERE id = ?", [novoId]);
      return linhas[0];
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally { conn.release(); }
  },

  verificarSenha: async (senhaDigitada, senhaHash) => {
    return bcrypt.compare(senhaDigitada, senhaHash);
  },

  // Atualiza pontos e recalcula nível
  atualizarPontos: async (usuarioId, pontosGanhos) => {
    try {
      await pool.query("UPDATE usuarios SET pontos = pontos + ? WHERE id = ?", [pontosGanhos, usuarioId]);
      const [linhas] = await pool.query("SELECT pontos FROM usuarios WHERE id = ?", [usuarioId]);
      const total = linhas[0]?.pontos || 0;
      let nivel = "iniciante";
      if (total >= 600) nivel = "elite";
      else if (total >= 300) nivel = "avancado";
      else if (total >= 100) nivel = "intermediario";
      await pool.query("UPDATE usuarios SET nivel = ? WHERE id = ?", [nivel, usuarioId]);
      return { pontos: total, nivel };
    } catch (e) { return null; }
  },

  // Listar profissionais disponíveis com busca
  listarProfissionais: async (busca = "") => {
    try {
      const t = `%${busca}%`;
      const [linhas] = await pool.query(
        `SELECT u.id, u.nome, u.email, u.foto_perfil,
                p.cref, p.area_atuacao, p.especialidades, p.tempo_experiencia
         FROM usuarios u
         INNER JOIN profissionais p ON p.usuario_id = u.id
         WHERE u.tipo = 'profissional' AND p.disponivel = 1
           AND (u.nome LIKE ? OR p.area_atuacao LIKE ? OR p.especialidades LIKE ?)
         ORDER BY u.nome ASC`, [t, t, t]);
      return linhas;
    } catch (e) { return []; }
  },

  // Lista todos os clientes com stats (para profissional)
  listarPacientes: async () => {
    try {
      const [linhas] = await pool.query(
        `SELECT u.id, u.nome, u.nomeusuario, u.email, u.nivel, u.pontos, u.criado_em,
                COUNT(t.id)                                          AS total_tarefas,
                SUM(CASE WHEN t.concluida = 1 THEN 1 ELSE 0 END)   AS tarefas_concluidas,
                ROUND(IFNULL(SUM(CASE WHEN t.concluida=1 THEN 1 ELSE 0 END),0)
                      / NULLIF(COUNT(t.id),0)*100,0)               AS pct
         FROM usuarios u
         LEFT JOIN tarefas t ON t.usuario_id = u.id
         WHERE u.tipo = 'cliente'
         GROUP BY u.id ORDER BY u.pontos DESC, u.nome ASC`);
      return linhas;
    } catch (e) { return []; }
  },

  // Busca tarefas de um cliente específico (para profissional)
  buscarTarefasCliente: async (clienteId) => {
    try {
      const [linhas] = await pool.query(
        "SELECT * FROM tarefas WHERE usuario_id = ? ORDER BY concluida ASC, criado_em DESC",
        [clienteId]);
      return linhas;
    } catch (e) { return []; }
  },

  // Deletar usuário (admin)
  deletar: async (id) => {
    try {
      await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
      return true;
    } catch (e) { return false; }
  },

  // Vínculos
  solicitarVinculo: async (pacienteId, profissionalId) => {
    try {
      await pool.query(
        `INSERT IGNORE INTO vinculos (paciente_id, profissional_id, status)
         VALUES (?, ?, 'pendente')`, [pacienteId, profissionalId]);
      await pool.query(
        `INSERT INTO solicitacoes (paciente_id, profissional_id, tipo, status)
         VALUES (?, ?, 'vinculo', 'pendente')`, [pacienteId, profissionalId]);
      return true;
    } catch (e) { return false; }
  },

  buscarVinculo: async (pacienteId) => {
    try {
      const [linhas] = await pool.query(
        `SELECT v.*, u.nome AS prof_nome, p.area_atuacao
         FROM vinculos v
         JOIN usuarios u ON u.id = v.profissional_id
         JOIN profissionais p ON p.usuario_id = v.profissional_id
         WHERE v.paciente_id = ? AND v.status IN ('pendente','ativo')
         LIMIT 1`, [pacienteId]);
      return linhas[0] || null;
    } catch (e) { return null; }
  },
};

module.exports = usuarioModel;
