import i18next from 'i18next'

const zhCN = {
  translation: {
    // Init & Welcome
    'init.welcome': '欢迎使用 CCG-Scholar 多模型协作科研系统',
    'init.description': 'Claude-Codex-Gemini 三模型协同，覆盖文献调研、深度分析、实验开发、数据可视化、论文写作全流程',
    'init.selectWorkflows': '请选择要安装的科研工作流：',
    'init.confirmInstall': '确认安装选中的工作流？',
    'init.installing': '正在安装科研工作流...',
    'init.installSuccess': '安装完成！',
    'init.installFailed': '安装失败，请检查错误信息',

    // Menu labels
    'menu.research': '科研工作流',
    'menu.paper': '论文写作',
    'menu.experiment': '实验开发',
    'menu.rebuttal': '审稿回复',
    'menu.utility': '实用工具',
    'menu.team': '团队协作',
    'menu.config': '配置管理',
    'menu.mcp': 'MCP 服务器配置',
    'menu.routing': '模型路由配置',
    'menu.uninstall': '卸载',

    // Categories
    'category.research': '文献调研与综述',
    'category.paper': '论文撰写与投稿',
    'category.experiment': '实验设计与编码',
    'category.rebuttal': '审稿意见回复',
    'category.utility': '辅助工具',
    'category.team': '团队协作与评审',

    // Model descriptions
    'model.claude': 'Claude — 深度分析与论文写作专家',
    'model.codex': 'Codex — 实验代码生成与调试专家',
    'model.gemini': 'Gemini — 文献检索与数据可视化专家',

    // Routing
    'routing.title': '模型路由配置',
    'routing.description': '配置不同科研任务的模型分工',
    'routing.literatureSearch': '文献检索',
    'routing.deepAnalysis': '深度分析',
    'routing.experimentCode': '实验代码',
    'routing.dataVisualization': '数据可视化',
    'routing.paperWriting': '论文写作',
    'routing.crossReview': '交叉评审',
    'routing.mode': '协作模式',
    'routing.mode.parallel': '并行模式 — 多模型同时执行',
    'routing.mode.smart': '智能模式 — 根据任务自动分配',
    'routing.mode.sequential': '顺序模式 — 按流程依次执行',

    // MCP
    'mcp.title': 'MCP 服务器配置',
    'mcp.codeRetrieval': '代码检索工具 (AceTool + ContextWeaver)',
    'mcp.context7': 'Context7 — 实时文档检索',
    'mcp.playwright': 'Playwright — 浏览器自动化与数据采集',
    'mcp.deepwiki': 'DeepWiki — 代码仓库知识检索',
    'mcp.exa': 'Exa — AI 语义搜索引擎',
    'mcp.zotero': 'Zotero — 文献管理与引文集成',
    'mcp.installSuccess': 'MCP 服务器配置完成',
    'mcp.installFailed': 'MCP 服务器配置失败',
    'mcp.backup': '已备份原配置到: {{path}}',
    'mcp.noBackup': '无需备份（配置文件不存在）',
    'mcp.diagnose': '诊断 MCP 配置',
    'mcp.diagnoseOk': 'MCP 配置正常',
    'mcp.diagnoseIssues': '发现以下问题：',

    // Uninstall
    'uninstall.title': '卸载 CCG-Scholar',
    'uninstall.confirm': '确认卸载所有 CCG-Scholar 工作流和配置？',
    'uninstall.success': '卸载完成',
    'uninstall.cancelled': '已取消卸载',

    // Common
    'common.yes': '是',
    'common.no': '否',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.back': '返回',
    'common.error': '错误',
    'common.success': '成功',
    'common.loading': '加载中...',
    'common.done': '完成',
  },
}

