const { LikeValidator } = require('@validator');
const { success } = require('@lib/helper');
const { Favor } = require('@models/favor');
class LikeCtl {
    async like(ctx) {
        const v = await new LikeValidator().validate(ctx, { id: 'art_id' });
        await Favor.like(v.get('body.art_id'), v.get('body.type'), ctx.state.auth.uid);
        success();
    }
    async disLike(ctx) {
        const v = await new LikeValidator().validate(ctx, { id: 'art_id' });
        await Favor.dislike(v.get('body.art_id'), v.get('body.type'), ctx.state.auth.uid);
        success();
    }
}

module.exports = new LikeCtl();
