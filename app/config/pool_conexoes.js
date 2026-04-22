// ============================================================
// config/pool_conexoes.js
// Pool de conexão MySQL2 — padrão MVC (Prof. Giovani Wingter)
// ============================================================
require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  database:           process.env.DB_NAME,
  port:               process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

// Testa a conexão ao iniciar o servidor
pool.getConnection((err, conn) => {
  if (err) {
    console.error("Erro ao conectar no MySQL:", err.message);
    console.error("   Verifique as variáveis no arquivo .env");
  } else {
    console.log("MySQL conectado com sucesso!");
    conn.release();
  }
});

// Exporta o pool como Promise (permite usar async/await nos Models)
module.exports = pool.promise();
