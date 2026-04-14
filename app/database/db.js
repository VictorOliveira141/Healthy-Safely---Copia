// ============================================================
// CONEXÃO COM O BANCO DE DADOS MySQL (mysql2 + dotenv)
// ============================================================
require("dotenv").config();
const mysql = require("mysql2/promise");

// Pool de conexões para melhor performance
const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:     process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

// Testa a conexão ao iniciar
pool.getConnection()
  .then((conn) => {
    console.log("✅ MySQL conectado com sucesso!");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar no MySQL:", err.message);
    console.error("Verifique as variáveis no arquivo .env");
  });

module.exports = pool;
