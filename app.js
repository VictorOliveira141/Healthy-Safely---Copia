// Módulos necessários
const express = require("express");
const session = require("express-session");
const app = express();
const porta = 3000;

// Configuração da sessão para manter o usuário logado (express-session)
app.use(
  session({
    secret: "sua-chave-secreta",
    resave: false,
    saveUninitialized: false,
  }),
);

// Torna o usuário logado disponível em todas as views EJS (res.locals)
app.use("/icons", express.static("node_modules/boxicons"));
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

// Configuração para receber dados de formulários (router.post)
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos (CSS, imagens, JS frontend)
app.use(express.static("./app/public"));

//  Configuração do EJS (views)
app.set("view engine", "ejs");
app.set("views", "./app/views");

//  Importação das rotas (router)
const rotaPrincipal = require("./app/routes/router");
app.use("/", rotaPrincipal);

// Inicialização do servidor (node app.js)
app.listen(porta, () => {
  console.log(
    `Servidor do Healthy Safely está aberto! 🔥\nhttp://localhost:${porta}`,
  );
});
