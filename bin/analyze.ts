const fs = require('fs');
const path = require('path');
const { isMainThread, parentPort, workerData , Worker : MyWorker} = require('worker_threads');
require('ts-node/register');

//定义一个线程池类
class ThreadPool {
    numThreads : number;
    workers : any;
    taskQueue : any;
    constructor(numThreads :number ) {
        this.numThreads = numThreads;
        this.workers = [];
        this.taskQueue = [];
    }

    initialize() {
        console.log("111")
        for (let i = 0; i < this.numThreads; i++) {
            const worker = new MyWorker('./worker.ts');
            this.workers.push(worker);

            worker.on('message',(message : string) => {

                console.log(`Thread ${worker.threadId}: ${message}`);
            });
        }
        console.log(this.workers);

    }
}

async function analyze(){
    try {
        //获取当前执行脚本的路径
        const scriptPath = process.argv[1];

        //计算package.json的路径
        const packageJsonPath = path.resolve(scriptPath,'package.json');

        //读取package.json文件
        const packageData = fs.readFileSync(packageJsonPath, 'utf-8');
        const packageObj = JSON.parse(packageData);

        //读取依赖
        const dependencies = Object.keys(packageObj.dependencies);//生产依赖
        const devdependencies = Object.keys(packageObj.devDependencies);//开发依赖
        const currentPackageName = packageObj.name;//主包名
        const currentPackageVersion = packageObj.version;//主包版本

        //获取依赖个数
        const dependenciesCount = dependencies.length;
        const devdependenciesCount = devdependencies.length;

        return dependenciesCount;
    } catch (error) {
        console.log(error);
        return 0;
    }

}

if (isMainThread) {
    (async () => {
        const numThreads = await analyze();
        console.log("numThreads: ", numThreads);
        const threadPool = new ThreadPool(numThreads);
        threadPool.initialize();
    })();
}

