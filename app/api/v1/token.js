const Router = require('koa-router');
const { creatToken, verify } = require('@controller/v1/token')
const router = new Router({ 'prefix': '/v1/token' });

router.post('/', creatToken)
router.post('/verify', verify)

module.exports = router;