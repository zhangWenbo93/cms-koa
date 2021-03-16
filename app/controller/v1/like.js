const { LikeValidator } = require('@validator');
const { success } = require('@lib/helper');
const { Favor } = require('@models/favor');
class LikeCtl {
    // 点赞
    async like(ctx) {
        const v = await new LikeValidator().validate(ctx, { id: 'art_id' });
        await Favor.like(v.get('body.art_id'), v.get('body.type'), ctx.state.auth.uid);
        success();
    }
    // 取消点赞
    async disLike(ctx) {
        const v = await new LikeValidator().validate(ctx, { id: 'art_id' });
        await Favor.dislike(v.get('body.art_id'), v.get('body.type'), ctx.state.auth.uid);
        success();
    }
}

module.exports = new LikeCtl();
