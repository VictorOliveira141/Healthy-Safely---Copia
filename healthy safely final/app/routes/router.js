const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const usuarios = [];

/*Criação de rotas*/
router.get("/", (req, res) => {
  res.render("pages/tomarammeutela");
});

router.get("/tomarammeutela", (req, res) => {
  res.render("pages/tomarammeutela");
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
      data: "",
      senha: "",
      "confirmar-senha": "",
    },
    retorno: null,
    erroValidacao: {},
    msgErro: {}
  });
});

router.get("/tela-inicial", (req, res) => {
  res.render("pages/tomarammeutela");
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
    .withMessage("*O nome deve conter apenas letras!"),

  body("email").isEmail().withMessage("*Endereço de email inválido!"),

  body("data")
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .custom((value) => {
      const dataNascimento = new Date(value);
      const hoje = new Date();
      const idadeMinima = 14;

      const idade = hoje.getFullYear() - dataNascimento.getFullYear();
      const mes = hoje.getMonth() - dataNascimento.getMonth();

      if (idade < idadeMinima || (idade === idadeMinima && mes < 0)) {
        throw new Error(`*Você deve ter pelo menos ${idadeMinima} anos.`);
      }

      return true;
    }),

  body("senha")
    .isStrongPassword( { 
      minLowercase: 1, 
      minUppercase: 1, 
      minNumbers: 1, 
      minSymbols: 1
    })
    .withMessage("*Sua senha não é forte suficiente."),

  body("confirmar-senha")
    .notEmpty()
    .withMessage("*Campo obrigatório!")
    .custom((value, { req }) => {
      if (value !== req.body.senha) {
        throw new Error("*As senhas não conferem!");
      }
      return true;
    }),

  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    const erroValidacao = {};
    const msgErro = {};
    
    errors.array().forEach((erro) => {
      erroValidacao[erro.path] = "erro";
      msgErro[erro.path] = erro.msg;
  });

  return res.render("pages/cadastro", {
    erros: errors,
    valores: req.body,
    retorno: null,
    erroValidacao,
    msgErro,
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
