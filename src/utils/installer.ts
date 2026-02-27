import { homedir } from 'node:os'
import { join, dirname } from 'pathe'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import type { WorkflowConfig, InstallResult, UninstallResult, ModelRouting, ModelSettings } from '../types/index.js'
import { CCG_SCHOLAR_DIR, readCcgScholarConfig, writeCcgScholarConfig, createDefaultConfig, createDefaultModels } from './config.js'

// ---------------------------------------------------------------------------
// Package root
// ---------------------------------------------------------------------------

function getPackageRoot(): string {
  // In compiled dist, __dirname points to dist/
  // Templates are at the package root: ../templates/
  try {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    // From dist/ or src/ go up to package root
    const root = join(__dirname, '..')
    if (fs.existsSync(join(root, 'templates'))) return root
    const root2 = join(__dirname, '..', '..')
    if (fs.existsSync(join(root2, 'templates'))) return root2
    return root2
  }
  catch {
    return join(dirname(''), '..', '..')
  }
}

// ---------------------------------------------------------------------------
// Install paths
// ---------------------------------------------------------------------------

const CLAUDE_DIR = join(homedir(), '.claude')
const COMMANDS_DIR = join(CLAUDE_DIR, 'commands', 'ccg-scholar')
const AGENTS_DIR = join(CLAUDE_DIR, 'agents', 'ccg-scholar')
const PROMPTS_DIR = join(CCG_SCHOLAR_DIR, 'prompts')
const SKILLS_DIR = join(CLAUDE_DIR, 'skills')
const RULES_DIR = join(CLAUDE_DIR, 'rules')
const HOOKS_DIR = join(CLAUDE_DIR, 'hooks')

// ---------------------------------------------------------------------------
// ALL_COMMANDS — the complete list of commands shipped with CCG-Scholar
// ---------------------------------------------------------------------------

export const ALL_COMMANDS: string[] = [
  // Research
  'research-init',
  'literature-review',
  'gap-analysis',
  'paper-scan',
  'citation-check',
  'daily-paper',
  // Paper
  'paper-write',
  'paper-review',
  'paper-structure',
  'writing-polish',
  'anti-ai-check',
  // Experiment
  'experiment-plan',
  'experiment-code',
  'analyze-results',
  'visualize',
  // Rebuttal
  'rebuttal',
  'rebuttal-review',
  'review-response',
  // Post-acceptance
  'presentation',
  'poster',
  'promote',
  // Utility
  'commit',
  'init',
  'update-readme',
  'checkpoint',
  // Team
  'team-research',
  'team-plan',
  'team-exec',
  'team-write',
  'team-review',
]

// ---------------------------------------------------------------------------
// WORKFLOW_CONFIGS — grouped workflow configurations
// ---------------------------------------------------------------------------

export const WORKFLOW_CONFIGS: WorkflowConfig[] = [
  {
    id: 'literature-survey',
    name: '文献调研与综述',
    nameEn: 'Literature Survey & Review',
    category: 'research',
    commands: ['research-init', 'literature-review', 'gap-analysis', 'paper-scan', 'citation-check', 'daily-paper'],
    defaultSelected: true,
    order: 1,
    description: '系统性文献搜索、分类、趋势分析和研究空白识别',
    descriptionEn: 'Systematic literature search, classification, trend analysis and gap identification',
  },
  {
    id: 'paper-writing',
    name: '论文写作与投稿',
    nameEn: 'Paper Writing & Submission',
    category: 'paper',
    commands: ['paper-write', 'paper-review', 'paper-structure', 'writing-polish', 'anti-ai-check'],
    defaultSelected: true,
    order: 2,
    description: 'IMRaD 结构论文写作、多模型交叉审查、写作润色',
    descriptionEn: 'IMRaD paper writing, multi-model cross review, writing polish',
  },
  {
    id: 'experiment-dev',
    name: '实验设计与开发',
    nameEn: 'Experiment Design & Development',
    category: 'experiment',
    commands: ['experiment-plan', 'experiment-code', 'analyze-results', 'visualize'],
    defaultSelected: true,
    order: 3,
    description: '实验设计、训练脚本开发、结果分析与可视化',
    descriptionEn: 'Experiment design, training script development, results analysis and visualization',
  },
  {
    id: 'rebuttal-response',
    name: '审稿回复',
    nameEn: 'Rebuttal & Review Response',
    category: 'rebuttal',
    commands: ['rebuttal', 'rebuttal-review', 'review-response'],
    defaultSelected: true,
    order: 4,
    description: '系统化回复审稿意见，多模型技术可行性分析',
    descriptionEn: 'Systematic review response with multi-model technical feasibility analysis',
  },
  {
    id: 'post-acceptance',
    name: '录用后处理',
    nameEn: 'Post-Acceptance',
    category: 'paper',
    commands: ['presentation', 'poster', 'promote'],
    defaultSelected: false,
    order: 5,
    description: '会议演讲、海报制作、论文推广',
    descriptionEn: 'Conference presentation, poster design, paper promotion',
  },
  {
    id: 'utility-tools',
    name: '辅助工具',
    nameEn: 'Utility Tools',
    category: 'utility',
    commands: ['commit', 'init', 'update-readme', 'checkpoint'],
    defaultSelected: true,
    order: 6,
    description: 'Git 提交、项目初始化、文档更新、检查点管理',
    descriptionEn: 'Git commit, project init, documentation update, checkpoint management',
  },
  {
    id: 'team-collaboration',
    name: '团队协作',
    nameEn: 'Team Collaboration',
    category: 'team',
    commands: ['team-research', 'team-plan', 'team-exec', 'team-write', 'team-review'],
    defaultSelected: false,
    order: 7,
    description: '多模型协作研究、计划、执行、写作和交叉评审全流水线',
    descriptionEn: 'Multi-model collaborative research, planning, execution, writing and cross-review pipeline',
  },
]

