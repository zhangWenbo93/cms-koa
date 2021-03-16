const Router = require('koa-router');
const { like, disLike } = require('@controller/v1/like');
const { Auth } = require('@middlewares/auth');
const router = new Router({ prefix: '/v1/like' });

router.post('/', new Auth().m, like);
router.post('/cancel', new Auth().m, disLike);

module.exports = router;
