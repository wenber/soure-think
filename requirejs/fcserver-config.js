// 路由映射到处理器
exports.path2Handler = [
    { 
        path: /.+\.less($|\?)/,
        handler: 'less'
    },
    {
        path: /.+\.ajax($|\?)/,
        handler: 'mock'
    },
    {
        path: /._es6\.js?($|\?)/,
        handler: 'es6to5'
    }
];

// 默认是服务启动目录下的mock文件夹，这里也支持自定义的mock目录
exports.mockPath = './mock';

// 默认端口
exports.defaultPort = 8080;

// 是否启动socket调试,当启用socket时，只能使用默认的8080端口
exports.initSocket = true;
