const { HttpException } = require("@core/http-exception");

const catchError = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        const isHttpException = error instanceof HttpException
        const isDev = process.env.NODE_ENV !== 'production'
        if (isDev && !isHttpException) {
            throw error
        }
        if (isHttpException) {
            // 特定异常
            ctx.body = {
                msg: error.msg,
                error_code: error.errorCode,
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = error.code;
        } else {
            // 未知异常
            ctx.body = {
                msg: '出现了未知异常😁',
                error_code: 999,
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = 500;
        }
    }
}

module.exports = catchError;