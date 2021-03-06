const { Sequelize, Model } = require('sequelize');
const { unset, clone, isArray } = require('lodash');
const { database: { dbName, host, port, user, password } } = require('@config');

const sequelize = new Sequelize(dbName, user, password, {
    dialect: 'mysql',
    host,
    port,
    logging: true,
    timezone: '+08:00',
    define: {
        paranoid: true, // 开启软删除,不删除数据库条目,但将新添加的属性deletedAt设置为当前日期(删除完成时)
        underscored: true, // 将自动设置所有属性的字段参数为下划线命名方式
        // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
        // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
        scopes: {
            // 提前定义好 where 条件，然后将这种定义好的条件又可以重新组合
            bh: {
                // 过滤不必要的字段
                attributes: {
                    exclude: ['updatedAt', 'deletedAt', 'createdAt']
                }
            }
        },
        // 数据库自带时间相关字段是否显示
        timestamps: true
    }
});

sequelize.sync(
    {
        // 自动删除原来表，重新创建新的表
        // force: true
    }
);

// 改写的序列化
Model.prototype.toJSON = function() {
    const { host } = require('@config');
    // 此处的 dataValues 不受模型 get 方法的影响，存储的永远都是原始的数据
    const data = clone(this.dataValues);
    unset(data, 'updatedAt');
    unset(data, 'createdAt');
    unset(data, 'deletedAt');
    for (const key in data) {
        if (key === 'image' && !data[key].startsWith('http')) {
            data[key] = host + data[key];
        }
    }
    console.log(this.exclude);
    if (isArray(this.exclude)) {
        this.exclude.forEach(value => {
            unset(data, value);
        });
    }
    return data;
};

module.exports = {
    sequelize
};
