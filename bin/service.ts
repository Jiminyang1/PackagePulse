import { program } from 'commander'
import { analyze } from './analyze'

export class Service {
  constructor() {
    setupDefalutCommands() //设置默认命令
  }
  run(_args = {}, rawArgv: string[] = []) {
    program.parse(rawArgv, { from: 'user' })
  }
}

//设置默认命令
const setupDefalutCommands = () => {
  program
    .command('analyze')
    .description('npm package依赖分析')
    .option('-d, --depth=<depth>', '设置递归的层数')
    .option('-j, --json=<jsonpath>', '输出到文件中')
    .alias('a')
    .action(async () => {
      await analyze()
    })
}
