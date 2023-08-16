'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        var desc = Object.getOwnPropertyDescriptor(m, k)
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k]
            }
          }
        }
        Object.defineProperty(o, k2, desc)
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.startServer = void 0
const http = __importStar(require('http'))
const child_process_1 = require('child_process')
//启动React应用程序
function startReactApp() {
  const reactCommand = 'npm start'
  ;(0, child_process_1.exec)(reactCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`启动react应用失败：${error.message}`)
    } else {
      console.log('react应用启动成功')
    }
  })
}
function startServer() {
  // 创建服务器
  const server = http.createServer((req, res) => {
    // 处理请求并发送响应
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    // //根据请求路径进行判断
    // if (req.url === '/dependencies') {
    //   const dependenciesResult: Dependency[] = []
    //
    //   res.statusCode = 200
    //   res.end(JSON.stringify(dependenciesResult))
    // } else {
    //   res.statusCode = 404
    //   res.end('Not Found')
    // }
  })
  const httpProcess = (0, child_process_1.spawn)('node', ['http.js'])
  // 启动服务器监听指定的端口
  const port = 3000 // 可以根据需要修改端口号
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    startReactApp()
    ;(0, child_process_1.exec)(`start http://localhost:${port}`)
    process.on('beforeExit', () => {
      httpProcess.kill()
    })
  })
}
exports.startServer = startServer
//# sourceMappingURL=http.js.map
