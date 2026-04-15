// ============================================================
// routes/router-admin.js
// Rotas do painel administrativo — protegidas por sessão
// Padrão MVC (Prof. Giovani Wingter)
// ============================================================
const express        = require("express");
const router         = express.Router();
const adminController = require("../controllers/adminController");

// ── Middleware: bloqueia acesso sem sessão admin ─────────────
function verificarAdmin(req, res, next) {
  if (req.session && req.session.adminAutenticado) return next();
  return res.redirect("/admin");
}

/* ── LOGIN ─────────────────────────────────────────────────── */
router.get("/",      adminController.exibirLogin);
router.post("/",     adminController.processarLogin);

/* ── PAINEL ────────────────────────────────────────────────── */
router.get("/painel", verificarAdmin, adminController.exibirPainel);

/* ── LOGOUT ────────────────────────────────────────────────── */
router.get("/sair",   verificarAdmin, adminController.sair);

module.exports = router;
