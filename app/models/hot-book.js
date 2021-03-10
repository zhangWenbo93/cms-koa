const { Sequelize, Model, DataTypes, Op } = require('sequelize');
const { sequelize } = require('@core/db');
const { Favor } = require('./favor');

class HotBook extends Model {
    static async getAll() {
        const books = await HotBook.findAll({
            order: ['index']
        });
        const ids = [];
        books.forEach(book => {
            ids.push(book.id);
        });

        // group
        const favors = await Favor.findAll({
            where: {
                art_id: {
                    [Op.in]: ids
                }
            },
            group: ['art_id'], // group 表示用 art_id 对集合进行分组 [{art_id1: count}, {art_id2: count}, ...]
            attributes: ['art_id', [Sequelize.fn('COUNT', '*'), 'count']] // attributes 代表过滤之后的字段 fn对COUNT进行求和
        });
        books.forEach(book => {
            HotBook._getBookStatus(book, favors);
        });
        return books;
    }

    static _getBookStatus(book, favors) {
        let count = 0;
        favors.forEach(favor => {
            // *** 注意 取值要通过 Sequelize 的 get 方法取值 不可以直接 favor.art_id,否则无法取到对应的值
            //  赋值要通过 Sequelize 的 setDataValue，否则无法赋值
            // 这里的 favor 以及 book 不是常规的数据对象，而是经过 Sequelize 包装后的对象
            if (book.id === favor.get('art_id')) {
                count = favor.get('count');
            }
        });
        book.setDataValue('count', count);
        return book;
    }
}

HotBook.init(
    {
        index: DataTypes.INTEGER,
        image: DataTypes.STRING,
        author: DataTypes.STRING,
        title: DataTypes.STRING
    },
    {
        sequelize,
        tableName: 'hot_book'
    }
);

module.exports = { HotBook };
