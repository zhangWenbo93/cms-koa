const Router = require('koa-router');
const {
    getList,
    getDetail,
    search,
    favorCount,
    bookLikeCount,
    addBookContent,
    getBookContent
} = require('@controller/v1/book');
const { Auth } = require('@middlewares/auth');
const router = new Router({ prefix: '/v1/book' });

router.get('/hot_list', new Auth().m, getList);
router.get('/:id/detail', new Auth().m, getDetail);
router.get('/search', new Auth().m, search);
router.get('/favor_count', new Auth().m, favorCount);
router.get('/:book_id/favor', new Auth().m, bookLikeCount);
router.post('/add/short_comment', new Auth().m, addBookContent);
router.get('/:book_id/short_comment', new Auth().m, getBookContent);

module.exports = router;
