const Router = require('koa-router');
const { latest, getFavNums, getUserLikeClassic, getFavorDetail, getNext, getPrev } = require('@controller/v1/classic');
const { Auth } = require('@middlewares/auth');
const router = new Router({ prefix: '/v1/classic' });

router.get('/latest', new Auth().m, latest);
router.get('/:type/:id/detail', new Auth().m, getFavorDetail);
router.get('/:index/next', new Auth().m, getNext);
router.get('/:index/previous', new Auth().m, getPrev);
router.get('/:type/:id/favor', new Auth().m, getFavNums);
router.get('/favor', new Auth().m, getUserLikeClassic);

module.exports = router;
