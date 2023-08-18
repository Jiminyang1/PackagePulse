"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
var http_1 = require("../bin/http");
var child_process_1 = require("child_process");
//启动React应用程序
function startReactApp() {
    var reactCommand = 'npm start';
    (0, child_process_1.exec)(reactCommand, function (error, stdout, stderr) {
        if (error) {
            console.error("\u542F\u52A8react\u5E94\u7528\u5931\u8D25\uFF1A".concat(error.message));
        }
        else {
            console.log('react应用启动成功');
        }
    });
}
function startServer() {
    // 创建服务器
    var server = (0, http_1.createServer)(function (req, res) {
        // 处理请求并发送响应
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
    });
    // 启动服务器监听指定的端口
    var port = 3030; // 可以根据需要修改端口号
    server.listen(port, function () {
        console.log("Server is running on port ".concat(port));
    });
    setTimeout(function () {
        server.close(function () {
            console.log('server closed');
            process.exit();
        });
    }, 10000);
    startReactApp();
}
exports.startServer = startServer;
startServer();
//# sourceMappingURL=http.js.map
