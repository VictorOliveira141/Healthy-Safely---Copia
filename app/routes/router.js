const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const usuarios = [];

/*Criação de rotas*/
router.get("/", (req, res) => {
  res.render("pages/safely");
});

router.get("/safely", (req, res) => {
  res.render("pages/safely");
});

router.get("/login", (req, res) => {
  res.render("pages/login", { erro: null, sucesso: false });
});

router.get("/cadastro", (req, res) => {
  res.render("pages/cadastro", {
    erros: null,
    valores: {
      nome: "",
      email: "",
      senha: "",
      "confirmar-senha": "",
    },
    retorno: null,
  });
});

router.get("/tela-inicial", (req, res) => {
  res.render("pages/tela-inicial");
});
/*fim*/

/*Criação de validações*/
router.post(
  "/cadastro",

  body("nome")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("*O Nome de usuário deve conter entre 3 e 50 caracteres!")
    .matches(/^[A-Za-zÀ-ú\s]+$/)
    .withMessage("O nome deve conter apenas letras!"),

  body("email").isEmail().withMessage("*Endereço de email inválido!"),

  body("senha")
    .isLength({ min: 8 })
    .withMessage("*Digite uma senha maior que 8 digitos!"),

  body("confirmar-senha")
    .isLength({ min: 8 })
    .withMessage("*As senha não confere!")
    .custom((value, { req }) => {
      if (value !== req.body.senha) {
        throw new Error("As senhas não conferem!");
      }
      return true;
    }),

  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.render("pages/cadastro", {
        erros: errors,
        valores: req.body,
        retorno: null,
      });
    }

    usuarios.push({
      email: req.body.email,
      senha: req.body.senha,
    });

    res.redirect("/login");
  }
);

router.post("/login", (req, res) => {
  const { usuarioDigitado, senhaDigitada } = req.body;

  const usuarioEncontrado = usuarios.find(
    (u) => u.email === usuarioDigitado && u.senha === senhaDigitada
  );

  if (usuarioEncontrado) {
    return res.render("pages/login", { erro: null, sucesso: true });
  } else {
    return res.render("pages/login", {
      erro: "*Não reconhecemos estas credenciais. Tente novamente.",
      sucesso: false,
    });
  }
});

/*Fim*/

module.exports = router;
