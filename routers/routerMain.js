const express = require("express")
const router = express.Router()
const post = require("../models/Post")
const authenticate = require("../midlleware/authenticate")
const user = require("../models/User");

router.get("/login", (req, res) => {
    res.render("login")
})

router.post("/login/conta", async (req, res) => {
    const { email, senha } = req.body;
    try {
        user.findOne({
            where: { email: email, senha: senha }
        }).then((usuario) => {
            req.session.user = {
                id: usuario.iduser,
                email: usuario.email,
            }
            res.redirect("/")
        }).catch(erro => {
            console.log(erro)
            res.redirect("/login")
        })
    } catch (err) {
        console.log(err)
        res.redirect("/login")
    }
})

router.get("/criarConta", (req, res) => {
    res.render("contaNova")
})

router.post("/criarConta/criando", async (req, res) => {
    const { nomeCompleto, email, senha, dataNasc } = req.body;
    try {
        await user.create({
            nome: nomeCompleto,
            email: email,
            senha: senha,
            data_nascimento: dataNasc
        })
        res.redirect("/")

    } catch (err) {
        console.log(`erro ao criar a conta ${err}`)
        res.redirect("/criarConta")
    }
})
router.get("/", authenticate, async (req, res) => {
    post.findAll().then(function (posts) {
        res.render("feed", { posts: posts })
    })
})


module.exports = router