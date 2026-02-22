import ansis from 'ansis'
import { initI18n, t } from '../i18n/index.js'
import { readCcgScholarConfig } from '../utils/config.js'
import { AUXILIARY_MCPS, configMcp } from '../utils/mcp.js'
import ora from 'ora'

/**
 * Interactive MCP server configuration
 */
export async function runMcpConfig(): Promise<void> {
  const config = await readCcgScholarConfig()
  await initI18n(config.language)

  const { default: inquirer } = await import('inquirer')

  console.log()
  console.log(ansis.bold.cyan('  ' + t('mcp.title')))
  console.log()

  const mcpChoices = [
    { name: t('mcp.codeRetrieval'), value: 'codeRetrieval' },
    { name: t('mcp.zotero'), value: 'zotero' },
    ...AUXILIARY_MCPS
      .filter(m => m.name !== 'zotero')
      .map(m => ({
        name: `${m.displayName} — ${config.language === 'zh-CN' ? m.description : m.descriptionEn}`,
        value: m.name,
      })),
  ]

  const { selections } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'selections',
    message: t('mcp.title') + ':',
    choices: mcpChoices,
  }])

  if (selections.length === 0) {
    console.log(ansis.yellow('\n  No MCP servers selected\n'))
    return
  }

  const spinner = ora('Configuring MCP servers...').start()

  try {
    const result = await configMcp({
      codeRetrieval: selections.includes('codeRetrieval'),
      zotero: selections.includes('zotero'),
      auxiliary: selections.filter((s: string) => !['codeRetrieval', 'zotero'].includes(s)),
      backup: true,
    })

    spinner.succeed(t('mcp.installSuccess'))

    if (result.backupPath) {
      console.log(ansis.dim(`  ${t('mcp.backup', { path: result.backupPath })}`))
    }

    console.log(ansis.dim(`  Installed: ${result.installed.join(', ')}`))
    console.log()
  }
  catch (e: unknown) {
    spinner.fail(t('mcp.installFailed'))
    const msg = e instanceof Error ? e.message : String(e)
    console.error(ansis.red(`\n  ${msg}\n`))
  }
}
