const { Sequelize, Model, DataTypes, Op } = require('sequelize');
const { sequelize } = require('@core/db');
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
        });
        if (favor) {
            throw new global.errs.LikeError();
        }
        // Favor 表 favor 表中的记录
        return sequelize.transaction(async t => {
            await Favor.create(
                {
                    artId,
                    type,
                    uid
                },
                { transaction: t }
            );
            const art = await Art.getData(artId, type);
            await art.increment('fav_nums', { by: 1, transaction: t });
        });
    }

    static async dislike(artId, type, uid) {
        const favor = await Favor.findOne({
            where: {
                artId,
                type,
                uid
            }
        });
        if (!favor) {
            throw new global.errs.DisLikeError();
        }
        return sequelize.transaction(async t => {
            // force 表示是否物理删除
            await favor.destroy({ force: true, transaction: t });
            const art = await Art.getData(artId, type);
            await art.decrement('fav_nums', { by: 1, transaction: t });
        });
    }

    static async userLikeIt(artId, type, uid) {
        const favor = await Favor.findOne({
            where: {
                artId,
                type,
                uid
            }
        });

        return favor ? true : false;
    }

    static async getMyClassicFavors(uid) {
        const arts = await Favor.findAll({
            where: {
                uid,
                type: {
                    // 表示 type 不等于 400， 过滤掉400书刊
                    [Op.not]: 400
                }
            }
        });
        if (!arts) {
            throw new global.errs.NotFound();
        }
        return await Art.getList(arts);
    }

    static async getBookLikeCount(art_id, uid) {
        const likesNums = await Favor.count({
            where: {
                type: 400,
                art_id
            }
        });
        const likeStatus = await Favor.findOne({
            where: {
                type: 400,
                art_id,
                uid
            }
        });
        return { fav_nums: likesNums, like_status: likeStatus ? 1 : 0 };
    }
}

Favor.init(
    {
        uid: DataTypes.INTEGER,
        artId: DataTypes.INTEGER,
        type: DataTypes.INTEGER
    },
    {
        sequelize,
        tableName: 'favor'
    }
);

module.exports = { Favor };
