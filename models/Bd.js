const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("railway", "root", "wiBxytCWeOgOOqTTkTecvXmQMCeXccFG", {
    host: "shortline.proxy.rlwy.net",
    dialect: "mysql",
    port: 51142,
})

sequelize.authenticate().then(()=>
console.log("banco de dados conectado")
).catch((err)=>{
    console.log(`deu erro arromabedi ${err}`)
})

module.exports = {
    Sequelize, sequelize
}