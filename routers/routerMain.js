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
const fs = require("fs");
const user = require("../models/User");
const { where } = require("sequelize");
const { styleText } = require("util");
const { AsyncLocalStorage } = require("async_hooks");
const likeModel = require("../models/Likes");
const followerModel = require("../models/Follower")
const post = require("../models/Post");
const commentModel = require("../models/Comment");
const { isFloat32Array } = require("util/types");


const imagemPost = upload.fields([
    { name: 'conteudoPost', maxCount: 1 },
]);
const imagemPerfil = upload.fields([
    { name: 'fotoPerfilAtt', maxCount: 1 },
]);

router.get("/login", verifyLogin, (req, res) => {
    res.render("login")
})

router.post("/login/conta", async (req, res) => {
    try {
        const { email, senha } = req.body;
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
            res.render("login", { alerta: "<span class='alerta'>Usuário ou senha inválidos!</span>" })
        })
    } catch (err) {
        console.log("erro ao fazer o login", err)
        res.render("login", { alerta: "<span class='alerta'>Usuário ou senha inválidos!</span>" })
    }
})
router.post("/logout", async (req, res) => {
    try {
        req.session.destroy()
        res.clearCookie("connect.sid")
        res.redirect("/login")
    } catch (err) {
        console.log(err)
        const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
            return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
        })
        res.render("status404", { mensagem404: "Encontramos um erro ao sair da conta", fotoPerfil })
    }
})

router.get("/criarConta", verifyLogin, (req, res) => {
    res.render("contaNova")
})

router.post("/criarConta/criando", async (req, res) => {
    try {
        const imagePath = path.join(__dirname, '../public/imagens/default.jpeg');
        const defaultImage = fs.readFileSync(imagePath);
        const { nomeCompleto, email, senha, dataNasc } = req.body;
        await userModel.create({
            nome: nomeCompleto,
            email: email,
            senha: senha,
            data_nascimento: dataNasc,
            foto_perfil: defaultImage,
            seguidores: 0,
            seguindo: 0

        })
        res.redirect("/login")

    } catch (err) {
        console.log(`erro ao criar a conta ${err}`)
        res.render("contaNova", { mensagem: "<span class='alerta'>Erro ao criar a conta. Tente novamente!</span>" })
    }
})
router.get("/newPost", authenticate, async (req, res) => {
    const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
        return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
    })
    try {
        res.render("newPost", { fotoPerfil })
    } catch (err) {
        console.log(err)
        res.render("status404", { mensagem404: "Erro ao carregar essa página", fotoPerfil })
    }
})


router.post("/newPost/enviando", authenticate, imagemPost, async (req, res) => {
    const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
        return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
    })
    try {
        const conteudoPost = req.files['conteudoPost'] ? req.files['conteudoPost'][0] : null;
        
        // Verifica se o conteúdo do post é uma imagem
        if (conteudoPost && !conteudoPost.mimetype.startsWith('image/')) {
            throw new Error("Apenas arquivos de imagem são permitidos.");
        }

        const agora = new Date();
        const data_criacao = agora.toISOString().slice(0, 10);
        const { legenda } = req.body;

        await postModel.create({
            iduser: req.session.user.id,
            legenda: legenda,
            imagem: conteudoPost ? conteudoPost.buffer : null,
            data_criacao: data_criacao,
            likes: 0,
            comments: 0
        });

        res.redirect("/");
    } catch (erro) {
        console.log(erro);
        res.render("status404", { mensagem404: "Erro ao enviar o post: " + erro.message, fotoPerfil });
    }
});

router.get("/minhaConta", authenticate, async (req, res) => {
    const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
        return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
    });
    try {

        const id = req.session.user.id;

        const usuario = await userModel.findOne({
            where: { iduser: id }
        });

        const postUser = await postModel.findAll({
            where: { iduser: id },
            order: [['idpost', 'DESC']]
        });

        const likedPosts = await likeModel.findAll({
            where: { iduser: id }
        });
        const likedPostIds = likedPosts.map(like => like.idpost);

        const postsConta = postUser.map(post => {
            const imagemBase64 = post.imagem ? post.imagem.toString('base64') : null;
            let fotoPerfilBase64 = usuario.foto_perfil ? Buffer.from(usuario.foto_perfil).toString('base64') : null;
            const isLiked = likedPostIds.includes(post.idpost);

            return {
                ...post.dataValues,
                username: usuario.nome.toLowerCase(),
                foto_perfil: fotoPerfilBase64,
                imagem: imagemBase64,
                isLiked
            };
        });

        res.render("minhaConta", { fotoPerfil, usuario, postsConta });
    } catch (err) {
        console.log(err)
        res.render("status404", { mensagem404: "Erro ao carregar essa página", fotoPerfil })
    }
});

