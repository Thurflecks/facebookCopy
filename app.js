const express = require("express")
const path = require("path")
const app = express()
const router = require("./routers/routerMain.js")
const { engine } = require("express-handlebars")

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
//config rotas
app.use(router)


//escutando porta
app.listen(port, () =>{
    console.log("funcionando burro")
})