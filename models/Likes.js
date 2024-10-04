const { Sequelize, sequelize } = require("./Bd");


const likes = sequelize.define("curtida", {
    idlike: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idpost: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    iduser: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    tableName: 'curtida',
    timestamps: false
})
module.exports = likes