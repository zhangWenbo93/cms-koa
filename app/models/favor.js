const { sequelize } = require('@core/db');
const { Sequelize, Model, DataTypes } = require('sequelize');
const { Art } = require('./art');

class Favor extends Model {
    // 业务表
    static async like(artId, type, uid) {
        // 数据库事务 保持数据一致性
        // ACID 原子性 一致性 隔离性 持久性
        const favor = await Favor.findOne({
            where: {
                artId,
                type,
                uid
            }
        })
        if (favor) {
            throw new global.errs.LikeError()
        }
        sequelize.transaction(async t => {
            await Favor.create({
                artId,
                type,
                uid
            }, { transaction: t })
            const art = await Art.getData(artId, type);
            await art.increment('fav_nums', { by: 1, transaction: t })
        })
    }

    static async dislike(artId, type, uid) {
        const favor = await Favor.findOne({
            where: {
                artId,
                type,
                uid
            }
        })
        console.log(favor);
        if (!favor) {
            throw new global.errs.DisLikeError()
        }
        sequelize.transaction(async t => {
            await favor.destroy({ force: true, transaction: t })
            const art = await Art.getData(artId, type);
            await art.decrement('fav_nums', { by: 1, transaction: t })
        })
    }
}

Favor.init({
    uid: DataTypes.INTEGER,
    artId: DataTypes.INTEGER,
    type: DataTypes.INTEGER
}, {
    sequelize,
    tableName: 'favor'

})

module.exports = { Favor }