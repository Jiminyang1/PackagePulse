"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var _a = require('worker_threads'), workerData = _a.workerData, parentPort = _a.parentPort;
function getDependencies(packageName, processedPackages, currentPath) {
    if (processedPackages === void 0) { processedPackages = []; }
    var packageJsonPath = '';
    if (currentPath) {
        packageJsonPath = path.resolve(currentPath, 'package.json');
    }
    else {
        var nodeModulesPaths = getNodeModulesPaths();
        for (var _i = 0, nodeModulesPaths_1 = nodeModulesPaths; _i < nodeModulesPaths_1.length; _i++) {
            var nodeModulesPath = nodeModulesPaths_1[_i];
            packageJsonPath = path.resolve(nodeModulesPath, packageName, 'package.json');
            if (fs.existsSync(packageJsonPath)) {
                // 包含解析成功的 package.json 路径，继续处理
                break;
            }
        }
    }
    if (!fs.existsSync(packageJsonPath)) {
        parentPort === null || parentPort === void 0 ? void 0 : parentPort.postMessage("Package JSON not found for ".concat(packageJsonPath));
        return;
    }
    try {
        var packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
        var packageJson = JSON.parse(packageJsonContent);
        var dependencies = extractDependencies(packageJson);
        var result = {
            packageName: packageName,
            dependencies: dependencies,
        };
        //printDependencies(result)
        parentPort === null || parentPort === void 0 ? void 0 : parentPort.postMessage(result);
        for (var _a = 0, dependencies_1 = dependencies; _a < dependencies_1.length; _a++) {
            var dependency = dependencies_1[_a];
            if (!processedPackages.includes(dependency.name)) {
                processedPackages.push(dependency.name);
                var dependencyPath = path.resolve(currentPath || '', 'node_modules', dependency.name);
                getDependencies(dependency.name, processedPackages, dependencyPath);
            }
        }
    }
    catch (error) {
        parentPort === null || parentPort === void 0 ? void 0 : parentPort.postMessage(error);
    }
}
function getNodeModulesPaths() {
    var nodeModulesPaths = [];
    var currentPath = __dirname;
    while (true) {
        var nodeModulesPath = path.resolve(currentPath, 'node_modules');
        if (fs.existsSync(nodeModulesPath)) {
            nodeModulesPaths.push(nodeModulesPath);
        }
        var nextPath = path.resolve(currentPath, '../');
        if (nextPath === currentPath) {
            break;
        }
        currentPath = nextPath;
    }
    return nodeModulesPaths;
}
function printDependencies(result) {
    var packageName = result.packageName, dependencies = result.dependencies;
    console.log("Name: ".concat(packageName));
    console.log("Dependencies:");
    if (dependencies.length > 0) {
        for (var _i = 0, dependencies_2 = dependencies; _i < dependencies_2.length; _i++) {
            var dependency = dependencies_2[_i];
            console.log("\t- Name: ".concat(dependency.name));
            console.log("\t  Version: ".concat(dependency.version));
            console.log("\t  Dependencies: ".concat(dependency.dependencies.join(", ") || "None"));
        }
    }
    else {
        console.log("No dependencies");
    }
    console.log("---");
}
function extractDependencies(packageJson) {
    var dependencies = [];
    if (packageJson.dependencies) {
        for (var _i = 0, _a = Object.entries(packageJson.dependencies); _i < _a.length; _i++) {
            var _b = _a[_i], name_1 = _b[0], version = _b[1];
            dependencies.push({
                name: name_1,
                version: version,
                dependencies: [],
            });
        }
    }
    return dependencies;
}
getDependencies(workerData);
//# sourceMappingURL=worker.js.map