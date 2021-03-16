const { TokenValidator, NotEmptyValidator } = require('@validator');
const { success } = require('@lib/helper');
const { LoginType } = require('@lib/enum');
const { User } = require('@models/user');
const { Auth } = require('@middlewares/auth');
const { WXManager } = require('@services/wx');
const { generateToken } = require('@core/util');

class TokenCtl {
    // 获取token
    async creatToken(ctx) {
        const v = await new TokenValidator().validate(ctx);
        const type = v.get('body.type');
        const account = v.get('body.account'); // 登录账户
        const secret = v.get('body.secret'); // 密码
        let token;
        switch (type) {
            case LoginType.USER_EMAIL:
                token = await TokenCtl.emailLogin(account, secret);
                break;
            case LoginType.USER_MINI_PROGRAM:
                token = await WXManager.codeToToken(account);
                break;
            default:
                throw new global.errs.ParameterException('没有相应的处理函数');
        }
        ctx.body = {
            token
        };
    }
    // 验证token
    async verify(ctx) {
        const v = await new NotEmptyValidator().validate(ctx);
        const result = Auth.verifyToken(v.get('body.token'));
        ctx.body = {
            is_valid: result
        };
    }

    static async emailLogin(email, secret) {
        const user = await User.verifyEmailPassword(email, secret);
        return generateToken(user.id, Auth.USER);
    }
}

module.exports = new TokenCtl();
