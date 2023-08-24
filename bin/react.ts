import { exec } from 'child_process'

interface Dependency {
  name: string
  version: string
  // 其他属性...
}


//启动React应用程序
export function startReactApp() {
  const reactCommand = 'npm start'
  exec(reactCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`启动react应用失败：${error.message}`)
    } else {
      console.log('react应用启动成功')
    }
  })
}