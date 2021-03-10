const { Sequelize, Model, DataTypes, Op } = require('sequelize');
const { sequelize } = require('@core/db');

class Comment extends Model {
    static async addContent(bookId, content) {
        const comment = await Comment.findOne({
            where: {
                bookId,
                content
            }
        });
        if (!comment) {
            return await Comment.create({
                bookId,
                content,
                nums: 1
            });
        } else {
            await comment.increment('nums', { by: 1 });
            return await Comment.findOne({
                where: {
                    bookId,
                    content
                }
            });
        }
    }

    static async getContent(bookId) {
        const comment = await Comment.findAll({
            where: {
                bookId
            }
        });
        return comment;
    }
}

Comment.init(
    {
        bookId: DataTypes.INTEGER,
        content: DataTypes.STRING(12),
        nums: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    },
    {
        sequelize,
        tableName: 'comment'
    }
);

module.exports = { Comment };
