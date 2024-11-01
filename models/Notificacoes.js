const { Sequelize, sequelize } = require("./Bd");


const notificacoes = sequelize.define("notificacoes", {
    idnoti: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    iduser: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idfollower: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idpost: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idseguir: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idcomment: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    conteudo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tipo: {
        type: Sequelize.STRING,
        allowNull: false
    }      
}, {
    tableName: 'notificacoes',
    timestamps: false
})
module.exports = notificacoes