// ---------------------------------------------------------------------------
// Agent templates
// ---------------------------------------------------------------------------

const AGENT_TEMPLATES = [
  'literature-reviewer',
  'experiment-planner',
  'paper-architect',
  'rebuttal-strategist',
]

// ---------------------------------------------------------------------------
// Prompt templates
// ---------------------------------------------------------------------------

const PROMPT_TEMPLATES = {
  codex: ['experiment-coder', 'code-reviewer', 'debugger', 'planner'],
  gemini: ['literature-scanner', 'data-visualizer', 'presentation-designer', 'planner'],
  claude: ['research-analyst', 'paper-writer', 'review-synthesizer'],
}

// ---------------------------------------------------------------------------
// Skill directories to install
// ---------------------------------------------------------------------------

const SKILL_DIRS = [
  'research-ideation',
  'ml-paper-writing',
  'results-analysis',
  'review-response',
  'citation-verification',
  'writing-anti-ai',
  'paper-self-review',
  'post-acceptance',
  'latex-conference-template-organizer',
  'daily-paper-generator',
  'git-workflow',
  'verification-loop',
  'planning-with-files',
  'uv-package-manager',
]

// ---------------------------------------------------------------------------
// Rule files
// ---------------------------------------------------------------------------

const RULE_FILES = [
  'experiment-reproducibility.md',
  'coding-style.md',
  'security.md',
  'agents.md',
]

// ---------------------------------------------------------------------------
// Hook files
// ---------------------------------------------------------------------------

const HOOK_FILES = [
  'session-start.js',
  'session-summary.js',
  'stop-summary.js',
  'security-guard.js',
  'skill-forced-eval.js',
  'hook-common.js',
  'hooks.json',
]

// ---------------------------------------------------------------------------
// Template variable injection
// ---------------------------------------------------------------------------

/**
 * Inject configuration variables into template content
 */
export function injectConfigVariables(
  content: string,
  routing: ModelRouting,
  models?: ModelSettings,
): string {
  const resolvedModels = models || createDefaultModels()
  const replacements: Record<string, string> = {
    '{{LITERATURE_MODELS}}': routing.literatureSearch.models.join(', '),
    '{{LITERATURE_PRIMARY}}': routing.literatureSearch.primary,
    '{{ANALYSIS_MODELS}}': routing.deepAnalysis.models.join(', '),
    '{{ANALYSIS_PRIMARY}}': routing.deepAnalysis.primary,
    '{{EXPERIMENT_MODELS}}': routing.experimentCode.models.join(', '),
    '{{EXPERIMENT_PRIMARY}}': routing.experimentCode.primary,
    '{{VISUALIZATION_MODELS}}': routing.dataVisualization.models.join(', '),
    '{{VISUALIZATION_PRIMARY}}': routing.dataVisualization.primary,
    '{{WRITING_MODELS}}': routing.paperWriting.models.join(', '),
    '{{WRITING_PRIMARY}}': routing.paperWriting.primary,
    '{{CROSS_REVIEW_MODELS}}': routing.crossReview.models.join(', '),
    '{{CROSS_REVIEW_STRATEGY}}': routing.crossReview.strategy,
    '{{COLLABORATION_MODE}}': routing.mode,
    '{{ZOTERO_MCP_TOOL}}': 'use_mcp_tool server_name="zotero"',
    '{{GEMINI_MODEL}}': resolvedModels.geminiModel,
    '{{CODEX_MODEL}}': resolvedModels.codexModel,
  }

  let result = content
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replaceAll(key, value)
  }
  return result
}

