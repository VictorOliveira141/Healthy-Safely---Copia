const express = require("express");
const session = require("express-session");
const app = express();
const porta = 3000;

app.use(session({
  secret: "hs-segredo-2025",
  resave: false,
  saveUninitialized: false,
}));

app.use("/icons", express.static("node_modules/boxicons"));
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static("./app/public"));

app.set("view engine", "ejs");
app.set("views", "./app/views");

// Rotas principais
const rotaPrincipal = require("./app/routes/router");
app.use("/", rotaPrincipal);

// Rotas da área profissional (PRECISA estar registrado!)
const rotaProfissional = require("./app/routes/router-adm");
app.use("/profissional", rotaProfissional);

// 404 handler
app.use((req, res) => {
  res.status(404).render("pages/404", {});
});

app.listen(porta, () => {
  console.log(`Healthy Safely rodando em http://localhost:${porta}`);
});
