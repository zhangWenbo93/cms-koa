const Sequelize = require('sequelize');
const { database: { dbName, host, port, user, password } } = require('@config');

const sequelize = new Sequelize(dbName, user, password, {
    dialect: 'mysql',
    host,
    port,
    logging: true,
    timezone: '+08:00',
    define: {
        paranoid: true, // 不删除数据库条目,但将新添加的属性deletedAt设置为当前日期(删除完成时)
        underscored: true, // 将自动设置所有属性的字段参数为下划线命名方式
        scopes: {
            bh: {
                attributes: {
                    exclude: ['updatedAt', 'deletedAt', 'createdAt']
                }
            }
        },
        // 数据库自带时间相关字段是否显示
        timestamps: true
    }
});

sequelize.sync({
    // 自动删除原来表，重新创建新的表
    // force: true
});

module.exports = {
    sequelize
};