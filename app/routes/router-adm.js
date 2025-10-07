const express = require("express");
const router = express.Router();

/* Middleware para verificar se o colaborador está logado */
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

/* ========== ROTAS PRIVADAS (apenas colaborador/farmácia) ========== */

// Página inicial do colaborador (a nova versão que mostra a loja dele)
router.get("/home", verificarColaborador, (req, res) => {
  res.render("pages/adm/home2", {
    produtos,
  });
});

// Adicionar Produto
router.get("/adicionarproduto", verificarColaborador, (req, res) => {
  res.render("pages/adm/adicionarproduto", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});

/* Editar Produto */
router.get("/editarproduto", verificarColaborador, (req, res) => {
  res.render("pages/adm/editarproduto", {
    colaborador: req.session.usuario,
    produtos, // ← aqui estão os dois produtos que vão aparecer
    mensagem: null,
  });
});

/* Logout */
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

/* Simulação de produtos da loja do colaborador */
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

module.exports = router;
