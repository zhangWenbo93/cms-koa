const { Sequelize, Model, DataTypes } = require('sequelize');
const { sequelize } = require('@core/db');

class Flow extends Model {}

Flow.init(
    {
        index: DataTypes.INTEGER,
        artId: DataTypes.INTEGER,
        type: DataTypes.INTEGER
    },
    {
        sequelize,
        tableName: 'flow'
    }
);

module.exports = { Flow };
