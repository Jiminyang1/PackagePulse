import { program } from 'commander'
// @ts-ignore
import { analyze } from "./analyze"

module.exports = class Service {
    constructor() {
        setupDefalutCommands();//设置默认命令
    }
    run(_args = {} , rawArgv = []) {
        program.parse(rawArgv,{ from :'user'});
    }
}

//设置默认命令
const setupDefalutCommands = () => {
    program
        .command('analyze')
        .description('npm package依赖分析')
        .alias('a')
        .action(async () => {
            await analyze();
    });

}
