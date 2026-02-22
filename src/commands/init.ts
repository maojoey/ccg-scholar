import process from 'node:process'
import ansis from 'ansis'
import ora from 'ora'
import { initI18n, t } from '../i18n/index.js'
import { readCcgScholarConfig, createDefaultRouting } from '../utils/config.js'
import { WORKFLOW_CONFIGS, installWorkflows } from '../utils/installer.js'
import { AUXILIARY_MCPS, configMcp } from '../utils/mcp.js'
import type { ModelRouting } from '../types/index.js'

/**
 * Run the interactive init flow
 */
export async function runInit(): Promise<void> {
  const config = await readCcgScholarConfig()
  await initI18n(config.language)

  // Dynamic import for inquirer (ESM)
  const { default: inquirer } = await import('inquirer')

  // Welcome banner
  console.log()
  console.log(ansis.bold.cyan('  CCG-Scholar'))
  console.log(ansis.dim('  Claude-Codex-Gemini 多模型协作科研工作流系统'))
  console.log()
  console.log(ansis.dim('  ' + t('init.description')))
  console.log()

  // 1. Select language
  const { language } = await inquirer.prompt([{
    type: 'list',
    name: 'language',
    message: '选择语言 / Select language:',
    choices: [
      { name: '中文', value: 'zh-CN' },
      { name: 'English', value: 'en' },
    ],
    default: 'zh-CN',
  }])

  await initI18n(language)

  // 2. Select collaboration mode
  const { mode } = await inquirer.prompt([{
    type: 'list',
    name: 'mode',
    message: t('routing.mode') + ':',
    choices: [
      { name: t('routing.mode.smart'), value: 'smart' },
      { name: t('routing.mode.parallel'), value: 'parallel' },
      { name: t('routing.mode.sequential'), value: 'sequential' },
    ],
    default: 'smart',
  }])

  const routing: ModelRouting = {
    ...createDefaultRouting(),
    mode,
  }

  // 3. Select workflows
  const { selectedWorkflows } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'selectedWorkflows',
    message: t('init.selectWorkflows'),
    choices: WORKFLOW_CONFIGS.map(w => ({
      name: `${language === 'zh-CN' ? w.name : w.nameEn} — ${language === 'zh-CN' ? w.description : w.descriptionEn}`,
      value: w.id,
      checked: w.defaultSelected,
    })),
  }])

  if (selectedWorkflows.length === 0) {
    console.log(ansis.yellow('\n  未选择任何工作流 / No workflows selected\n'))
    process.exit(0)
  }

  // 4. MCP server configuration
  const { configureMcp } = await inquirer.prompt([{
    type: 'confirm',
    name: 'configureMcp',
    message: t('mcp.title') + '?',
    default: true,
  }])

  let mcpOptions: { codeRetrieval?: boolean, auxiliary?: string[], zotero?: boolean } = {}

  if (configureMcp) {
    const mcpChoices = [
      { name: t('mcp.codeRetrieval'), value: 'codeRetrieval' },
      { name: t('mcp.zotero'), value: 'zotero' },
      ...AUXILIARY_MCPS
        .filter(m => m.name !== 'zotero')
        .map(m => ({
          name: `${m.displayName} — ${language === 'zh-CN' ? m.description : m.descriptionEn}`,
          value: m.name,
        })),
    ]

    const { mcpSelections } = await inquirer.prompt([{
      type: 'checkbox',
      name: 'mcpSelections',
      message: t('mcp.title') + ':',
      choices: mcpChoices,
    }])

    mcpOptions = {
      codeRetrieval: mcpSelections.includes('codeRetrieval'),
      zotero: mcpSelections.includes('zotero'),
      auxiliary: mcpSelections.filter((s: string) => !['codeRetrieval', 'zotero'].includes(s)),
    }
  }

  // 5. Confirm
  const { confirm } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: t('init.confirmInstall'),
    default: true,
  }])

  if (!confirm) {
    console.log(ansis.yellow('\n  ' + t('uninstall.cancelled') + '\n'))
    process.exit(0)
  }

  // 6. Install
  const spinner = ora(t('init.installing')).start()

  try {
    // Install workflows
    const result = await installWorkflows(selectedWorkflows, routing)

    // Configure MCP if selected
    if (configureMcp && (mcpOptions.codeRetrieval || mcpOptions.zotero || (mcpOptions.auxiliary && mcpOptions.auxiliary.length > 0))) {
      await configMcp({
        codeRetrieval: mcpOptions.codeRetrieval,
        zotero: mcpOptions.zotero,
        auxiliary: mcpOptions.auxiliary,
        backup: true,
      })
    }

    // Update config with language
    const updatedConfig = await readCcgScholarConfig()
    updatedConfig.language = language
    const { writeCcgScholarConfig } = await import('../utils/config.js')
    await writeCcgScholarConfig(updatedConfig)

    spinner.succeed(t('init.installSuccess'))
    console.log()

    // Summary
    console.log(ansis.green('  ' + t('common.done') + ':'))
    if (result.installedCommands.length > 0) {
      console.log(ansis.dim(`    Commands: ${result.installedCommands.length}`))
    }
    if (result.installedPrompts.length > 0) {
      console.log(ansis.dim(`    Prompts: ${result.installedPrompts.length}`))
    }
    if (result.installedSkills.length > 0) {
      console.log(ansis.dim(`    Skills: ${result.installedSkills.length}`))
    }
    if (result.installedRules.length > 0) {
      console.log(ansis.dim(`    Rules: ${result.installedRules.length}`))
    }
    if (result.installedHooks.length > 0) {
      console.log(ansis.dim(`    Hooks: ${result.installedHooks.length}`))
    }

    if (result.errors.length > 0) {
      console.log()
      console.log(ansis.yellow('  Warnings:'))
      for (const err of result.errors) {
        console.log(ansis.dim(`    - ${err}`))
      }
    }

    console.log()
    console.log(ansis.cyan('  Usage: Open Claude Code and try /ccg-scholar:literature-review'))
    console.log()
  }
  catch (e: unknown) {
    spinner.fail(t('init.installFailed'))
    const msg = e instanceof Error ? e.message : String(e)
    console.error(ansis.red(`\n  ${msg}\n`))
    process.exit(1)
  }
}
