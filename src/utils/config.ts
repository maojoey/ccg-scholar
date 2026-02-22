import { homedir } from 'node:os'
import { join } from 'pathe'
import fs from 'fs-extra'
import { parse, stringify } from 'smol-toml'
import type { CcgScholarConfig, ModelRouting, ModelSettings } from '../types/index.js'

/**
 * CCG-Scholar configuration directory
 */
export const CCG_SCHOLAR_DIR = join(homedir(), '.claude', '.ccg-scholar')

/**
 * CCG-Scholar configuration file path
 */
export const CONFIG_FILE = join(CCG_SCHOLAR_DIR, 'config.toml')

/**
 * Ensure the CCG-Scholar configuration directory exists
 */
export async function ensureCcgScholarDir(): Promise<void> {
  await fs.ensureDir(CCG_SCHOLAR_DIR)
}

/**
 * Create default research-oriented model routing configuration
 */
export function createDefaultRouting(): ModelRouting {
  return {
    literatureSearch: { models: ['gemini'], primary: 'gemini' },
    deepAnalysis: { models: ['claude'], primary: 'claude' },
    experimentCode: { models: ['codex'], primary: 'codex' },
    dataVisualization: { models: ['gemini'], primary: 'gemini' },
    paperWriting: { models: ['claude'], primary: 'claude' },
    crossReview: { models: ['codex', 'gemini'], strategy: 'parallel' },
    mode: 'smart',
  }
}

/**
 * Create default model settings
 */
export function createDefaultModels(): ModelSettings {
  return {
    geminiModel: 'gemini-2.5-flash',
    codexModel: '',
  }
}

/**
 * Create default CCG-Scholar configuration
 */
export function createDefaultConfig(): CcgScholarConfig {
  return {
    version: '1.0.0',
    routing: createDefaultRouting(),
    models: createDefaultModels(),
    installedWorkflows: [],
    mcpServers: [],
    language: 'zh-CN',
  }
}

/**
 * Read CCG-Scholar configuration from disk
 * Returns default config if file does not exist
 */
export async function readCcgScholarConfig(): Promise<CcgScholarConfig> {
  try {
    if (await fs.pathExists(CONFIG_FILE)) {
      const content = await fs.readFile(CONFIG_FILE, 'utf-8')
      const parsed = parse(content) as unknown as CcgScholarConfig
      return {
        ...createDefaultConfig(),
        ...parsed,
        routing: {
          ...createDefaultRouting(),
          ...(parsed.routing || {}),
        },
        models: {
          ...createDefaultModels(),
          ...(parsed.models || {}),
        },
      }
    }
  }
  catch {
    // Fall through to default config
  }
  return createDefaultConfig()
}

/**
 * Write CCG-Scholar configuration to disk
 */
export async function writeCcgScholarConfig(config: CcgScholarConfig): Promise<void> {
  await ensureCcgScholarDir()
  const content = stringify(config as unknown as Record<string, unknown>)
  await fs.writeFile(CONFIG_FILE, content, 'utf-8')
}
