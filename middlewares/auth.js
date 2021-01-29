const BasicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const { security: { secretKey } } = require('@config')
class Auth {
    constructor (level) {
        this.level = level || 1
        Auth.USER = 8
        Auth.ADMIN = 16
        Auth.SUPER_ADMIN = 32
    }

    get m() {
        return async (ctx, next) => {
            // 此处的ctx.req是 node.js 原生的 request 对象
            // 而 ctx.request 是 Koa 对 node.js 原生的 request 对象封装之后的 request
            const userToken = BasicAuth(ctx.req)
            let errMsg = 'token不合法'
            let decode = {}

            if (!userToken || !userToken.name) {
                throw new global.errs.Forbbiden(errMsg)
            }
            try {
                decode = jwt.verify(userToken.name, secretKey)
            } catch (error) {
                // token 不合法或已失效
                if (error.name === 'TokenExpiredError') {
                    errMsg = 'token已过期'
                }
                throw new global.errs.Forbbiden(errMsg)
            }

            if (decode.scope < this.level) {
                errMsg = '权限不足'
                throw new global.errs.Forbbiden(errMsg)
            }

            ctx.state.auth = {
                uid: decode.uid,
                scope: decode.scope
            }
            await next()
        }
    }

    static verifyToken(token) {
        try {
            jwt.verify(token, secretKey)
            return true
        } catch (error) {
            return false
        }
    }
}

module.exports = {
    Auth
}