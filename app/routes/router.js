const express = require("express");
const router = express.Router();


router.get("/", (req, res)=>{
    res.render("pages/safely");
})


router.get("/safely", (req, res)=>{
    res.render("pages/safely")
})

router.get("/login", (req, res)=>{
    res.render("pages/login")
})

router.get("/cadastro", (req, res)=>{
    res.render("pages/cadastro")
})

router.get("/tela-inicial", (req, res)=>{
    res.render("pages/tela-inicial")
})

module.exports = router;

/*salve*/