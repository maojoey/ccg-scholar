import { homedir, platform } from 'node:os'
import process from 'node:process'
import { join } from 'pathe'
import fs from 'fs-extra'
import type { AuxiliaryMcp, ClaudeCodeConfig, McpServerConfig } from '../types/index.js'

// ---------------------------------------------------------------------------
// Platform helpers
// ---------------------------------------------------------------------------

/**
 * Whether the current platform is Windows
 */
export const isWindows = platform() === 'win32'

/**
 * Get the correct command for MCP servers depending on platform.
 * On Windows, `npx` must be invoked via `cmd /c npx`.
 */
export function getMcpCommand(command: string): { command: string, args: string[] } {
  if (isWindows && command === 'npx') {
    return { command: 'cmd', args: ['/c', 'npx'] }
  }
  return { command, args: [] }
}

/**
 * Apply platform-specific transformations to an MCP server config
 */
export function applyPlatformCommand(config: McpServerConfig): McpServerConfig {
  if (!isWindows)
    return config

  if (config.command === 'npx') {
    return {
      ...config,
      command: 'cmd',
      args: ['/c', 'npx', ...config.args],
    }
  }

  return config
}

/**
 * Fix Windows-specific MCP config issues in an existing config
 */
export function fixWindowsMcpConfig(config: ClaudeCodeConfig): ClaudeCodeConfig {
  if (!isWindows || !config.mcpServers)
    return config

  const fixed = { ...config }
  fixed.mcpServers = { ...config.mcpServers }

  for (const [name, server] of Object.entries(fixed.mcpServers)) {
    fixed.mcpServers[name] = applyPlatformCommand(server)
  }

  return fixed
}

// ---------------------------------------------------------------------------
// Claude Code config path
// ---------------------------------------------------------------------------

/**
 * Get the path to the Claude Code MCP settings file
 */
export function getClaudeCodeConfigPath(): string {
  const claudeDir = join(homedir(), '.claude')
  return join(claudeDir, 'settings.json')
}

/**
 * Read the Claude Code configuration file
 */
export async function readClaudeCodeConfig(): Promise<ClaudeCodeConfig> {
  const configPath = getClaudeCodeConfigPath()
  try {
    if (await fs.pathExists(configPath)) {
      const content = await fs.readFile(configPath, 'utf-8')
      return JSON.parse(content) as ClaudeCodeConfig
    }
  }
  catch {
    // Return empty config on parse error
  }
  return {}
}

/**
 * Write the Claude Code configuration file
 */
export async function writeClaudeCodeConfig(config: ClaudeCodeConfig): Promise<void> {
  const configPath = getClaudeCodeConfigPath()
  await fs.ensureDir(join(homedir(), '.claude'))
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8')
}

// ---------------------------------------------------------------------------
// Backup
// ---------------------------------------------------------------------------

/**
 * Create a timestamped backup of the Claude Code config
 */
export async function backupClaudeCodeConfig(): Promise<string | null> {
  const configPath = getClaudeCodeConfigPath()
  if (!(await fs.pathExists(configPath)))
    return null

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = `${configPath}.backup-${timestamp}`
  await fs.copy(configPath, backupPath)
  return backupPath
}

// ---------------------------------------------------------------------------
// MCP server config builders
// ---------------------------------------------------------------------------

/**
 * Build an MCP server config object
 */
export function buildMcpServerConfig(
  command: string,
  args: string[],
  env?: Record<string, string>,
): McpServerConfig {
  const config: McpServerConfig = applyPlatformCommand({ command, args })
  if (env && Object.keys(env).length > 0) {
    config.env = env
  }
  return config
}

/**
 * Merge MCP servers into an existing Claude Code config
 */
export function mergeMcpServers(
  config: ClaudeCodeConfig,
  servers: Record<string, McpServerConfig>,
): ClaudeCodeConfig {
  return {
    ...config,
    mcpServers: {
      ...(config.mcpServers || {}),
      ...servers,
    },
  }
}

// ---------------------------------------------------------------------------
// Diagnostics
// ---------------------------------------------------------------------------

