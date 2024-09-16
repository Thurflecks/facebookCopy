const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("facebook", "root", "", {
    host: "localhost",
    dialect: "mysql"
})

sequelize.authenticate().then(()=>
console.log("vasco da gama")
).catch((err)=>{
    console.log(`deu erro arromabedi ${err}`)
})

module.exports = {
    Sequelize, sequelize
}