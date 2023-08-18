import * as path from "path";
import * as fs from "fs";
const { workerData, parentPort } = require('worker_threads');

interface Dependency {
    name: string;
    version: unknown;
    dependencies: string[]; // 仅保存依赖项名称，而不是完整的依赖项对象
}


function getDependencies(packageName: any, processedPackages: string[] = [], currentPath?: string) {
    var packageJsonPath = ''

    if (currentPath) {
        packageJsonPath = path.resolve(currentPath, 'package.json')
    } else {
        const nodeModulesPaths = getNodeModulesPaths();
        for (const nodeModulesPath of nodeModulesPaths) {
            packageJsonPath = path.resolve(nodeModulesPath, packageName, 'package.json');

            if (fs.existsSync(packageJsonPath)) {
                // 包含解析成功的 package.json 路径，继续处理
                break;
            }
        }

    }

    if (!fs.existsSync(packageJsonPath)) {
        parentPort?.postMessage(`Package JSON not found for ${packageJsonPath}`)
        return
    }

    try {
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8')
        const packageJson = JSON.parse(packageJsonContent)

        const dependencies: Dependency[] = extractDependencies(packageJson)
        const result = {
            packageName,
            dependencies,
        }

        //printDependencies(result)
        parentPort?.postMessage(result)

        for (const dependency of dependencies) {
            if (!processedPackages.includes(dependency.name)) {
                processedPackages.push(dependency.name)
                const dependencyPath = path.resolve(currentPath || '', 'node_modules', dependency.name)
                getDependencies(dependency.name, processedPackages, dependencyPath)
            }
        }
    } catch (error) {
        parentPort?.postMessage(error)
    }
}


function getNodeModulesPaths(): string[] {
    const nodeModulesPaths: string[] = [];

    let currentPath = __dirname;
    while (true) {
        const nodeModulesPath = path.resolve(currentPath, 'node_modules');
        if (fs.existsSync(nodeModulesPath)) {
            nodeModulesPaths.push(nodeModulesPath);
        }

        const nextPath = path.resolve(currentPath, '../');
        if (nextPath === currentPath) {
            break;
        }
        currentPath = nextPath;
    }
    return nodeModulesPaths;
}

function printDependencies(result: { packageName: string; dependencies: Dependency[] }) {
    const { packageName, dependencies } = result;

    console.log(`Name: ${packageName}`);
    console.log(`Dependencies:`);

    if (dependencies.length > 0) {
        for (const dependency of dependencies) {
            console.log(`\t- Name: ${dependency.name}`);
            console.log(`\t  Version: ${dependency.version}`);
            console.log(`\t  Dependencies: ${dependency.dependencies.join(", ") || "None"}`);
        }
    } else {
        console.log("No dependencies");
    }


    console.log("---");
}

function extractDependencies(packageJson: any): Dependency[] {
    const dependencies: Dependency[] = [];

    if (packageJson.dependencies) {
        for (const [name, version] of Object.entries(packageJson.dependencies)) {
            dependencies.push({
                name,
                version,
                dependencies: [],
            });
        }
    }

    return dependencies;
}

getDependencies(workerData);
