const express = require("express")
const router = express.Router()
const postModel = require("../models/Post")
const authenticate = require("../midlleware/authenticate")
const userModel = require("../models/User");
const verifyLogin = require("../midlleware/verifyLogin")

router.get("/login", verifyLogin, (req, res) => {
    res.render("login")
})

router.post("/login/conta", async (req, res) => {
    const { email, senha } = req.body;
    try {
        await userModel.findOne({
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

router.get("/criarConta", verifyLogin, (req, res) => {
    res.render("contaNova")
})

router.post("/criarConta/criando", async (req, res) => {
    const { nomeCompleto, email, senha, dataNasc } = req.body;
    try {
        await userModel.create({
            nome: nomeCompleto,
            email: email,
            senha: senha,
            data_nascimento: dataNasc,
            foto_perfil: "https://raw.githubusercontent.com/LudoVicenseStudio/assets/refs/heads/main/Imagens%20figures/Blank%20pfp.jpeg"
        })
        res.redirect("/login")

    } catch (err) {
        console.log(`erro ao criar a conta ${err}`)
        res.redirect("/criarConta")
    }
})
router.get("/newPost", authenticate, (req, res) =>{
    res.render("newPost")
})
router.get("/", authenticate, async (req, res) => {
    try {
        const posts = await postModel.findAll()

        const postsAjeitados = await Promise.all(posts.map(async(post) => {
            let user = await userModel.findByPk(post.iduser)

            return {
                ...post.dataValues,
                username: user.nome.toLowerCase(),
                foto_perfil: user.foto_perfil

            }
        }))
        res.render("feed", {postsAjeitados:postsAjeitados})
    
    } catch (err) {
        res.send("erro corno")
    }

})


module.exports = router