// ---------------------------------------------------------------------------
// Install workflows
// ---------------------------------------------------------------------------

/**
 * Install selected workflows (commands, prompts, agents, skills, rules, hooks)
 */
export async function installWorkflows(
  selectedWorkflowIds: string[],
  routing: ModelRouting,
  models?: ModelSettings,
): Promise<InstallResult> {
  const packageRoot = getPackageRoot()
  const result: InstallResult = {
    success: true,
    installedCommands: [],
    installedPrompts: [],
    installedSkills: [],
    installedRules: [],
    installedHooks: [],
    errors: [],
    configPath: CCG_SCHOLAR_DIR,
  }

  // Ensure target directories
  await fs.ensureDir(COMMANDS_DIR)
  await fs.ensureDir(AGENTS_DIR)
  await fs.ensureDir(PROMPTS_DIR)
  await fs.ensureDir(SKILLS_DIR)
  await fs.ensureDir(RULES_DIR)
  await fs.ensureDir(HOOKS_DIR)

  // Determine commands to install
  const selectedWorkflows = WORKFLOW_CONFIGS.filter(w => selectedWorkflowIds.includes(w.id))
  const commandsToInstall = new Set<string>()
  for (const workflow of selectedWorkflows) {
    for (const cmd of workflow.commands) {
      commandsToInstall.add(cmd)
    }
  }

  // Install commands
  for (const cmd of commandsToInstall) {
    try {
      const src = join(packageRoot, 'templates', 'commands', `${cmd}.md`)
      if (await fs.pathExists(src)) {
        let content = await fs.readFile(src, 'utf-8')
        content = injectConfigVariables(content, routing, models)
        const dest = join(COMMANDS_DIR, `${cmd}.md`)
        await fs.writeFile(dest, content, 'utf-8')
        result.installedCommands.push(cmd)
      }
      else {
        result.errors.push(`Command template not found: ${cmd}.md`)
      }
    }
    catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      result.errors.push(`Failed to install command ${cmd}: ${msg}`)
    }
  }

  // Install agent templates
  for (const agent of AGENT_TEMPLATES) {
    try {
      const src = join(packageRoot, 'templates', 'commands', 'agents', `${agent}.md`)
      if (await fs.pathExists(src)) {
        let content = await fs.readFile(src, 'utf-8')
        content = injectConfigVariables(content, routing, models)
        const dest = join(AGENTS_DIR, `${agent}.md`)
        await fs.writeFile(dest, content, 'utf-8')
      }
    }
    catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      result.errors.push(`Failed to install agent ${agent}: ${msg}`)
    }
  }

  // Install prompts
  for (const [model, prompts] of Object.entries(PROMPT_TEMPLATES)) {
    const promptModelDir = join(PROMPTS_DIR, model)
    await fs.ensureDir(promptModelDir)

    for (const prompt of prompts) {
      try {
        const src = join(packageRoot, 'templates', 'prompts', model, `${prompt}.md`)
        if (await fs.pathExists(src)) {
          const content = await fs.readFile(src, 'utf-8')
          const dest = join(promptModelDir, `${prompt}.md`)
          await fs.writeFile(dest, content, 'utf-8')
          result.installedPrompts.push(`${model}/${prompt}`)
        }
      }
      catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        result.errors.push(`Failed to install prompt ${model}/${prompt}: ${msg}`)
      }
    }
  }

  // Install skills
  for (const skill of SKILL_DIRS) {
    try {
      const src = join(packageRoot, 'templates', 'skills', skill)
      if (await fs.pathExists(src)) {
        const dest = join(SKILLS_DIR, skill)
        await fs.copy(src, dest, { overwrite: true })
        result.installedSkills.push(skill)
      }
    }
    catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      result.errors.push(`Failed to install skill ${skill}: ${msg}`)
    }
  }

  // Install rules
  for (const rule of RULE_FILES) {
    try {
      const src = join(packageRoot, 'templates', 'rules', rule)
      if (await fs.pathExists(src)) {
        const dest = join(RULES_DIR, rule)
        await fs.copy(src, dest, { overwrite: true })
        result.installedRules.push(rule)
      }
    }
    catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      result.errors.push(`Failed to install rule ${rule}: ${msg}`)
    }
  }

  // Install hooks
  for (const hook of HOOK_FILES) {
    try {
      const src = join(packageRoot, 'templates', 'hooks', hook)
      if (await fs.pathExists(src)) {
        const dest = join(HOOKS_DIR, hook)
        await fs.copy(src, dest, { overwrite: true })
        result.installedHooks.push(hook)
      }
    }
    catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      result.errors.push(`Failed to install hook ${hook}: ${msg}`)
    }
  }

  // Install output style
  try {
    const styleSrc = join(packageRoot, 'templates', 'output-styles', 'scholar-professional.md')
    if (await fs.pathExists(styleSrc)) {
      const styleDest = join(CCG_SCHOLAR_DIR, 'output-style.md')
      await fs.copy(styleSrc, styleDest, { overwrite: true })
    }
  }
  catch {
    // Non-critical, ignore
  }

  // Update config
  try {
    const config = await readCcgScholarConfig()
    config.installedWorkflows = selectedWorkflowIds
    config.routing = routing
    await writeCcgScholarConfig(config)
  }
  catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    result.errors.push(`Failed to save config: ${msg}`)
  }

  if (result.errors.length > 0) {
    result.success = false
  }

  return result
}

