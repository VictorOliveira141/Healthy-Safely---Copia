// ============================================================
// controllers/adminController.js
// Controller do Painel Admin — protegido por senha .env
// Padrão MVC (Prof. Giovani Wingter)
// ============================================================
const adminModel = require("../models/Admin");

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const adminController = {

  // ── GET /admin — exibe formulário de senha ─────────────────
  exibirLogin: (req, res) => {
    if (req.session.adminAutenticado) return res.redirect("/admin/painel");
    res.render("pages/admin/login", { erro: null });
  },

  // ── POST /admin — valida senha ─────────────────────────────
  processarLogin: (req, res) => {
    const { senha } = req.body;
    if (senha === ADMIN_PASSWORD) {
      req.session.adminAutenticado = true;
      return res.redirect("/admin/painel");
    }
    res.render("pages/admin/login", { erro: "Senha incorreta. Tente novamente." });
  },

  // ── GET /admin/painel — painel principal ───────────────────
  exibirPainel: async (req, res) => {
    try {
      const [usuarios, stats, cadastrosPorDia] = await Promise.all([
        adminModel.listarTodosUsuarios(),
        adminModel.estatisticasGerais(),
        adminModel.cadastrosPorDia(),
      ]);
      res.render("pages/admin/painel", { usuarios, stats, cadastrosPorDia });
    } catch (err) {
      console.error("Erro no painel admin:", err);
      res.status(500).render("pages/admin/painel", {
        usuarios: [], stats: {}, cadastrosPorDia: [],
        erro: "Erro ao carregar dados do banco.",
      });
    }
  },

  // ── GET /admin/sair — encerra sessão admin ─────────────────
  sair: (req, res) => {
    req.session.adminAutenticado = false;
    res.redirect("/admin");
  },

};

module.exports = adminController;
