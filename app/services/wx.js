const util = require('util')
const axios = require('axios')
const { User } = require('@models/user')
const { generateToken } = require('@core/util')
const { Auth } = require('@middlewares/auth')
const { wx: { appId, appSecret, loginUrl } } = require('@config')

class WXManager {
    static async codeToToken(code) {
        const url = util.format(loginUrl, appId, appSecret, code)

        const result = await axios.get(url)
        if (result.status !== 200) {
            throw new global.errs.AuthFailed('openid获取失败')
        }
        const { errcode, errmsg } = result.data

        if (errcode !== 0) {
            throw new global.errs.AuthFailed('openid获取失败' + errmsg)
        }
        let user = User.getUserByOpenid(result.data.openid)
        if (!user) {
            user = User.registerByOpenid(openid)
        }
        return generateToken(user.id, Auth.USER)
    }
}

module.exports = {
    WXManager
}