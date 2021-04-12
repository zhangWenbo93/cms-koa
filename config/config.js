module.exports = {
    database: {
        dbName: 'island',
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123456',
        dialectOptions: {
            socketPath: '/tmp/mysql.sock' // 指定套接字文件路径
        }
    },
    security: {
        secretKey: 'islandae-o6@kxd&qi1o6_*1^lzi+0=3fwj4^*u5#0sc!zk+wb',
        expiresIn: 60 * 60 * 24 * 30
    },
    wx: {
        appId: '',
        appSecret: '',
        loginUrl:
            'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
    },
    yushu: {
        detailUrl: 'http://t.talelin.com/v2/book/id/%s',
        keywordUrl: 'http://t.talelin.com/v2/book/search?q=%s&start=%s&count=%s&summary=%s'
    },
    host: 'https://island.youbego.top/'
}
