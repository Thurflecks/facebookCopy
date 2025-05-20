const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("railway", "root", "yLCkTlmUozTZyPnbTeBzMQfYudBMkaKe", {
    host: "centerbeam.proxy.rlwy.net",
    dialect: "mysql",
    port: 52236,
})

sequelize.authenticate().then(()=>
console.log("banco de dados conectado")
).catch((err)=>{
    console.log(`deu erro arromabedi ${err}`)
})

module.exports = {
    Sequelize, sequelize
}