export interface McpDiagnosticResult {
  configExists: boolean
  configPath: string
  servers: {
    name: string
    command: string
    args: string[]
    commandExists: boolean
  }[]
  issues: string[]
}

/**
 * Diagnose MCP configuration issues
 */
export async function diagnoseMcpConfig(): Promise<McpDiagnosticResult> {
  const configPath = getClaudeCodeConfigPath()
  const result: McpDiagnosticResult = {
    configExists: false,
    configPath,
    servers: [],
    issues: [],
  }

  if (!(await fs.pathExists(configPath))) {
    result.issues.push('Claude Code 配置文件不存在 / Claude Code config file not found')
    return result
  }

  result.configExists = true
  const config = await readClaudeCodeConfig()

  if (!config.mcpServers || Object.keys(config.mcpServers).length === 0) {
    result.issues.push('没有配置 MCP 服务器 / No MCP servers configured')
    return result
  }

  for (const [name, server] of Object.entries(config.mcpServers)) {
    const serverInfo = {
      name,
      command: server.command,
      args: server.args || [],
      commandExists: true,
    }

    // Basic check: if command is npx/node it is generally available
    if (!['npx', 'node', 'cmd'].includes(server.command)) {
      try {
        await fs.access(server.command, fs.constants.X_OK)
      }
      catch {
        serverInfo.commandExists = false
        result.issues.push(`服务器 "${name}" 的命令不可执行: ${server.command}`)
      }
    }

    result.servers.push(serverInfo)
  }

  return result
}

// ---------------------------------------------------------------------------
// Auxiliary MCP definitions
// ---------------------------------------------------------------------------

/**
 * List of auxiliary MCP servers supported by CCG-Scholar
 */
export const AUXILIARY_MCPS: AuxiliaryMcp[] = [
  {
    name: 'context7',
    displayName: 'Context7',
    description: '实时文档检索 MCP — 获取最新库/框架文档',
    descriptionEn: 'Real-time documentation retrieval MCP',
    command: 'npx',
    args: ['-y', '@upstash/context7-mcp@latest'],
  },
  {
    name: 'playwright',
    displayName: 'Playwright',
    description: '浏览器自动化 MCP — 网页操作与数据采集',
    descriptionEn: 'Browser automation MCP — web interaction and data collection',
    command: 'npx',
    args: ['-y', '@anthropic/playwright-mcp@latest'],
  },
  {
    name: 'deepwiki',
    displayName: 'DeepWiki',
    description: '深度维基 MCP — 代码仓库知识检索',
    descriptionEn: 'DeepWiki MCP — repository knowledge retrieval',
    command: 'npx',
    args: ['-y', '@anthropic/deepwiki-mcp@latest'],
  },
  {
    name: 'exa',
    displayName: 'Exa',
    description: '智能搜索 MCP — AI 驱动的语义搜索引擎',
    descriptionEn: 'Exa MCP — AI-powered semantic search engine',
    command: 'npx',
    args: ['-y', 'exa-mcp-server@latest'],
    env: { EXA_API_KEY: '' },
    envRequired: ['EXA_API_KEY'],
  },
  {
    name: 'zotero',
    displayName: 'Zotero',
    description: '文献管理 MCP — Zotero 引文与文献库集成',
    descriptionEn: 'Zotero MCP — citation manager and library integration',
    command: 'npx',
    args: ['-y', 'zotero-mcp@latest'],
  },
]

// ---------------------------------------------------------------------------
// Install / Uninstall individual MCP servers
// ---------------------------------------------------------------------------

/**
 * Install an MCP server into Claude Code config
 */
export async function installMcpServer(
  name: string,
  serverConfig: McpServerConfig,
): Promise<void> {
  const config = await readClaudeCodeConfig()
  const updated = mergeMcpServers(config, { [name]: serverConfig })
  await writeClaudeCodeConfig(updated)
}

/**
 * Uninstall an MCP server from Claude Code config
 */
export async function uninstallMcpServer(name: string): Promise<boolean> {
  const config = await readClaudeCodeConfig()
  if (!config.mcpServers || !(name in config.mcpServers))
    return false

  const { [name]: _, ...rest } = config.mcpServers
  config.mcpServers = rest
  await writeClaudeCodeConfig(config)
  return true
}

