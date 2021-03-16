const { Op } = require('sequelize');
const { flatten } = require('lodash');
const { Movie, Music, Sentence } = require('@models/classic');
class Art {
    constructor(art_id, type) {
        this.art_id = art_id;
        this.type = type;
    }

    async getDetail(uid) {
        const { Favor } = require('@models/favor'); // 放在里面调用，因为 Favor 里面调用了Art，相互调用有影响，会造成循环导入
        const art = await Art.getData(this.art_id, this.type);
        if (!art) {
            throw new global.errs.NotFound();
        }

        const like = await Favor.userLikeIt(this.art_id, this.type, uid);
        return {
            art,
            like_status: like
        };
    }

    static async getList(artInfoList) {
        const artInfoObj = {
            100: [],
            200: [],
            300: []
        };
        for (const artInfo of artInfoList) {
            artInfoObj[artInfo.type].push(artInfo.artId);
        }
        const arts = [];
        for (const key in artInfoObj) {
            if (artInfoObj[key].length > 0) {
                arts.push(await Art._getListByType(artInfoObj[key], parseInt(key)));
            }
        }
        // 二维数组展开
        return flatten(arts);
    }

    static async _getListByType(ids, type) {
        let arts = null;
        const finder = {
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        };

        const scope = 'bh';
        switch (type) {
            case 100:
                arts = await Movie.scope(scope).findAll(finder);
                break;
            case 200:
                arts = await Music.scope(scope).findAll(finder);
                break;
            case 300:
                arts = await Sentence.scope(scope).findAll(finder);
                break;
            case 400:
                break;
            default:
                break;
        }
        return arts;
    }

    static async getData(artId, type, useScope = true) {
        let art = null;
        const finder = {
            where: {
                id: artId
            }
        };

        const scope = useScope ? 'bh' : null;
        switch (type) {
            case 100:
                art = await Movie.scope(scope).findOne(finder);
                break;
            case 200:
                art = await Music.scope(scope).findOne(finder);
                break;
            case 300:
                art = await Sentence.scope(scope).findOne(finder);
                break;
            case 400:
                // 书籍的表和其他三种类型的存在差异，书籍表是一个扩展表，书籍数据是通过三方服务接口请求而来，因此需要特殊处理，在处理书籍点赞时，若不存在该书籍，则需要通过id新增到扩展表
                const { Book } = require('./book');
                art = await Book.scope(scope).findOne(finder);
                if (!art) {
                    art = await Book.create({
                        id: artId
                    });
                }
                break;
            default:
                break;
        }

        return art;
    }
}

module.exports = { Art };
