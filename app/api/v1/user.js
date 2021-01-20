const Router = require('koa-router');
const { register } = require('@controller/v1/user')
const router = new Router({ 'prefix': '/v1/user' });

router.post('/register', register)

module.exports = router;