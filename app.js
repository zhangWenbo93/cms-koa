require('module-alias/register');
const path = require('path');
const Koa = require('koa');
const koaBody = require('koa-body');
const InitManager = require('./core/init');
const catchError = require('./middlewares/exception');
const KoaStatic = require('koa-static');

const app = new Koa();

const host = process.env.HOST || '127.0.0.1';
const port = process.env.HOST || 3002;

app.use(catchError);
app.use(koaBody());
app.use(KoaStatic(path.join(__dirname, 'static')));
InitManager.initCore(app);

app.listen(port, host, () => {
    console.log('项目已启动在3002');
});
