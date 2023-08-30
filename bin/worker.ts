import * as path from 'path'
import * as fs from 'fs'
import { REFUSED } from 'dns'
const { workerData, parentPort } = require('worker_threads')

interface Dependency {
  name: string
  version: unknown
  dependencies: Dependency[] // 使用递归结构
}

function get(
  packageName: string,
  depth: number | undefined,
  currentPath?: string,
  processPackages: {
    [key: string]: { name: string; version: unknown; depth: number }
  } = {}
): Dependency[] {
  if (processPackages[packageName]) {
    return []
  } else {
    var packageJsonPath = ''
    currentPath = path.resolve(
      path.dirname(__dirname),
      'node_modules',
      packageName
    )
    if (!fs.existsSync(currentPath)) {
      packageJsonPath = findPackageJson(packageName, path.dirname(__dirname))
      packageJsonPath = path.resolve(packageJsonPath, 'package.json')
    }

    if (packageJsonPath && !packageJsonPath.endsWith('package.json')) {
      packageJsonPath = path.join(packageJsonPath, 'package.json')
    }
    // 检查修改后的路径是否存在
    if (!fs.existsSync(packageJsonPath)) {
      packageJsonPath = path.resolve(currentPath, 'package.json')
      if (path.dirname(packageJsonPath).endsWith('package.json')) {
        packageJsonPath = path.dirname(packageJsonPath)
      }
    }

    let packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8')
    let packageJson = JSON.parse(packageJsonContent)

    const currentPackageName = packageJson.name
    const currentPackageVersion = packageJson.version
    const dependencies = packageJson['dependencies']
    if (!dependencies) {
      return []
    }
    const resultList: Dependency[] = []

    const currentDependency: Dependency = {
      name: currentPackageName,
      version: currentPackageVersion,
      dependencies: []
    }
    if (!depth) {
      depth = Infinity
    }
    if (depth <= 0) {
      return resultList
    }

    processPackages[packageName] = {
      name: currentPackageName,
      version: currentPackageVersion,
      depth: depth
    }

    if (dependencies) {
      try {
        for (const packagename in dependencies) {
          if (!processPackages[packagename]) {
            packageJsonPath = path.resolve(
              path.dirname(__dirname),
              'node_modules',
              packagename
            )
            if (!fs.existsSync(packageJsonPath)) {
              packageJsonPath = findPackageJson(
                packageName,
                path.dirname(__dirname)
              )
              // 如果找到了包的路径，则检查路径是否已包含 'package.json'，若没有则追加
              if (
                packageJsonPath &&
                !packageJsonPath.endsWith('package.json')
              ) {
                packageJsonPath = path.join(packageJsonPath, 'package.json')
              }

              // 检查修改后的路径是否存在
              if (!fs.existsSync(packageJsonPath)) {
                packageJsonPath = path.dirname(packageJsonPath)
              }
              packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8')
              packageJson = JSON.parse(packageJsonContent)
            }
            const childDepth = depth - 1
            const childDependencies = get(
              packageJsonPath,
              childDepth,
              packageJson,
              processPackages // 传递更新后的 processPackages 数组
            )
            currentDependency.dependencies.push(...childDependencies)

            const childpackageJson = JSON.parse(packageJsonContent)
            const dependencyVersion = childpackageJson.version
            processPackages[packagename] = {
              name: packagename,
              version: dependencyVersion,
              depth: childDepth
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    resultList.push(currentDependency)
    parentPort.postMessage(resultList)
    return resultList
  }
}

function findPackageJson(
  packageName: string,
  directory: string
): string | undefined {
  const parentDirectory = path.resolve(directory)
  const nodeModulesPath = path.resolve(
    parentDirectory,
    'node_modules',
    packageName
  )
  if (fs.existsSync(nodeModulesPath)) {
    return nodeModulesPath
  } else {
    const parentDirectory = path.dirname(directory)
    if (parentDirectory === directory) {
      // 已经到达根目录仍未找到包
      console.log(packageName)
      return undefined
    }
    return findPackageJson(packageName, parentDirectory)
  }
}

const rootPackageJsonPath = path.resolve(
  path.dirname(__dirname),
  'package.json'
)

const processPackages: {
  [key: string]: { name: string; version: string; depth: number }
} = {}
get(String(workerData), undefined, rootPackageJsonPath, processPackages)
