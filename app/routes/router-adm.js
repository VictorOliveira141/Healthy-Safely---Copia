const express = require("express");
const router = express.Router();

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
router.get("/home2", (req, res) => {
  res.render("pages/adm/home2", {
    produtos, // ← aqui estão produtos que vão aparecer apartir do array PRODUTOS[]
  });
});
router.get("/paginaloja", (req, res) => {
  res.render("pages/adm/paginaloja", {
    colaborador: req.session.usuario,
    produtos, // ← aqui estão produtos que vão aparecer apartir do array PRODUTOS[]
    mensagem: null,
  });
});
router.get("/adicionarproduto", (req, res) => {
  res.render("pages/adm/adicionarproduto", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});
router.get("/editarproduto", (req, res) => {
  res.render("pages/adm/editarproduto", {
    colaborador: req.session.usuario,
    produtos, // ← aqui estão produtos que vão aparecer apartir do array PRODUTOS[]
    mensagem: null,
  });
});
router.get("/gerenciarpedidos", (req, res) => {
  res.render("pages/adm/gerenciarpedidos", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});
router.get("/vendas", (req, res) => {
  res.render("pages/adm/vendas", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});
router.get("/avaliacoes", (req, res) => {
  res.render("pages/adm/avaliacoes", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});

/* Rota de suporte ao cliente desativada para essa banca final
router.get("/suportecliente", (req, res) => {
  res.render("pages/adm/suportecliente", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});
*/

router.get("/home3", (req, res) => {
  res.render("pages/adm/home3", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});
router.get("/agenda", (req, res) => {
  res.render("pages/adm/agenda", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});
router.get("/consultas", (req, res) => {
  res.render("pages/adm/consultas", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});
router.get("/pacientes", (req, res) => {
  res.render("pages/adm/pacientes", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});
router.get("/avaliacoes2", (req, res) => {
  res.render("pages/adm/avaliacoes2", {
    colaborador: req.session.usuario,
    mensagem: null,
  });
});

module.exports = router;
