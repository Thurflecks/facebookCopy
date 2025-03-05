const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("sql10766166", "sql10766166", "MXBlxdbLwj", {
    host: "sql10.freesqldatabase.com",
    dialect: "mysql",
    port: 3306,
})

sequelize.authenticate().then(()=>
console.log("banco de dados conectado")
).catch((err)=>{
    console.log(`deu erro arromabedi ${err}`)
})

module.exports = {
    Sequelize, sequelize
}