const en = {
  translation: {
    // Init & Welcome
    'init.welcome': 'Welcome to CCG-Scholar Multi-Model Collaborative Research System',
    'init.description': 'Claude-Codex-Gemini tri-model collaboration covering literature survey, deep analysis, experiment development, data visualization, and paper writing',
    'init.selectWorkflows': 'Select research workflows to install:',
    'init.confirmInstall': 'Confirm installation of selected workflows?',
    'init.installing': 'Installing research workflows...',
    'init.installSuccess': 'Installation complete!',
    'init.installFailed': 'Installation failed, please check error messages',

    // Menu labels
    'menu.research': 'Research Workflows',
    'menu.paper': 'Paper Writing',
    'menu.experiment': 'Experiment Development',
    'menu.rebuttal': 'Rebuttal & Review Response',
    'menu.utility': 'Utilities',
    'menu.team': 'Team Collaboration',
    'menu.config': 'Configuration',
    'menu.mcp': 'MCP Server Configuration',
    'menu.routing': 'Model Routing Configuration',
    'menu.uninstall': 'Uninstall',

    // Categories
    'category.research': 'Literature Survey & Review',
    'category.paper': 'Paper Writing & Submission',
    'category.experiment': 'Experiment Design & Coding',
    'category.rebuttal': 'Review Response & Rebuttal',
    'category.utility': 'Auxiliary Tools',
    'category.team': 'Team Collaboration & Review',

    // Model descriptions
    'model.claude': 'Claude — Deep analysis and paper writing expert',
    'model.codex': 'Codex — Experiment code generation and debugging expert',
    'model.gemini': 'Gemini — Literature retrieval and data visualization expert',

    // Routing
    'routing.title': 'Model Routing Configuration',
    'routing.description': 'Configure model assignment for different research tasks',
    'routing.literatureSearch': 'Literature Search',
    'routing.deepAnalysis': 'Deep Analysis',
    'routing.experimentCode': 'Experiment Code',
    'routing.dataVisualization': 'Data Visualization',
    'routing.paperWriting': 'Paper Writing',
    'routing.crossReview': 'Cross Review',
    'routing.mode': 'Collaboration Mode',
    'routing.mode.parallel': 'Parallel — multiple models execute simultaneously',
    'routing.mode.smart': 'Smart — automatically assign based on task',
    'routing.mode.sequential': 'Sequential — execute in workflow order',

    // MCP
    'mcp.title': 'MCP Server Configuration',
    'mcp.codeRetrieval': 'Code Retrieval Tools (AceTool + ContextWeaver)',
    'mcp.context7': 'Context7 — Real-time documentation retrieval',
    'mcp.playwright': 'Playwright — Browser automation and data collection',
    'mcp.deepwiki': 'DeepWiki — Repository knowledge retrieval',
    'mcp.exa': 'Exa — AI semantic search engine',
    'mcp.zotero': 'Zotero — Citation manager and library integration',
    'mcp.installSuccess': 'MCP server configuration complete',
    'mcp.installFailed': 'MCP server configuration failed',
    'mcp.backup': 'Config backed up to: {{path}}',
    'mcp.noBackup': 'No backup needed (config file does not exist)',
    'mcp.diagnose': 'Diagnose MCP configuration',
    'mcp.diagnoseOk': 'MCP configuration is OK',
    'mcp.diagnoseIssues': 'Found the following issues:',

    // Uninstall
    'uninstall.title': 'Uninstall CCG-Scholar',
    'uninstall.confirm': 'Confirm uninstall all CCG-Scholar workflows and configuration?',
    'uninstall.success': 'Uninstall complete',
    'uninstall.cancelled': 'Uninstall cancelled',

    // Common
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.loading': 'Loading...',
    'common.done': 'Done',
  },
}

let initialized = false

/**
 * Initialize i18n with the given language.
 * Safe to call multiple times — subsequent calls are no-ops.
 */
export async function initI18n(language: 'zh-CN' | 'en' = 'zh-CN'): Promise<typeof i18next> {
  if (initialized)
    return i18next

  await i18next.init({
    lng: language,
    fallbackLng: 'zh-CN',
    resources: {
      'zh-CN': zhCN,
      'en': en,
    },
    interpolation: {
      escapeValue: false,
    },
  })

  initialized = true
  return i18next
}

/**
 * Change the active language at runtime
 */
export async function changeLanguage(language: 'zh-CN' | 'en'): Promise<void> {
  await i18next.changeLanguage(language)
}

/**
 * Shorthand translation function
 */
export function t(key: string, options?: Record<string, unknown>): string {
  return i18next.t(key, options)
}

export { i18next }
