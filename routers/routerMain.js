const express = require("express")
const router = express.Router()
const postModel = require("../models/Post")
const authenticate = require("../midlleware/authenticate")
const userModel = require("../models/User");
const verifyLogin = require("../midlleware/verifyLogin");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const path = require("path")
const fs = require("fs")

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
    const imagePath = '/home/two/Documentos/facebookCopy/public/imagens/default.jpeg';
    const defaultImage = fs.readFileSync(imagePath);
    const { nomeCompleto, email, senha, dataNasc } = req.body;
    try {
        await userModel.create({
            nome: nomeCompleto,
            email: email,
            senha: senha,
            data_nascimento: dataNasc,
            foto_perfil: defaultImage

        })
        res.redirect("/login")

    } catch (err) {
        console.log(`erro ao criar a conta ${err}`)
        res.redirect("/criarConta")
    }
})
router.get("/newPost", authenticate, async (req, res) => {
    const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
        return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
    })
    res.render("newPost", { fotoPerfil })
})

const imagemPost = upload.fields([
    { name: 'conteudoPost', maxCount: 1 },
]);


router.post("/newPost/enviando", authenticate, imagemPost, async (req, res) => {
    const conteudoPost = req.files['conteudoPost'] ? req.files['conteudoPost'][0].buffer : null
    const agora = new Date();
    const data_criacao = agora.toISOString().slice(0, 10);
    const { legenda } = req.body;
    try {
        await postModel.create({
            iduser: req.session.user.id,
            legenda: legenda,
            imagem: conteudoPost,
            data_criacao: data_criacao

        })
        res.redirect("/")

    } catch (erro) {
        console.log(erro)
    }


})
router.get("/", authenticate, async (req, res) => {
    try {
        const posts = await postModel.findAll();

        const postsAjeitados = await Promise.all(posts.map(async (post) => {
            let user = await userModel.findByPk(post.iduser);
            const imagemBase64 = post.imagem ? post.imagem.toString('base64') : null;
            let fotoPerfilBase64 = user.foto_perfil ? Buffer.from(user.foto_perfil).toString('base64') : null;

            return {
                ...post.dataValues,
                username: user.nome.toLowerCase(),
                foto_perfil: fotoPerfilBase64,
                imagem: imagemBase64
            };
        }));
        const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
            return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
        })

        res.render("feed", { postsAjeitados: postsAjeitados, fotoPerfil });
    } catch (err) {
        console.log(err)
        res.send("erro corno");
    }
});


module.exports = router