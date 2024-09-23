const express = require("express")
const router = express.Router()
const post = require("../models/Post")
const authenticate = require("../midlleware/authenticate")
const user = require("../models/User");

router.get("/login", (req, res) => {
    res.render("login")
})

router.post("/login/conta", (req, res) => {
    res.send("conta logada")
})

router.get("/criarConta", (req, res) => {
    res.render("contaNova")
})

router.post("/criarConta/criando", async(req, res) => {
    const { nomeCompleto, email, senha, dataNasc } = req.body;
    try {
        await user.create({
            nome: nomeCompleto,
            email: email,
            senha: senha,
            data_nascimento: dataNasc
        })
        res.redirect("/")

    }catch(err){
        console.log(`erro ao criar a conta ${err}`)
    }
})
router.get("/", authenticate, async(req, res) =>{
    post.findAll().then(function(posts){
        res.render("feed", {posts: posts})
    })
})


module.exports = router