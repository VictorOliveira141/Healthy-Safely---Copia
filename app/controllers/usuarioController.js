const usuarioModel = require("../models/Usuario");
const { body, validationResult } = require("express-validator");

const usuarioController = {
  // ── Regras de validação — CADASTRO CLIENTE ─────────────────
  regrasValidacaoCliente: [
    body("nome")
      .trim()
      .notEmpty()
      .withMessage("*Campo obrigatório!")
      .bail()
      .isLength({ min: 3, max: 50 })
      .withMessage("*Entre 3 e 50 caracteres!")
      .matches(/^[A-Za-zÀ-ú\s]+$/)
      .withMessage("*Somente letras!"),

    body("nomeusuario")
      .trim()
      .notEmpty()
      .withMessage("*Campo obrigatório!")
      .bail()
      .isLength({ min: 3, max: 30 })
      .withMessage("*Entre 3 e 30 caracteres!")
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage("*Letras, números, hífen e underscore!"),

    body("email")
      .notEmpty()
      .withMessage("*Campo obrigatório!")
      .bail()
      .isEmail()
      .withMessage("*E-mail inválido!"),

    body("senha")
      .notEmpty()
      .withMessage("*Campo obrigatório!")
      .bail()
      .isStrongPassword({
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("*Use maiúscula, número e símbolo!"),

    body("confirmarSenha")
      .notEmpty()
      .withMessage("*Campo obrigatório!")
      .custom((value, { req }) => {
        if (value !== req.body.senha)
          throw new Error("*As senhas não conferem!");
        return true;
      }),
  ],

  // ── Regras de validação — CADASTRO PROFISSIONAL ────────────
  regrasValidacaoProfissional: [
    body("nome")
      .trim()
      .notEmpty()
      .withMessage("*Campo obrigatório!")
      .bail()
      .isLength({ min: 3, max: 50 })
      .withMessage("*Entre 3 e 50 caracteres!")
      .matches(/^[A-Za-zÀ-ú\s]+$/)
      .withMessage("*Somente letras!"),

    body("cref")
      .trim()
      .notEmpty()
      .withMessage("*Campo obrigatório!")
      .bail()
      .isLength({ min: 5, max: 20 })
      .withMessage("*CREF inválido!"),

    body("areaAtuacao").notEmpty().withMessage("*Selecione a área de atuação!"),

    body("tempoExperiencia")
      .notEmpty()
      .withMessage("*Campo obrigatório!")
      .bail()
      .isInt({ min: 0 })
      .withMessage("*Informe anos de experiência (0 ou mais)!"),

    body("especialidades")
      .trim()
      .notEmpty()
      .withMessage("*Campo obrigatório!")
      .bail()
      .isLength({ min: 3, max: 200 })
      .withMessage("*Entre 3 e 200 caracteres!"),

    body("email")
      .notEmpty()
      .withMessage("*Campo obrigatório!")
      .bail()
      .isEmail()
      .withMessage("*E-mail inválido!"),

    body("senha")
      .notEmpty()
      .withMessage("*Campo obrigatório!")
      .bail()
      .isStrongPassword({
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("*Use maiúscula, número e símbolo!"),

    body("confirmarSenha")
      .notEmpty()
      .withMessage("*Campo obrigatório!")
      .custom((value, { req }) => {
        if (value !== req.body.senha)
          throw new Error("*As senhas não conferem!");
        return true;
      }),
  ],

  // ── Exibir formulário de cadastro cliente ──────────────────
  exibirCadastroCliente: (req, res) => {
    res.render("pages/cadastroCliente", {
      valores: {},
      erroValidacao: {},
      msgErro: {},
    });
  },

  // ── Exibir formulário de cadastro profissional ─────────────
  exibirCadastroProfissional: (req, res) => {
    res.render("pages/cadastroProfissional", {
      valores: {},
      erroValidacao: {},
      msgErro: {},
    });
  },

  // ── Processar cadastro de CLIENTE ──────────────────────────
  cadastrarCliente: async (req, res) => {
    const errors = validationResult(req);
    const erroValidacao = {},
      msgErro = {};

    // Erros de validação do formulário
    if (!errors.isEmpty()) {
      errors.array().forEach((e) => {
        erroValidacao[e.path] = "erro";
        msgErro[e.path] = e.msg;
      });
      return res.render("pages/cadastroCliente", {
        valores: req.body,
        erroValidacao,
        msgErro,
        retorno: null,
      });
    }

    try {
      // Verificar duplicatas no banco
      if (await usuarioModel.emailExiste(req.body.email)) {
        erroValidacao.email = "erro";
        msgErro.email = "*Este e-mail já está cadastrado!";
        return res.render("pages/cadastroCliente", {
          valores: req.body,
          erroValidacao,
          msgErro,
          retorno: null,
        });
      }
      if (await usuarioModel.nomeUsuarioExiste(req.body.nomeusuario)) {
        erroValidacao.nomeusuario = "erro";
        msgErro.nomeusuario = "*Este nome de usuário já está em uso!";
        return res.render("pages/cadastroCliente", {
          valores: req.body,
          erroValidacao,
          msgErro,
          retorno: null,
        });
      }

      // Criar no banco
      await usuarioModel.criarCliente({
        nome: req.body.nome,
        nomeusuario: req.body.nomeusuario,
        email: req.body.email,
        senha: req.body.senha,
      });

      res.redirect("/login");
    } catch (err) {
      console.error("Erro ao cadastrar cliente:", err);
      res.render("pages/cadastroCliente", {
        valores: req.body,
        erroValidacao: {},
        msgErro: {},
        retorno: "Erro interno. Tente novamente.",
      });
    }
  },

  // ── Processar cadastro de PROFISSIONAL ─────────────────────
  cadastrarProfissional: async (req, res) => {
    const errors = validationResult(req);
    const erroValidacao = {},
      msgErro = {};

    if (!errors.isEmpty()) {
      errors.array().forEach((e) => {
        erroValidacao[e.path] = "erro";
        msgErro[e.path] = e.msg;
      });
      return res.render("pages/cadastroProfissional", {
        valores: req.body,
        erroValidacao,
        msgErro,
        retorno: null,
      });
    }

    try {
      if (await usuarioModel.emailExiste(req.body.email)) {
        erroValidacao.email = "erro";
        msgErro.email = "*Este e-mail já está cadastrado!";
        return res.render("pages/cadastroProfissional", {
          valores: req.body,
          erroValidacao,
          msgErro,
          retorno: null,
        });
      }

      const novoProfissional = await usuarioModel.criarProfissional({
        nome: req.body.nome,
        nomeusuario: req.body.nomeusuario || null,
        email: req.body.email,
        senha: req.body.senha,
        cref: req.body.cref,
        areaAtuacao: req.body.areaAtuacao,
        tempoExperiencia: req.body.tempoExperiencia,
        especialidades: req.body.especialidades,
      });

      // Logar automaticamente após cadastro
      req.session.usuario = novoProfissional;
      req.session.nome = novoProfissional.nome;
      req.session.nivel = "profissional";

      res.redirect("/profissional/painel-financeiro");
    } catch (err) {
      console.error("Erro ao cadastrar profissional:", err);
      res.render("pages/cadastroProfissional", {
        valores: req.body,
        erroValidacao: {},
        msgErro: {},
        retorno: "Erro interno. Tente novamente.",
      });
    }
  },

  // ── Exibir formulário de login ─────────────────────────────
  exibirLogin: (req, res) => {
    res.render("pages/login", {
      erro: null,
      valores: { email: "" },
      erroValidacao: {},
      msgErro: {},
      sucesso: false,
    });
  },

  // ── Processar login ────────────────────────────────────────
  login: async (req, res) => {
    const login = req.body["email-login"];
    const senha = req.body["senha-login"];

    try {
      const usuario = await usuarioModel.buscarPorLogin(login);

      if (usuario && usuario.senha === senha) {
        req.session.usuario = usuario;
        req.session.nome = usuario.nome;
        req.session.nivel = usuario.nivel || "iniciante";

        if (usuario.tipo === "profissional") {
          return res.redirect("/profissional/painel-financeiro");
        }
        return res.redirect("/dashboard");
      }

      return res.render("pages/login", {
        erro: "⚠️ Usuário ou senha incorretos. Tente novamente.",
        valores: { email: login },
        erroValidacao: {},
        msgErro: {},
        sucesso: false,
      });
    } catch (err) {
      console.error("Erro no login:", err);
      return res.render("pages/login", {
        erro: "Erro interno. Tente novamente.",
        valores: { email: login },
        erroValidacao: {},
        msgErro: {},
        sucesso: false,
      });
    }
  },

  // ── Logout ─────────────────────────────────────────────────
  logout: (req, res) => {
    req.session.destroy(() => res.redirect("/login"));
  },
};

module.exports = usuarioController;