// ---------------------------------------------------------------------------
// Uninstall workflows
// ---------------------------------------------------------------------------

/**
 * Uninstall all CCG-Scholar workflows and configuration
 */
export async function uninstallWorkflows(): Promise<UninstallResult> {
  const result: UninstallResult = {
    success: true,
    removedCommands: [],
    removedPrompts: [],
    removedAgents: [],
    removedSkills: [],
    removedBin: false,
    errors: [],
  }

  // Remove commands directory
  try {
    if (await fs.pathExists(COMMANDS_DIR)) {
      const files = await fs.readdir(COMMANDS_DIR)
      result.removedCommands = files.map(f => f.replace('.md', ''))
      await fs.remove(COMMANDS_DIR)
    }
  }
  catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    result.errors.push(`Failed to remove commands: ${msg}`)
  }

  // Remove agents directory
  try {
    if (await fs.pathExists(AGENTS_DIR)) {
      const files = await fs.readdir(AGENTS_DIR)
      result.removedAgents = files.map(f => f.replace('.md', ''))
      await fs.remove(AGENTS_DIR)
    }
  }
  catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    result.errors.push(`Failed to remove agents: ${msg}`)
  }

  // Remove prompts directory
  try {
    if (await fs.pathExists(PROMPTS_DIR)) {
      result.removedPrompts.push('all prompts')
      await fs.remove(PROMPTS_DIR)
    }
  }
  catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    result.errors.push(`Failed to remove prompts: ${msg}`)
  }

  // Remove installed skills
  for (const skill of SKILL_DIRS) {
    try {
      const skillDir = join(SKILLS_DIR, skill)
      if (await fs.pathExists(skillDir)) {
        await fs.remove(skillDir)
        result.removedSkills.push(skill)
      }
    }
    catch {
      // Non-critical
    }
  }

  // Remove CCG-Scholar config directory
  try {
    if (await fs.pathExists(CCG_SCHOLAR_DIR)) {
      await fs.remove(CCG_SCHOLAR_DIR)
    }
  }
  catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    result.errors.push(`Failed to remove config: ${msg}`)
  }

  if (result.errors.length > 0) {
    result.success = false
  }

  return result
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Get the list of workflow configs filtered by category
 */
export function getWorkflowsByCategory(category: WorkflowConfig['category']): WorkflowConfig[] {
  return WORKFLOW_CONFIGS.filter(w => w.category === category)
}

/**
 * Get a specific workflow config by ID
 */
export function getWorkflowById(id: string): WorkflowConfig | undefined {
  return WORKFLOW_CONFIGS.find(w => w.id === id)
}

/**
 * Check if CCG-Scholar is already installed
 */
export async function isInstalled(): Promise<boolean> {
  return fs.pathExists(CCG_SCHOLAR_DIR)
}

/**
 * Get currently installed workflow IDs
 */
export async function getInstalledWorkflows(): Promise<string[]> {
  const config = await readCcgScholarConfig()
  return config.installedWorkflows
}
