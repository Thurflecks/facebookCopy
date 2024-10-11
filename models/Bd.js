const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("sql10737143", "sql10737143", "aDwXIWx8jA", {
    host: "sql10.freesqldatabase.com",
    dialect: "mysql"
})

sequelize.authenticate().then(()=>
console.log("banco de dados conectado")
).catch((err)=>{
    console.log(`deu erro arromabedi ${err}`)
})

module.exports = {
    Sequelize, sequelize
}