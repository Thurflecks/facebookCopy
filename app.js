const express = require("express")
const path = require("path")
const app = express()
const router = require("./routers/routerMain.js")
const { engine } = require("express-handlebars")
const session = require("express-session")
//porta
const port = 8081

//config pastas de arquivos estaticos
app.use(express.static(path.join(__dirname, "public")))

//config handlebars
app.engine("handlebars", engine({
    defaultLayout: "main", runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    }}
))
app.set("view engine", "handlebars")

app.use(session({
    secret: 'faceCopy',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.json());
app.use(express.urlencoded({ extended : true}));
//config rotas
app.use(router)


//escutando porta
app.listen(port, () =>{
    console.log("site online")
})