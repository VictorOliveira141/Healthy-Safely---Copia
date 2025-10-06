const express = require("express");
const session = require("express-session");
const app = express();
const porta = 3000;

// 🧱 Configuração de sessão
app.use(
  session({
    secret: "sua-chave-secreta", // troque por algo seguro depois
    resave: false,
    saveUninitialized: false,
  })
);

// 🧩 Configuração para receber dados de formulários
app.use(express.urlencoded({ extended: true }));

// 🖼️ Arquivos estáticos (CSS, imagens, JS frontend)
app.use(express.static("./app/public"));

// ⚙️ Configuração do EJS
app.set("view engine", "ejs");
app.set("views", "./app/views");

// 📦 Importação das rotas
const rotaPrincipal = require("./app/routes/router");
const rotaAdm = require("./app/routes/router-adm");

// 🧭 Uso das rotas
app.use("/", rotaPrincipal); // rotas principais (login, cadastro, etc)
app.use("/adm", rotaAdm); // rotas do painel administrativo

// 🚀 Inicialização do servidor
app.listen(porta, () => {
  console.log(`Servidor online 🔥\nhttp://localhost:${porta}`);
});
