const express = require("express")
const path = require("path")
const app = express()
const router = require("./routers/routerMain.js")
const { engine } = require("express-handlebars")
const session = require("express-session")
//porta
const port = 16273

//config pastas de arquivos estaticos
app.use(express.static(path.join(__dirname, "public")))

//config handlebars
app.engine("handlebars", engine({
    defaultLayout: "main",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },
    helpers: {
        eq: (a, b) => a === b,
    },
}));
app.set("view engine", "handlebars")

app.use(session({
    secret: 'senhaFaceCopy',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//config rotas
app.use(router)


//escutando porta
app.listen(port, () => {
    console.log("site online em: http://localhost:8081")
})