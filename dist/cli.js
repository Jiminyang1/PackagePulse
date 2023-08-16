#! /usr/bin/env node
'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
require('ts-node/register')
const service_1 = require('./service') //引入入口文件
const http_1 = require('./http')
const service = new service_1.Service()
const rawArgv = process.argv.slice(2)
const args = require('minimist')(rawArgv) //解析命令行参数
const command = args._[0]
//执行初始化
service.run(command, rawArgv)
;(0, http_1.startServer)()
//# sourceMappingURL=cli.js.map
