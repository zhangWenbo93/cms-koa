const { RegisterValidator } = require('@validator');
const { User } = require('@models/user')
const { success } = require('@lib/helper')

class UserCtl {
    async register(ctx, next) {
        const v = await new RegisterValidator().validate(ctx);
        const user = {
            nickname: v.get('body.nickname'),
            password: v.get('body.password2'),
            email: v.get('body.email')
        }

        await User.create(user)
        success()
    }
}

module.exports = new UserCtl()