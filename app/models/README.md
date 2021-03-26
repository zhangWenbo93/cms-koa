#### 控制字段返回的方式

1. sequelize中的scopes方法
2. 通过控制返回模型的JSON序列化的方法：toJSON()
3. toJSON() 不能传递参数

上面两个都有缺陷，需要逐个引入定义，我们需要一种类似于全局错误监听的方式去控制字段的返回

```js
    // exclude 是需要过滤的字段集合
    if(isArray(exclude)){
        exclude.forEach(value => {
            unset(data,value);
        })
    }
```

通过强行给基类Model添加toJSON()控制，注意不推荐在各个模型的构造函数 constructor 中 定义 exclude，例如
如果在使用 sequelize 的时候，在模型中定义了 constructor 且使用当前模型去查询数据，会导致查询数据字段全部不存在（模型中定义的默认值除外，会返回定义的默认值），疑似 sequelize 的 bug。Model中禁止使用构造函数

```js
class Art {
    constructor() {
        super()
        this.exclude = ['updateAt','deletedAt']
    }
}

class Comment extends Model {
    constructor() {
        super();
    }
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

查询书籍短评数据，在定义 constructor 的情况下，得到的结果如下
[{"nums":0,"id":null},{"nums":0,"id":null},{"nums":0,"id":null}]
```

也不推荐直接挂载在各个模型的原型链上去，这样会把代码写死，会导致后续任何跟模型 Art 相关的实类序列化都不会有 updateAt,deletedAt 这两个字段

```js
Art.prototype.exclude = ['updateAt','deletedAt']
```

推荐在最终的 api 里去定义需要过滤的字段

```js
const art = await new Art(artId, type).getDetail(ctx.state.auth.uid);
art.exclude = ['updateAt','deletedAt']
```