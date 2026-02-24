const express = require("express");
const router = express.Router();

/* ========== Middleware para verificar se o colaborador está logado ========== */
function verificarFarmacia(req, res, next) {
  if (
    req.session &&
    req.session.usuario &&
    req.session.usuario.tipo === "farmacia"
  ) {
    return next();
  }
  return res.redirect("/cadastroColaborador");
}
function verificarProfissional(req, res, next) {
  if (
    req.session &&
    req.session.usuario &&
    req.session.usuario.tipo === "profissional"
  ) {
    return next();
  }
  return res.redirect("/cadastroColaborador");
}

// Simulação de um array de produtos
let produtos = [
  {
    id: 1,
    nome: "Whey Protein 1kg",
    imagem: "../imagem/whey.png",
    precoAntigo: "R$ 89,99",
    desconto: "-20%",
    preco: "R$ 71,99",
    vendidos: 250,
  },
];

/* ========== ROTAS PRIVADAS (apenas colaborador/farmácia tem acesso) ========== */

/* ========== ROTAS PRIVADAS (apenas colaborador/profissional tem acesso) ========== */
router.get("/perfil-profissional", verificarProfissional, (req, res) => {
  res.render("pages/profissional/perfil-profissional", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});

router.get("/painel-financeiro", verificarProfissional, (req, res) => {
  res.render("pages/profissional/painel-financeiro", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});

module.exports = router;
