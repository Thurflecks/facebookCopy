const { Sequelize, sequelize } = require("./Bd");


const post = sequelize.define("post", {
    idpost: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    iduser: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    legenda: {
        type: Sequelize.STRING,
        allowNull: true
    },
    imagem: {
        type: Sequelize.BLOB,
        allowNull: false
    },
    data_criacao: {
        type: Sequelize.DATE,
        allowNull: false
    },
    likes: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
}, {
    tableName: 'post',
    timestamps: false
})
module.exports = post