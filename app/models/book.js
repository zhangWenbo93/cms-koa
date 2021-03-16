const { Sequelize, Model, DataTypes, Op } = require('sequelize');
const util = require('util');
const axios = require('axios');
const { sequelize } = require('@core/db');
const { Favor } = require('./favor');
const { yushu: { detailUrl, keywordUrl } } = require('@config');

class Book extends Model {
    async detail(id) {
        const url = util.format(detailUrl, id);
        const detail = await axios.get(url);
        return detail.data;
    }
    // summary = 1 返回的是书籍概要信息
    static async searchFromYuShu(q, start, count, summary = 1) {
        const url = util.format(keywordUrl, encodeURI(q), start, count, summary);
        const result = await axios.get(url);
        return result.data;
    }

    static async getMyFavorBookCount(uid) {
        const count = await Favor.count({
            where: {
                type: 400,
                uid
            }
        });
        return count;
    }
}

Book.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true // 主键字段
        },
        fav_nums: {
            type: DataTypes.INTEGER,
            defaultValue: 0 // 设置默认值
        }
    },
    {
        sequelize,
        tableName: 'book'
    }
);

module.exports = { Book };
