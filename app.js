require("dotenv").config();

const express = require("express");
const session = require("express-session");
const app = express();
const porta = process.env.PORT || 3000;

// ── Sessão ────────────────────────────────────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET || "hs-segredo-dev",
    resave: false,
    saveUninitialized: false,
  }),
);

// ── Torna o usuário disponível em todas as views EJS ──────
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

// ── Parsers ───────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── Arquivos estáticos ────────────────────────────────────
app.use("/icons", express.static("node_modules/boxicons"));
app.use(express.static("./app/public"));

// ── View engine ───────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", "./app/views");

// ── Routers ───────────────────────────────────────────────
const rotaPrincipal = require("./app/routes/principalRoutes");
const rotaProfissional = require("./app/routes/profissionalRoutes");
const rotaAdmin = require("./app/routes/admRoutes");

app.use("/", rotaPrincipal);
app.use("/profissional", rotaProfissional);
app.use("/admin", rotaAdmin);

// ── 404 ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render("pages/404", {});
});

// ── Iniciar servidor ──────────────────────────────────────
app.listen(porta, () => {
  console.log(`\n🚀 Healthy Safely rodando em http://localhost:${porta}`);
  console.log(`   Ambiente: ${process.env.NODE_ENV || "desenvolvimento"}\n`);
});
