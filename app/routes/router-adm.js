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
router.get("/home2", verificarFarmacia, (req, res) => {
  res.render("pages/farmacia/home2", {
    produtos,
  });
});
router.get("/paginaloja", verificarFarmacia, (req, res) => {
  res.render("pages/farmacia/paginaloja", {
    colaborador: req.session.usuario,
    produtos,
    mensagem: null,
  });
});
router.get("/adicionarproduto", verificarFarmacia, (req, res) => {
  res.render("pages/farmacia/adicionarproduto", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});
router.get("/editarproduto", verificarFarmacia, (req, res) => {
  res.render("pages/farmacia/editarproduto", {
    colaborador: req.session.usuario,
    produtos,
    mensagem: null,
  });
});
router.get("/gerenciarpedidos", verificarFarmacia, (req, res) => {
  res.render("pages/farmacia/gerenciarpedidos", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});
router.get("/vendas", verificarFarmacia, (req, res) => {
  res.render("pages/farmacia/vendas", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});
router.get("/avaliacoes", verificarFarmacia, (req, res) => {
  res.render("pages/farmacia/avaliacoes", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});
/* Rota de suporte ao cliente desativada para essa banca final
router.get("/suportecliente", (req, res) => {
  res.render("pages/farmacia/suportecliente", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});

/* ========== ROTAS PRIVADAS (apenas colaborador/profissional tem acesso) ========== */
router.get("/home3", verificarProfissional, (req, res) => {
  res.render("pages/profissional/home3", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});
router.get("/perfil-profissional", verificarProfissional, (req, res) => {
  res.render("pages/profissional/perfil-profissional", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});
router.get("/agenda", verificarProfissional, (req, res) => {
  res.render("pages/profissional/agenda", {
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
router.get("/avaliacoes2", verificarProfissional, (req, res) => {
  res.render("pages/profissional/avaliacoes2", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});

module.exports = router;
