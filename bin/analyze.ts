import * as fs from 'fs'
import * as path from 'path'
import {isMainThread, Worker as MyWorker} from 'worker_threads'

require('ts-node/register')

interface Dependencies {
  dependend : string[]
  devdependend : string[]
  numDependend : number
}
interface DependencyResult {
  dependency: string;
  result: string;
}
//定义一个线程池类
class ThreadPool {
  res: Dependencies[] | number
  workers: any[]
  taskQueue: any[]

  constructor(res: Dependencies[] | number) {
    this.res = res
    this.workers = []
    this.taskQueue = []
  }

  addWorkerAndDependency(worker: MyWorker, depedency: string) {
    this.workers.push(worker)
    this.taskQueue.push(depedency)
  }

  initialize() {
    for (let i=0;i<this.workers.length;i++){
      const worker = this.workers[i]
      const  dependency = this.taskQueue[i]
      const dependPromise = new Promise<DependencyResult>((resolve,reject) =>{
        worker.on('message',(result:DependencyResult) =>{
          resolve(result)
        })
        worker.on('error',reject)
        worker.postMessage(dependency)
      })

      dependPromise.then((result:DependencyResult) => {
        console.log(result)
      })
    }
  }
}

export async function analyze() :Promise<Dependencies[]> {
  try {
    //计算package.json的路径
    const packageJsonPath = path.resolve(
      path.dirname(__dirname),
      'package.json'
    )

    //读取package.json文件
    const packageData = fs.readFileSync(packageJsonPath, 'utf-8')
    const packageObj = JSON.parse(packageData)

    //读取依赖
    let dependencies = Object.keys(packageObj.dependencies) //生产依赖
    const devdependencies = packageObj && packageObj.devDependencies  ? Object.keys(packageObj.devDependencies) : [] //开发依赖
    //获取依赖个数
    const devdependenciesCount = devdependencies.length
    const dependenciesCount = dependencies.length

    //const currentPackageName = packageObj.name //主包名
    //const currentPackageVersion = packageObj.version //主包版本

    return [
      {
        dependend: dependencies,
        devdependend: devdependencies,
        numDependend: dependenciesCount + devdependenciesCount
      }
    ]
  } catch (error) {
    console.log(error)
    return [];
  }
}

if (isMainThread) {
  (async () => {
    let res = await analyze()
    const threadPool = new ThreadPool(res)
    for (const dependencyObj of res[0].dependend){
      const worker = new MyWorker(path.resolve(path.dirname(__dirname),'./dist/worker.js'),{ workerData : dependencyObj })
      threadPool.addWorkerAndDependency(worker,`${dependencyObj}`);
    }
    threadPool.initialize()
  })()
}
