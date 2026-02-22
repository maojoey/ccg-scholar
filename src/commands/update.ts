import ansis from 'ansis'
import { version } from '../version.js'

/**
 * Check for package updates
 */
export async function checkUpdate(): Promise<void> {
  console.log()
  console.log(ansis.bold.cyan('  CCG-Scholar Update Check'))
  console.log()
  console.log(ansis.dim(`  Current version: ${version}`))

  try {
    const response = await fetch('https://registry.npmjs.org/ccg-scholar/latest')

    if (!response.ok) {
      console.log(ansis.dim('  Unable to check for updates (package not yet published)'))
      console.log()
      return
    }

    const data = await response.json() as { version: string }
    const latest = data.version

    if (latest === version) {
      console.log(ansis.green('  Already up to date!'))
    }
    else {
      console.log(ansis.yellow(`  New version available: ${latest}`))
      console.log(ansis.dim('  Run: npm install -g ccg-scholar'))
    }
  }
  catch {
    console.log(ansis.dim('  Unable to check for updates'))
  }

  console.log()
}
