const Router = require('koa-router');
const requireDirectory = require('require-directory');

class InitManager {
    static initCore(app) {
        InitManager.app = app;
        InitManager.initLoadRouters();
        InitManager.initLoadError();
    }

    static initLoadRouters() {
        requireDirectory(module, `${process.cwd()}/app/api`, {
            visit: whenLoadModule
        })

        function whenLoadModule(route) {
            if (route instanceof Router) {
                InitManager.app.use(route.routes()).use(route.allowedMethods());
            }
        }
    }

    static initLoadError() {
        const errors = require('./http-exception')
        global.errs = errors
    }
}

module.exports = InitManager;
