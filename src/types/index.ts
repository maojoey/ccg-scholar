export type ModelType = 'claude' | 'codex' | 'gemini'
export type CollaborationMode = 'parallel' | 'smart' | 'sequential'

export interface ModelRouting {
  literatureSearch: { models: ModelType[], primary: ModelType }
  deepAnalysis: { models: ModelType[], primary: ModelType }
  experimentCode: { models: ModelType[], primary: ModelType }
  dataVisualization: { models: ModelType[], primary: ModelType }
  paperWriting: { models: ModelType[], primary: ModelType }
  crossReview: { models: ModelType[], strategy: 'parallel' }
  mode: CollaborationMode
}

export interface WorkflowConfig {
  id: string
  name: string
  nameEn: string
  category: 'research' | 'paper' | 'experiment' | 'rebuttal' | 'utility' | 'team'
  commands: string[]
  defaultSelected: boolean
  order: number
  description: string
  descriptionEn: string
}

export interface InstallResult {
  success: boolean
  installedCommands: string[]
  installedPrompts: string[]
  installedSkills: string[]
  installedRules: string[]
  installedHooks: string[]
  errors: string[]
  configPath: string
  binPath?: string
  binInstalled?: boolean
}

export interface UninstallResult {
  success: boolean
  removedCommands: string[]
  removedPrompts: string[]
  removedAgents: string[]
  removedSkills: string[]
  removedBin: boolean
  errors: string[]
}

export interface McpServerConfig {
  command: string
  args: string[]
  env?: Record<string, string>
}

export interface ClaudeCodeConfig {
  mcpServers?: Record<string, McpServerConfig>
  [key: string]: unknown
}

export interface ModelSettings {
  geminiModel: string
  codexModel: string
}

export interface CcgScholarConfig {
  version: string
  routing: ModelRouting
  models: ModelSettings
  installedWorkflows: string[]
  mcpServers: string[]
  language: 'zh-CN' | 'en'
}

export interface AuxiliaryMcp {
  name: string
  displayName: string
  description: string
  descriptionEn: string
  command: string
  args: string[]
  env?: Record<string, string>
  envRequired?: string[]
}
