const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("railway", "root", "AywWUvmufUdnBUcpqimfMfzamlLTlywV", {
    host: "junction.proxy.rlwy.net",
    dialect: "mysql",
    port: 57170
})

sequelize.authenticate().then(()=>
console.log("banco de dados conectado")
).catch((err)=>{
    console.log(`deu erro arromabedi ${err}`)
})

module.exports = {
    Sequelize, sequelize
}