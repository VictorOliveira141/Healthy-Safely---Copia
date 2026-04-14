// ============================================================
// MODEL: Usuários — operações no MySQL
// ============================================================
const db = require("../database/db");

const Usuario = {

  // Busca usuário por ID
  async buscarPorId(id) {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE id = ?", [id]);
    return rows[0] || null;
  },

  // Busca por email OU nome de usuário (para login)
  async buscarPorEmailOuNome(valor) {
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE email = ? OR nomeusuario = ?",
      [valor, valor]
    );
    return rows[0] || null;
  },

  // Verifica se email já existe
  async emailExiste(email) {
    const [rows] = await db.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );
    return rows.length > 0;
  },

  // Verifica se nomeusuario já existe
  async nomeUsuarioExiste(nomeusuario) {
    const [rows] = await db.query(
      "SELECT id FROM usuarios WHERE nomeusuario = ?",
      [nomeusuario]
    );
    return rows.length > 0;
  },

  // Cria novo usuário CLIENTE e já atribui as tarefas padrão
  async criarCliente({ nome, nomeusuario, email, senha }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Insere o usuário
      const [result] = await conn.query(
        `INSERT INTO usuarios (nome, nomeusuario, email, senha, tipo, nivel)
         VALUES (?, ?, ?, ?, 'cliente', 'iniciante')`,
        [nome, nomeusuario, email, senha]
      );
      const novoId = result.insertId;

      // 2. Copia as tarefas padrão para o novo usuário
      await conn.query(
        `INSERT INTO tarefas (usuario_id, titulo, pontos, categoria)
         SELECT ?, titulo, pontos, categoria FROM tarefas_padrao`,
        [novoId]
      );

      await conn.commit();

      const [rows] = await conn.query(
        "SELECT * FROM usuarios WHERE id = ?",
        [novoId]
      );
      return rows[0];
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  // Cria novo usuário PROFISSIONAL
  async criarProfissional({ nome, nomeusuario, email, senha, cref, areaAtuacao, tempoExperiencia, especialidades }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Insere na tabela usuarios
      const [result] = await conn.query(
        `INSERT INTO usuarios (nome, nomeusuario, email, senha, tipo, nivel)
         VALUES (?, ?, ?, ?, 'profissional', 'profissional')`,
        [nome, nomeusuario || null, email, senha]
      );
      const novoId = result.insertId;

      // 2. Insere dados extras na tabela profissionais
      await conn.query(
        `INSERT INTO profissionais (usuario_id, cref, area_atuacao, tempo_experiencia, especialidades)
         VALUES (?, ?, ?, ?, ?)`,
        [novoId, cref, areaAtuacao, tempoExperiencia, especialidades]
      );

      await conn.commit();

      const [rows] = await conn.query(
        "SELECT * FROM usuarios WHERE id = ?",
        [novoId]
      );
      return rows[0];
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};

module.exports = Usuario;
