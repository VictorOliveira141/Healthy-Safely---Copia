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
  }),
);
app.use("/icons", express.static("node_modules/boxicons"));
// 🔗 Torna o usuário logado disponível em todas as views EJS
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

// 🧩 Configuração para receber dados de formulários
app.use(express.urlencoded({ extended: true }));

// 🖼️ Arquivos estáticos (CSS, imagens, JS frontend)
app.use(express.static("./app/public"));

// ⚙️ Configuração do EJS
app.set("view engine", "ejs");
app.set("views", "./app/views");

// 📦 Importação das rotas
const rotaPrincipal = require("./app/routes/router");

// 🧭 Uso das rotas
app.use("/", rotaPrincipal);

// 🚀 Inicialização do servidor
app.listen(porta, () => {
  console.log(`Servidor online 🔥\nhttp://localhost:${porta}`);
});
