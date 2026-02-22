import process from 'node:process'
import ansis from 'ansis'
import { initI18n, t } from '../i18n/index.js'
import { readCcgScholarConfig } from '../utils/config.js'

/**
 * Show the interactive menu
 */
export async function showMenu(): Promise<void> {
  const config = await readCcgScholarConfig()
  await initI18n(config.language)

  const { default: inquirer } = await import('inquirer')

  console.log()
  console.log(ansis.bold.cyan('  CCG-Scholar'))
  console.log(ansis.dim('  多模型协作科研工作流系统'))
  console.log()

  const { action } = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: '请选择操作:',
    choices: [
      { name: `📚 ${t('menu.research')}`, value: 'init' },
      { name: `⚙️  ${t('menu.config')}`, value: 'config' },
      { name: `🔌 ${t('menu.mcp')}`, value: 'mcp' },
      { name: `🔍 诊断 / Diagnose`, value: 'diagnose' },
      { name: `🗑️  ${t('menu.uninstall')}`, value: 'uninstall' },
      { name: `❌ ${t('common.cancel')}`, value: 'exit' },
    ],
  }])

  switch (action) {
    case 'init': {
      const { runInit } = await import('./init.js')
      await runInit()
      break
    }
    case 'config': {
      const { runInit } = await import('./init.js')
      await runInit()
      break
    }
    case 'mcp': {
      const { runMcpConfig } = await import('./mcp-config.js')
      await runMcpConfig()
      break
    }
    case 'diagnose': {
      const { runDiagnose } = await import('./diagnose.js')
      await runDiagnose()
      break
    }
    case 'uninstall': {
      const { runUninstall } = await import('./uninstall.js')
      await runUninstall()
      break
    }
    case 'exit':
    default:
      process.exit(0)
  }
}
