const { Sequelize, sequelize } = require("./Bd");


const comments = sequelize.define("comments", {
    idcomments: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idpost: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    iduser: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    comment: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    tableName: 'comments',
    timestamps: false
})
module.exports = comments