// ---------------------------------------------------------------------------
// Named install/uninstall helpers
// ---------------------------------------------------------------------------

/**
 * Install AceTool MCP server (code retrieval)
 */
export async function installAceTool(): Promise<void> {
  const config = buildMcpServerConfig('npx', ['-y', 'ace-tool-mcp@latest'])
  await installMcpServer('ace-tool', config)
}

/**
 * Uninstall AceTool MCP server
 */
export async function uninstallAceTool(): Promise<boolean> {
  return uninstallMcpServer('ace-tool')
}

/**
 * Install ContextWeaver MCP server
 */
export async function installContextWeaver(): Promise<void> {
  const config = buildMcpServerConfig('npx', ['-y', 'context-weaver-mcp@latest'])
  await installMcpServer('context-weaver', config)
}

/**
 * Uninstall ContextWeaver MCP server
 */
export async function uninstallContextWeaver(): Promise<boolean> {
  return uninstallMcpServer('context-weaver')
}

/**
 * Install Zotero MCP server — citation manager integration
 */
export async function installZoteroMcp(): Promise<void> {
  const config = buildMcpServerConfig('npx', ['-y', 'zotero-mcp@latest'])
  await installMcpServer('zotero', config)
}

/**
 * Uninstall Zotero MCP server
 */
export async function uninstallZoteroMcp(): Promise<boolean> {
  return uninstallMcpServer('zotero')
}

// ---------------------------------------------------------------------------
// High-level handlers (for CLI commands)
// ---------------------------------------------------------------------------

/**
 * Handle code retrieval MCP installation (AceTool + ContextWeaver)
 */
export async function handleCodeRetrieval(action: 'install' | 'uninstall'): Promise<void> {
  if (action === 'install') {
    await installAceTool()
    await installContextWeaver()
  }
  else {
    await uninstallAceTool()
    await uninstallContextWeaver()
  }
}

/**
 * Handle auxiliary MCP installation by name
 */
export async function handleAuxiliary(
  names: string[],
  envValues?: Record<string, Record<string, string>>,
): Promise<void> {
  for (const name of names) {
    const mcp = AUXILIARY_MCPS.find(m => m.name === name)
    if (!mcp) {
      throw new Error(`Unknown auxiliary MCP: ${name}`)
    }

    const env = {
      ...(mcp.env || {}),
      ...(envValues?.[name] || {}),
    }

    const config = buildMcpServerConfig(mcp.command, mcp.args, env)
    await installMcpServer(mcp.name, config)
  }
}

/**
 * Handle MCP uninstall by name
 */
export async function handleUninstall(names: string[]): Promise<string[]> {
  const removed: string[] = []
  for (const name of names) {
    const success = await uninstallMcpServer(name)
    if (success)
      removed.push(name)
  }
  return removed
}

// ---------------------------------------------------------------------------
// Full MCP configuration flow
// ---------------------------------------------------------------------------

export interface ConfigMcpOptions {
  codeRetrieval?: boolean
  auxiliary?: string[]
  zotero?: boolean
  envValues?: Record<string, Record<string, string>>
  backup?: boolean
}

/**
 * Configure MCP servers for CCG-Scholar
 * Orchestrates backup, code retrieval, Zotero, and auxiliary MCP installation.
 */
export async function configMcp(options: ConfigMcpOptions): Promise<{
  backupPath: string | null
  installed: string[]
}> {
  let backupPath: string | null = null
  const installed: string[] = []

  // Backup existing config
  if (options.backup !== false) {
    backupPath = await backupClaudeCodeConfig()
  }

  // Code retrieval tools
  if (options.codeRetrieval) {
    await handleCodeRetrieval('install')
    installed.push('ace-tool', 'context-weaver')
  }

  // Zotero citation manager
  if (options.zotero) {
    await installZoteroMcp()
    installed.push('zotero')
  }

  // Auxiliary MCPs
  if (options.auxiliary && options.auxiliary.length > 0) {
    await handleAuxiliary(options.auxiliary, options.envValues)
    installed.push(...options.auxiliary)
  }

  return { backupPath, installed }
}