router.get("/minhaConta/editarPerfil", authenticate, async (req, res) => {
    const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
        return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
    })
    try {
        await userModel.findByPk(req.session.user.id).then(function (conta) {

            res.render("editarPerfil", { fotoPerfil, usuarioConta: conta });
        });

    } catch (err) {
        console.log(err)
        res.render("status404", { mensagem404: "Erro ao carregar essa página", fotoPerfil })
    }
})

router.post("/minhaConta/editarPerfil/atualizando", authenticate, imagemPerfil, async (req, res) => {
    const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
        return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
    })
    try {
        const fotoPerfilAtt = req.files['fotoPerfilAtt'] ? req.files['fotoPerfilAtt'][0].buffer : null
        const { nomeAtt, bioAtt } = req.body;
        const id = req.session.user.id
        const atualizacoes = {
            nome: nomeAtt,
            bio: bioAtt
        };
        if (fotoPerfilAtt) {
            atualizacoes.foto_perfil = fotoPerfilAtt;
        }
        await userModel.update(atualizacoes, { where: { iduser: id } });
        res.redirect("/minhaConta");
    } catch (err) {
        console.log(err)
        res.render("status404", { mensagem404: "Erro ao salvar as alterações", fotoPerfil })
    }
})

router.post("/enviarCurtida/:idpost", authenticate, async (req, res) => {
    const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
        return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
    })
    const id = req.params.idpost
    const post = await postModel.findOne({ where: { idpost: id } });
    try {
        const existingLike = await likeModel.findOne({
            where: {
                idpost: id,
                iduser: req.session.user.id
            }
        })
        if (existingLike) {
            await likeModel.destroy({
                where: {
                    idpost: id,
                    iduser: req.session.user.id
                }
            });
            await postModel.update({
                likes: post.likes -= 1
            }, {
                where: { idpost: id }
            })
            res.redirect(req.get('Referer'))
        } else {
            await likeModel.create({
                idpost: id,
                iduser: req.session.user.id
            })

            await postModel.update({
                likes: post.likes += 1
            }, {
                where: { idpost: id }
            })
            res.redirect(req.get('Referer'))
        }
    } catch (err) {
        console.log(err)
        res.render("status404", { mensagem404: "Erro ao curtir a postagem", fotoPerfil })
    }
})
router.get("/addComment/:idpost", authenticate, async (req, res) => {
    const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
        return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
    });
    const idpost = req.params.idpost;

    try {
        const comments = await commentModel.findAll({ where: { idpost: idpost }, order: [['idcomments', 'DESC']] });
        const commentsAjeitados = await Promise.all(comments.map(async (comment) => {
            const usuario = await userModel.findByPk(comment.iduser);
            const fotoPerfilBase64 = usuario.foto_perfil ? Buffer.from(usuario.foto_perfil).toString('base64') : null;
            return {
                ...comment.dataValues,
                username: usuario.nome.toLowerCase(),
                foto_perfil: fotoPerfilBase64
            };
        }));
        res.render("comments", { comments: commentsAjeitados, fotoPerfil, idpost });
    } catch (err) {
        console.log(err)
        res.render("status404", { mensagem404: "Erro ao carregar os comentários dessa postagem", fotoPerfil })
    }
});



router.post("/enviarComment/:idpost", authenticate, async (req, res) => {
    const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
        return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
    })
    console.log(req.params.idpost);
    const idpost = req.params.idpost;
    const { comentario } = req.body;
    const post = await postModel.findOne({ where: { idpost: idpost } });
    try {
        await commentModel.create({
            idpost: idpost,
            iduser: req.session.user.id,
            comment: comentario
        });
        await postModel.update({
            comments: post.comments += 1
        }, {
            where: { idpost: idpost }
        })

        res.redirect(`/addComment/${idpost}`);

    } catch (err) {
        console.log(err)
        res.render("status404", { mensagem404: "Erro ao salvar o comentário.", fotoPerfil })
    }
});

router.get("/notificacoes", authenticate, async (req, res) => {
    const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
        return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
    })

    res.render("notificacoes", { fotoPerfil })
})
router.get("/perfilPosts/:idpost", authenticate, async (req, res) => {
    const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
        return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
    });
    try {
        const idpost = req.params.idpost;

        const post = await postModel.findOne({
            where: { idpost: idpost }
        });
        const userid = post.iduser;
        if (userid === req.session.user.id) {
            res.redirect("/minhaConta");
        }

        const usuario = await userModel.findOne({
            where: { iduser: userid }
        });
        const fotoPerfilBase64 = usuario.foto_perfil ? Buffer.from(usuario.foto_perfil).toString('base64') : null;

        const postUser = await postModel.findAll({
            where: { iduser: userid },
            order: [['idpost', 'DESC']]
        });
        const liked = await likeModel.findOne({
            where: {
                idpost: post.idpost,
                iduser: req.session.user.id
            }
        });
        const isFollower = await followerModel.findOne({
            where: {
                iduser: req.session.user.id,
                idseguidor: post.iduser
            }
        })
        
        const postsConta = postUser.map(post => {
            const imagemBase64 = post.imagem ? Buffer.from(post.imagem).toString('base64') : null;
            return {
                ...post.dataValues,
                username: usuario.nome.toLowerCase(),
                foto_perfil: fotoPerfilBase64,
                imagem: imagemBase64,
                isLiked: !!liked
            };
        });

        res.render("perfilPosts", { fotoPerfilBase64, usuario, postsConta, fotoPerfil, idpost, isFollower});
    } catch (erro) {
        console.log(erro)
        res.render("status404", { mensagem404: "Erro ao acessar essa conta", fotoPerfil })
    }
});



