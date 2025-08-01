const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("railway", "root", "oMOOsLcnMHCVxhZwZcMKloXQvTpXNCbj", {
    host: "mainline.proxy.rlwy.net",
    dialect: "mysql",
    port: 16272,
})

sequelize.authenticate().then(()=>
console.log("banco de dados conectado")
).catch((err)=>{
    console.log(`deu erro arromabedi ${err}`)
})

module.exports = {
    Sequelize, sequelize
}