import ansis from 'ansis'
import { initI18n, t } from '../i18n/index.js'
import { readCcgScholarConfig } from '../utils/config.js'
import { diagnoseMcpConfig } from '../utils/mcp.js'
import { isInstalled, getInstalledWorkflows } from '../utils/installer.js'

/**
 * Diagnose CCG-Scholar configuration
 */
export async function runDiagnose(): Promise<void> {
  const config = await readCcgScholarConfig()
  await initI18n(config.language)

  console.log()
  console.log(ansis.bold.cyan('  CCG-Scholar Diagnostics'))
  console.log()

  // Check installation
  const installed = await isInstalled()
  console.log(`  Installation: ${installed ? ansis.green('OK') : ansis.red('Not installed')}`)

  if (installed) {
    const workflows = await getInstalledWorkflows()
    console.log(ansis.dim(`  Installed workflows: ${workflows.join(', ') || 'none'}`))
    console.log(ansis.dim(`  Language: ${config.language}`))
    console.log(ansis.dim(`  Mode: ${config.routing.mode}`))
  }

  // Check MCP
  console.log()
  console.log(ansis.bold('  MCP Configuration:'))

  const mcpResult = await diagnoseMcpConfig()

  if (!mcpResult.configExists) {
    console.log(ansis.yellow('  Config file not found'))
  }
  else if (mcpResult.servers.length === 0) {
    console.log(ansis.dim('  No MCP servers configured'))
  }
  else {
    for (const server of mcpResult.servers) {
      const status = server.commandExists ? ansis.green('OK') : ansis.red('MISSING')
      console.log(`  ${status} ${server.name} (${server.command})`)
    }
  }

  if (mcpResult.issues.length > 0) {
    console.log()
    console.log(ansis.yellow('  ' + t('mcp.diagnoseIssues')))
    for (const issue of mcpResult.issues) {
      console.log(ansis.dim(`    - ${issue}`))
    }
  }

  console.log()
}
