const express = require("express");
const router = express.Router();

const produtos = [];

/* ROTA PARA DESLOGAR O USUÁRIO */
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Middleware para verificar se o colaborador está logado
function verificarColaborador(req, res, next) {
  if (
    req.session &&
    req.session.usuario &&
    req.session.usuario.tipo === "farmacia"
  ) {
    return next();
  }
  return res.redirect("/cadastroColaborador");
}

// ===================== ROTAS PRIVADAS(apenas sendo FARMACIA) =====================

// PAINEL DE CONTROLE
router.get("/painel", verificarColaborador, (req, res) => {
  res.render("pages/adm/painel", {
    colaborador: req.session.usuario,
    produtos,
  });
});

// ADICIONAR PRODUTO
router.get("/adicionarproduto", verificarColaborador, (req, res) => {
  res.render("pages/adm/adicionarproduto", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});

// EDITAR PRODUTO
router.get("/editarproduto", verificarColaborador, (req, res) => {
  res.render("pages/adm/editarproduto", {
    colaborador: req.session.usuario,
    produtos,
    mensagem: null,
  });
});

module.exports = router;
