const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: process.env.DB_PORT,
    }
);

sequelize.authenticate()
    .then(() => console.log("Banco de dados conectado com sucesso!"))
    .catch((err) => console.log(`Erro ao conectar: ${err.message}`));

module.exports = { Sequelize, sequelize };
