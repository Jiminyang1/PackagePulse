#! /usr/bin/env node

import { Service } from './service' //引入入口文件
import { startServer } from './http'
require('ts-node/register')
const service = new Service()

const rawArgv = process.argv.slice(2)

const args = require('minimist')(rawArgv) //解析命令行参数

const command = args._[0]
//执行初始化
service.run(command, rawArgv)
startServer()
