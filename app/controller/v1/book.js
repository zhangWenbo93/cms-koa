const { PositiveIntegerValidator, SearchValidator, AddShortCommentValidator } = require('@validator');
const { HotBook } = require('@models/hot-book');
const { Book } = require('@models/book');
const { Favor } = require('@models/favor');
const { Comment } = require('@models/comment');

class BookCtl {
    async getList(ctx) {
        const books = await HotBook.getAll();
        ctx.body = {
            books
        };
    }
    async getDetail(ctx) {
        const v = await new PositiveIntegerValidator().validate(ctx);
        const book = await new Book(v.get('path.id')).detail();
        ctx.body = {
            book
        };
    }
    async search(ctx) {
        const v = await new SearchValidator().validate(ctx);
        const q = v.get('query.q');
        const start = v.get('query.start');
        const count = v.get('query.count');
        const books = await Book.searchFromYuShu(q, start, count);
        ctx.body = books;
    }
    async favorCount(ctx) {
        const count = await Book.getMyFavorBookCount(ctx.state.auth.uid);
        ctx.body = { count };
    }
    async bookLikeCount(ctx) {
        const v = await new PositiveIntegerValidator().validate(ctx, { id: 'book_id' });
        const favor = await Favor.getBookLikeCount(v.get('path.book_id'), ctx.state.auth.uid);
        ctx.body = favor;
    }
    async addBookContent(ctx) {
        const v = await new AddShortCommentValidator().validate(ctx, { id: 'book_id' });
        const comment = await Comment.addContent(v.get('body.book_id'), v.get('body.content'));
        ctx.body = comment;
    }
    async getBookContent(ctx) {
        const v = await new PositiveIntegerValidator().validate(ctx, { id: 'book_id' });
        const comment = await Comment.getContent(v.get('path.book_id'));
        ctx.body = comment;
    }
}

module.exports = new BookCtl();
