const express = require("express")
const router = express.Router()


router.get("/login", (req, res) => {
    res.render("login")
})

router.post("/login/conta", (req, res) => {
    res.send("conta logada")
})

router.get("/criarConta", (req, res) => {
    res.render("contaNova")
})

router.post("/criarConta/criando", (req, res) => {
    res.redirect("/")
})


router.get("/", (req, res) =>{
    res.render("homepage")
})

module.exports = router