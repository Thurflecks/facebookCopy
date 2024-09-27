const { Sequelize, sequelize } = require("./Bd");


const user = sequelize.define("user", {
    iduser: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    bio: {
        type: Sequelize.STRING,
        allowNull: true
    },
    data_nascimento: {
        type: Sequelize.DATE,
        allowNull: false
    },
    foto_perfil: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    tableName: 'user',
    timestamps: false
})
module.exports = user