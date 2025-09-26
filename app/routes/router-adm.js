const express = require("express");
const router = express.Router();

/* =========== ROTAS DA ÁREA ADMINISTRATIVA ============ */

router.get("/", (req, res) => {
  res.render("pages/adm/home"); // página principal admin
});

router.get("/usuarios", (req, res) => {
  res.render("pages/adm/usuarios"); // lista de usuários admin
});

router.get("/produtos", (req, res) => {
  res.render("pages/adm/produtos"); // lista de produtos admin
});

router.get("/relatorios", (req, res) => {
  res.render("pages/adm/relatorios"); // relatórios admin
});

router.get("/configuracoes", (req, res) => {
  res.render("pages/adm/configuracoes"); // configurações admin
});

module.exports = router;
