const { ClassicValidator, PositiveIntegerValidator } = require('@validator');
const { success } = require('@lib/helper');
const { Flow } = require('@models/flow');
const { Art } = require('@models/art');
const { Favor } = require('@models/favor');

class ClassicCtl {
    async latest(ctx) {
        const flow = await Flow.findOne({
            order: [['index', 'DESC']]
        });
        const art = await Art.getData(flow.artId, flow.type);
        const likeLatest = await Favor.userLikeIt(flow.artId, flow.type, ctx.state.auth.uid);
        art.setDataValue('index', flow.index);
        art.setDataValue('likeStatus', likeLatest);
        ctx.body = art;
    }

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
        art.setDataValue('likeStatus', likeLatest);
        ctx.body = art;
    }

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
        art.setDataValue('likeStatus', likeLatest);
        ctx.body = art;
    }

    async getFavorDetail(ctx) {
        const v = await new ClassicValidator().validate(ctx);
        const type = parseInt(v.get('path.type'));
        const artId = v.get('path.id');
        const { art, like_status } = await new Art(artId, type).getDetail(ctx.state.auth.uid);
        art.setDataValue('like_status', like_status);
        ctx.body = art;
    }

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

    async getUserLikeClassic(ctx) {
        const uid = ctx.state.auth.uid;
        const list = await Favor.getMyClassicFavors(uid);
        ctx.body = {
            list
        };
    }
}

module.exports = new ClassicCtl();
