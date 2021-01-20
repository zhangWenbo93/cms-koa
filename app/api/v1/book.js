const Router = require('koa-router');
const { PositiveIntegerValidator } = require('@validator');
const { Auth } = require('@middlewares/auth')

const router = new Router({ 'prefix': '/v1/book' });

router.get('/', (ctx) => {
    ctx.body = { name: '这是book' }
})

router.get('/:id', new Auth(1).m, async (ctx) => {
    // const v = await new PositiveIntegerValidator().validate(ctx);

    ctx.body = ctx.state.auth
})

module.exports = router;