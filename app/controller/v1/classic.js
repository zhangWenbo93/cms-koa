const { ClassicValidator, PositiveIntegerValidator } = require('@validator');
const { success } = require('@lib/helper');
const { Flow } = require('@models/flow');
const { Art } = require('@models/art');
const { Favor } = require('@models/favor');

class ClassicCtl {
    // 获取最近一期期刊
    async latest(ctx) {
        const flow = await Flow.findOne({
            order: [['index', 'DESC']]
        });
        const art = await Art.getData(flow.artId, flow.type);
        const likeLatest = await Favor.userLikeIt(flow.artId, flow.type, ctx.state.auth.uid);
        art.setDataValue('index', flow.index);
        art.setDataValue('like_status', likeLatest);
        ctx.body = art;
    }
    // 获取下一期个期刊
    async getNext(ctx) {
        const v = await new PositiveIntegerValidator().validate(ctx, { id: 'index' });
        const index = v.get('path.index');
        const flow = await Flow.findOne({
            where: {
                index: index + 1
            }
        });
        if (!flow) {
            throw new global.errs.NotFound();
        }
        const art = await Art.getData(flow.artId, flow.type);
        const likeLatest = await Favor.userLikeIt(flow.artId, flow.type, ctx.state.auth.uid);
        art.setDataValue('index', flow.index);
        art.setDataValue('like_status', likeLatest);
        ctx.body = art;
    }
    // 获取上一个期刊
    async getPrev(ctx) {
        const v = await new PositiveIntegerValidator().validate(ctx, { id: 'index' });
        const index = v.get('path.index');
        const flow = await Flow.findOne({
            where: {
                index: index - 1
            }
        });
        if (!flow) {
            throw new global.errs.NotFound();
        }
        const art = await Art.getData(flow.artId, flow.type);
        const likeLatest = await Favor.userLikeIt(flow.artId, flow.type, ctx.state.auth.uid);
        art.setDataValue('index', flow.index);
        art.setDataValue('like_status', likeLatest);
        ctx.body = art;
    }
    // 获取期刊详情
    async getFavorDetail(ctx) {
        const v = await new ClassicValidator().validate(ctx);
        const type = parseInt(v.get('path.type'));
        const artId = v.get('path.id');
        const { art, like_status } = await new Art(artId, type).getDetail(ctx.state.auth.uid);
        art.setDataValue('like_status', like_status);
        ctx.body = art;
    }
    // 获取期刊点赞数
    async getFavNums(ctx) {
        const v = await new ClassicValidator().validate(ctx);
        const type = parseInt(v.get('path.type'));
        const artId = v.get('path.id');
        const { art, like_status } = await new Art(artId, type).getDetail(ctx.state.auth.uid);
        ctx.body = {
            fav_nums: art.fav_nums,
            like_status
        };
    }
    // 获取用户喜欢（点赞）的期刊
    async getUserLikeClassic(ctx) {
        const uid = ctx.state.auth.uid;
        const list = await Favor.getMyClassicFavors(uid);

        ctx.body = {
            list
        };
    }
}

module.exports = new ClassicCtl();
