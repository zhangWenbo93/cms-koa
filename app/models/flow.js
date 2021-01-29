const { sequelize } = require('@core/db');
const { Sequelize, Model, DataTypes } = require('sequelize');

class Flow extends Model {

}

Flow.init({
    index: DataTypes.INTEGER,
    artId: DataTypes.INTEGER,
    type: DataTypes.INTEGER
}, {
    sequelize,
    tableName: 'flow'
})

module.exports = { Flow };