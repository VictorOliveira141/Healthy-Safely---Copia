// ============================================================
// controllers/adminController.js — Padrão MVC
// ============================================================
const adminModel = require("../models/Admin");

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const adminController = {

  exibirLogin: (req, res) => {
    if (req.session.adminAutenticado) return res.redirect("/admin/painel");
    res.render("pages/admin/login", { erro: null });
  },

  processarLogin: (req, res) => {
    const { senha } = req.body;
    if (senha === ADMIN_PASSWORD) {
      req.session.adminAutenticado = true;
      return res.redirect("/admin/painel");
    }
    res.render("pages/admin/login", { erro: "Senha incorreta. Tente novamente." });
  },

  exibirPainel: async (req, res) => {
    try {
      const [usuarios, stats, cadastrosPorDia, tarefasPorDia, ranking] =
        await Promise.all([
          adminModel.listarTodosUsuarios(),
          adminModel.estatisticasGerais(),
          adminModel.cadastrosPorDia(),
          adminModel.tarefasConcluidasPorDia(),
          adminModel.rankingUsuarios(),
        ]);
      res.render("pages/admin/painel", {
        usuarios, stats, cadastrosPorDia, tarefasPorDia, ranking,
      });
    } catch (err) {
      console.error("Erro no painel admin:", err);
      res.status(500).render("pages/admin/painel", {
        usuarios: [], stats: {}, cadastrosPorDia: [],
        tarefasPorDia: [], ranking: [],
        erro: "Erro ao carregar dados do banco.",
      });
    }
  },

  sair: (req, res) => {
    req.session.adminAutenticado = false;
    res.redirect("/admin");
  },
};

module.exports = adminController;
