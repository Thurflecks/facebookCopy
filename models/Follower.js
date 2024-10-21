const { Sequelize, sequelize } = require("./Bd");


const follower = sequelize.define("follower", {
    idfollower: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    iduser: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    idseguidor: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
}, {
    tableName: 'follower',
    timestamps: false
})
module.exports = follower