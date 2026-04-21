// controllers/adminController.js — Padrão MVC
const adminModel = require("../models/Admin");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const adminController = {

  exibirLogin: (req, res) => {
    if (req.session.adminAutenticado) return res.redirect("/admin/painel");
    res.render("pages/admin/login", { erro:null });
  },

  processarLogin: (req, res) => {
    if (req.body.senha === ADMIN_PASSWORD) {
      req.session.adminAutenticado = true;
      return res.redirect("/admin/painel");
    }
    res.render("pages/admin/login", { erro:"Senha incorreta. Tente novamente." });
  },

  exibirPainel: async (req, res) => {
    try {
      const [usuarios, stats, cadastrosPorDia, tarefasPorDia, ranking, solicitacoes] =
        await Promise.all([
          adminModel.listarTodosUsuarios(),
          adminModel.estatisticasGerais(),
          adminModel.cadastrosPorDia(),
          adminModel.tarefasConcluidasPorDia(),
          adminModel.rankingUsuarios(),
          adminModel.listarSolicitacoes(),
        ]);
      res.render("pages/admin/painel", {
        usuarios, stats, cadastrosPorDia, tarefasPorDia, ranking, solicitacoes,
      });
    } catch(err) {
      console.error("Erro admin painel:", err);
      res.status(500).render("pages/admin/painel", {
        usuarios:[], stats:{}, cadastrosPorDia:[], tarefasPorDia:[],
        ranking:[], solicitacoes:[], erro:"Erro ao carregar dados.",
      });
    }
  },

  deletarUsuario: async (req, res) => {
    await adminModel.deletarUsuario(req.params.id);
    res.redirect("/admin/painel");
  },

  aprovarSolicitacao: async (req, res) => {
    await adminModel.aprovarSolicitacao(req.params.id);
    res.redirect("/admin/painel");
  },

  rejeitarSolicitacao: async (req, res) => {
    await adminModel.rejeitarSolicitacao(req.params.id);
    res.redirect("/admin/painel");
  },

  sair: (req, res) => {
    req.session.adminAutenticado = false;
    res.redirect("/admin");
  },
};

module.exports = adminController;
