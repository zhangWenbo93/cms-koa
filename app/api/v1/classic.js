const Router = require('koa-router');
const { latest } = require('@controller/v1/classic')
const { Auth } = require('@middlewares/auth')
const router = new Router({ 'prefix': '/v1/classic' });

router.get('/latest', new Auth().m, latest)

module.exports = router;