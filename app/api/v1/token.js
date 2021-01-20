const Router = require('koa-router');
const { creatToken } = require('@controller/v1/token')
const router = new Router({ 'prefix': '/v1/token' });

router.post('/', creatToken)

module.exports = router;