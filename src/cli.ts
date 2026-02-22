import process from 'node:process'
import { cac } from 'cac'
import { version } from './version.js'

const cli = cac('ccg-scholar')

cli
  .command('', '启动交互式菜单 / Launch interactive menu')
  .action(async () => {
    const { showMenu } = await import('./commands/menu.js')
    await showMenu()
  })

cli
  .command('init', '初始化 CCG-Scholar 科研工作流 / Initialize research workflows')
  .action(async () => {
    const { runInit } = await import('./commands/init.js')
    await runInit()
  })

cli
  .command('update', '检查更新 / Check for updates')
  .action(async () => {
    const { checkUpdate } = await import('./commands/update.js')
    await checkUpdate()
  })

cli
  .command('uninstall', '卸载 CCG-Scholar / Uninstall CCG-Scholar')
  .action(async () => {
    const { runUninstall } = await import('./commands/uninstall.js')
    await runUninstall()
  })

cli
  .command('mcp', '配置 MCP 服务器 / Configure MCP servers')
  .action(async () => {
    const { runMcpConfig } = await import('./commands/mcp-config.js')
    await runMcpConfig()
  })

cli
  .command('diagnose', '诊断配置 / Diagnose configuration')
  .action(async () => {
    const { runDiagnose } = await import('./commands/diagnose.js')
    await runDiagnose()
  })

cli.help()
cli.version(version)

cli.parse(process.argv, { run: true })
