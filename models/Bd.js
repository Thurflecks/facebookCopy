const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("facebook", "root", "", {
    host: "localhost",
    dialect: "mysql",
})

sequelize.authenticate().then(()=>
console.log("banco de dados conectado")
).catch((err)=>{
    console.log(`deu erro arromabedi ${err}`)
})

module.exports = {
    Sequelize, sequelize
}