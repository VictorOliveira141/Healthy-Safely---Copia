// ============================================================
// models/Usuario.js
// Model de Usuários — acesso e manipulação no MySQL
// Padrão MVC (Prof. Giovani Wingter)
// ============================================================
var pool = require("../../app/config/pool_conexoes");

const usuarioModel = {

  // ── Buscar por ID ──────────────────────────────────────────
  buscarPorId: async (id) => {
    try {
      const [linhas] = await pool.query(
        "SELECT * FROM usuarios WHERE id = ?",
        [id]
      );
      return linhas[0] || null;
    } catch (error) {
      return error;
    }
  },

  // ── Buscar por email OU nomeusuario (para login) ───────────
  buscarPorLogin: async (valor) => {
    try {
      const [linhas] = await pool.query(
        "SELECT * FROM usuarios WHERE email = ? OR nomeusuario = ?",
        [valor, valor]
      );
      return linhas[0] || null;
    } catch (error) {
      return error;
    }
  },

  // ── Verificar se email já existe ───────────────────────────
  emailExiste: async (email) => {
    try {
      const [linhas] = await pool.query(
        "SELECT id FROM usuarios WHERE email = ?",
        [email]
      );
      return linhas.length > 0;
    } catch (error) {
      return error;
    }
  },

  // ── Verificar se nomeusuario já existe ─────────────────────
  nomeUsuarioExiste: async (nomeusuario) => {
    try {
      const [linhas] = await pool.query(
        "SELECT id FROM usuarios WHERE nomeusuario = ?",
        [nomeusuario]
      );
      return linhas.length > 0;
    } catch (error) {
      return error;
    }
  },

  // ── Criar usuário CLIENTE (com transação) ──────────────────
  // Insere o usuário e copia as tarefas_padrao automaticamente
  criarCliente: async ({ nome, nomeusuario, email, senha }) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Inserir usuário
      const [resultado] = await conn.query(
        `INSERT INTO usuarios (nome, nomeusuario, email, senha, tipo, nivel)
         VALUES (?, ?, ?, ?, 'cliente', 'iniciante')`,
        [nome, nomeusuario, email, senha]
      );
      const novoId = resultado.insertId;

      // 2. Copiar tarefas padrão para o novo usuário
      await conn.query(
        `INSERT INTO tarefas (usuario_id, titulo, pontos, categoria)
         SELECT ?, titulo, pontos, categoria FROM tarefas_padrao`,
        [novoId]
      );

      await conn.commit();

      // Retornar o usuário recém criado
      const [linhas] = await conn.query(
        "SELECT * FROM usuarios WHERE id = ?",
        [novoId]
      );
      return linhas[0];
    } catch (error) {
      await conn.rollback();
      console.log(error);
      return null;
    } finally {
      conn.release();
    }
  },

  // ── Criar usuário PROFISSIONAL (com transação) ─────────────
  // Insere em usuarios E em profissionais na mesma transação
  criarProfissional: async ({ nome, nomeusuario, email, senha, cref, areaAtuacao, tempoExperiencia, especialidades }) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Inserir na tabela usuarios
      const [resultado] = await conn.query(
        `INSERT INTO usuarios (nome, nomeusuario, email, senha, tipo, nivel)
         VALUES (?, ?, ?, ?, 'profissional', 'profissional')`,
        [nome, nomeusuario || null, email, senha]
      );
      const novoId = resultado.insertId;

      // 2. Inserir dados extras na tabela profissionais
      await conn.query(
        `INSERT INTO profissionais (usuario_id, cref, area_atuacao, tempo_experiencia, especialidades)
         VALUES (?, ?, ?, ?, ?)`,
        [novoId, cref, areaAtuacao, tempoExperiencia, especialidades]
      );

      await conn.commit();

      const [linhas] = await conn.query(
        "SELECT * FROM usuarios WHERE id = ?",
        [novoId]
      );
      return linhas[0];
    } catch (error) {
      await conn.rollback();
      console.log(error);
      return null;
    } finally {
      conn.release();
    }
  },

  // ── Atualizar pontos do usuário ────────────────────────────
  atualizarPontos: async (usuarioId, pontosGanhos) => {
    try {
      const [resultado] = await pool.query(
        "UPDATE usuarios SET pontos = pontos + ? WHERE id = ?",
        [pontosGanhos, usuarioId]
      );
      return resultado;
    } catch (error) {
      return error;
    }
  },

  // ── Listar pacientes de um profissional ────────────────────
  listarPacientes: async (profissionalId) => {
    try {
      const [linhas] = await pool.query(
        `SELECT u.id, u.nome, u.nomeusuario, u.email, u.nivel, u.pontos,
                COUNT(t.id)                                    AS total_tarefas,
                SUM(CASE WHEN t.concluida = 1 THEN 1 ELSE 0 END) AS tarefas_concluidas
         FROM usuarios u
         LEFT JOIN tarefas t ON t.usuario_id = u.id
         WHERE u.tipo = 'cliente'
         GROUP BY u.id
         ORDER BY u.nome ASC`
      );
      return linhas;
    } catch (error) {
      return error;
    }
  },

};

module.exports = usuarioModel;
