const { Sequelize, sequelize } = require("./Bd");


const notificacoes = sequelize.define("notificacoes", {
    idlike: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    iduser: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    conteudo: {
        type: Sequelize.STRING,
        allowNull: true
    }   
}, {
    tableName: 'notificacoes',
    timestamps: false
})
module.exports = notificacoes