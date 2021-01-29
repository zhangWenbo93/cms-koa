const Router = require('koa-router');
const { like, disLike } = require('@controller/v1/like')
const { Auth } = require('@middlewares/auth')
const router = new Router({ 'prefix': '/v1' });

router.post('/like', new Auth().m, like)
router.post('/disLike', new Auth().m, disLike)

module.exports = router;