router.get("/editPost/:idpost", authenticate, async (req, res) => {
    const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
        return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
    })
    try {
        await postModel.findByPk(req.params.idpost).then(post => {
            res.render("editPost", { fotoPerfil, post: post });
        });
    } catch (err) {
        console.log(err)
        res.render("status404", { mensagem404: "Erro ao carregar essa página.", fotoPerfil })
    }

})
router.post("/post/delete/:id", authenticate, async (req, res) => {
    const id = req.params.id
    const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
        return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
    })
    try {
        await postModel.destroy({ where: { idpost: id } })
        await likeModel.destroy({ where: { idpost: id } })
        await commentModel.destroy({ where: { idpost: id } })
        res.redirect("/minhaConta")
    } catch (err) {
        console.log(err)
        res.render("status404", { mensagem404: "Erro ao apagar esse postagem.", fotoPerfil })
    }

})
router.post("/editPost/salvando/:id", authenticate, async (req, res) => {
    const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
        return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
    })
    try {
        let { legendaNova } = req.body;
        const id = req.params.id;
        await postModel.update(
            { legenda: legendaNova },
            { where: { idpost: id } }
        );
        res.redirect("/minhaConta")
    } catch (err) {
        console.log(err)
        res.render("status404", { mensagem404: "Erro ao salvar as alterações.", fotoPerfil })
    }
})
router.get("/amigos", authenticate, async (req, res) => {
    const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
        return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
    })

    res.render("amigos", { fotoPerfil })
})


router.get("/", authenticate, async (req, res) => {
    try {
        const posts = await postModel.findAll({ order: [['idpost', 'DESC']] });

        const postsAjeitados = await Promise.all(posts.map(async (post) => {
            let user = await userModel.findByPk(post.iduser);
            const imagemBase64 = post.imagem ? post.imagem.toString('base64') : null;
            let fotoPerfilBase64 = user.foto_perfil ? Buffer.from(user.foto_perfil).toString('base64') : null;

            const liked = await likeModel.findOne({
                where: {
                    idpost: post.idpost,
                    iduser: req.session.user.id
                }
            });

            return {
                ...post.dataValues,
                username: user.nome.toLowerCase(),
                foto_perfil: fotoPerfilBase64,
                imagem: imagemBase64,
                isLiked: !!liked
            };
        }));

        const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
            return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
        });

        res.render("feed", { postsAjeitados, fotoPerfil });
    } catch (erro) {
        console.log(erro);
        res.send("erro ao exibir o feed:", erro);
    }
});
router.post("/seguir/:idpost", authenticate, async (req, res) => {
    const idpost = req.params.idpost
    const post = await postModel.findOne({
        where: { idpost: idpost }
    })
    const user1 = await userModel.findOne({where:{iduser: post.iduser } })
    const user2 = await userModel.findOne({where:{iduser: req.session.user.id } })
    try {
        const existingFollower = await followerModel.findOne({
            where: {
                iduser: req.session.user.id,
                idseguidor: post.iduser
            }
        })
        if (!!existingFollower) {
            await followerModel.destroy({
                where: {
                    iduser: req.session.user.id,
                    idseguidor: post.iduser
                }
            })
            await userModel.update({
                seguidores: user1.seguidores - 1
            }, {where: {
                iduser: post.iduser
            }})
            await userModel.update({
                seguindo: user2.seguindo - 1
            }, { where: {
                iduser: req.session.user.id
            }})
            res.redirect(req.get("Referer"))

        } else {
            await followerModel.create({
                    iduser: req.session.user.id,
                    idseguidor: post.iduser
            })
            await userModel.update({
                seguidores: user1.seguidores + 1
            }, {where: {
                iduser: post.iduser
            }})
            await userModel.update({
                seguindo: user2.seguindo + 1
            }, { where: {
                iduser: req.session.user.id
            }})
            res.redirect(req.get("Referer"))
        }
    } catch (erro) {
        const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
            return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
        });
        res.render("status404", { mensagem404: "Erro ao seguir o usuário", fotoPerfil })
        console.log(erro)
    }

})

router.get("/*", authenticate, async (req, res) => {
    const fotoPerfil = await userModel.findByPk(req.session.user.id).then(item => {
        return item.foto_perfil ? Buffer.from(item.foto_perfil).toString('base64') : null;
    });
    res.render("status404", { mensagem404: "Essa página não exite :/", fotoPerfil })
})

module.exports = router