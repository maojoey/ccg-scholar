import process from 'node:process'
import ansis from 'ansis'
import { initI18n, t } from '../i18n/index.js'
import { readCcgScholarConfig } from '../utils/config.js'
import { uninstallWorkflows } from '../utils/installer.js'
import ora from 'ora'

/**
 * Uninstall CCG-Scholar workflows
 */
export async function runUninstall(): Promise<void> {
  const config = await readCcgScholarConfig()
  await initI18n(config.language)

  const { default: inquirer } = await import('inquirer')

  console.log()
  console.log(ansis.bold.red('  ' + t('uninstall.title')))
  console.log()

  const { confirm } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: t('uninstall.confirm'),
    default: false,
  }])

  if (!confirm) {
    console.log(ansis.yellow('\n  ' + t('uninstall.cancelled') + '\n'))
    process.exit(0)
  }

  const spinner = ora('Uninstalling...').start()

  try {
    const result = await uninstallWorkflows()

    spinner.succeed(t('uninstall.success'))
    console.log()

    if (result.removedCommands.length > 0) {
      console.log(ansis.dim(`  Removed commands: ${result.removedCommands.length}`))
    }
    if (result.removedAgents.length > 0) {
      console.log(ansis.dim(`  Removed agents: ${result.removedAgents.length}`))
    }
    if (result.removedSkills.length > 0) {
      console.log(ansis.dim(`  Removed skills: ${result.removedSkills.length}`))
    }

    if (result.errors.length > 0) {
      console.log()
      for (const err of result.errors) {
        console.log(ansis.yellow(`  - ${err}`))
      }
    }

    console.log()
  }
  catch (e: unknown) {
    spinner.fail('Uninstall failed')
    const msg = e instanceof Error ? e.message : String(e)
    console.error(ansis.red(`\n  ${msg}\n`))
    process.exit(1)
  }
}
