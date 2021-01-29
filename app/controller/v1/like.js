const { LikeValidator } = require('@validator');
const { success } = require('@lib/helper');
const { Favor } = require('@models/favor');

class Like {
    async like(ctx) {
        const v = await new LikeValidator().validate(ctx)
        await Favor.like(v.get('body.id'), v.get('body.type'), ctx.state.auth.uid)
        success()
    }
    async disLike(ctx) {
        const v = await new LikeValidator().validate(ctx)
        await Favor.dislike(v.get('body.id'), v.get('body.type'), ctx.state.auth.uid)
        success()
    }
}

module.exports = new Like()