const { PositiveIntegerValidator, SearchValidator, AddShortCommentValidator } = require('@validator');
const { HotBook } = require('@models/hot-book');
const { Book } = require('@models/book');
const { Favor } = require('@models/favor');
const { Comment } = require('@models/comment');

class BookCtl {
    // 获取热门图书列表
    async getList(ctx) {
        const books = await HotBook.getAll();
        books.exclude = ['updatedAt'];
        ctx.body = {
            data: books
        };
    }
    // 获取热门图书详情
    async getDetail(ctx) {
        const v = await new PositiveIntegerValidator().validate(ctx);
        const book = await new Book().detail(v.get('path.id'));
        ctx.body = {
            data: book
        };
    }
    // 图书搜索
    async search(ctx) {
        const v = await new SearchValidator().validate(ctx);
        const q = v.get('query.q');
        const start = v.get('query.start');
        const count = v.get('query.count');
        const books = await Book.searchFromYuShu(q, start, count);
        ctx.body = books;
    }
    // 获取我点赞的图书
    async favorCount(ctx) {
        const count = await Book.getMyFavorBookCount(ctx.state.auth.uid);
        ctx.body = { count };
    }
    // 获取图书点赞数
    async bookLikeCount(ctx) {
        const v = await new PositiveIntegerValidator().validate(ctx, { id: 'book_id' });
        const favor = await Favor.getBookLikeCount(v.get('path.book_id'), ctx.state.auth.uid);
        ctx.body = favor;
    }
    // 添加短评
    async addBookContent(ctx) {
        const v = await new AddShortCommentValidator().validate(ctx, { id: 'book_id' });
        const comment = await Comment.addContent(v.get('body.book_id'), v.get('body.content'));
        ctx.body = comment;
    }
    // 获取短评
    async getBookContent(ctx) {
        const v = await new PositiveIntegerValidator().validate(ctx, { id: 'book_id' });
        const comment = await Comment.getContent(v.get('path.book_id'));
        ctx.body = comment;
    }
}

module.exports = new BookCtl();
