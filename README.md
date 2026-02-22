# CCG-Scholar

> Claude-Codex-Gemini 多模型协作科研工作流系统

CCG-Scholar 是一个基于多模型协作的科研工作流系统，整合 Claude（深度分析/论文写作）、Codex（实验代码）和 Gemini（文献检索/数据可视化）的能力，覆盖从文献调研到论文发表的完整科研生命周期。

## 特性

- 🔬 **四大核心工作流**: 文献调研、论文写作、实验开发、审稿回复
- 🤖 **三模型协作**: Claude + Codex + Gemini 智能路由分工
- 📚 **14 个科研技能**: 覆盖选题、写作、实验、引用验证等
- 🔌 **MCP 集成**: Zotero 文献管理、Context7、Playwright 等
- 🎯 **28 个命令模板**: 即开即用的科研命令
- 🧠 **4 个智能代理**: 文献审查员、实验规划师、论文架构师、审稿策略师

## 安装

```bash
npx ccg-scholar
# 或全局安装
npm install -g ccg-scholar
ccg-scholar init
```

## 命令列表

### 文献调研
| 命令 | 功能 |
|------|------|
| `/ccg-scholar:research-init` | 启动研究构思工作流 |
| `/ccg-scholar:literature-review` | 系统性文献综述 |
| `/ccg-scholar:gap-analysis` | 研究空白分析 |
| `/ccg-scholar:paper-scan` | 论文快速扫描 |
| `/ccg-scholar:citation-check` | 引用验证 |
| `/ccg-scholar:daily-paper` | 每日论文推送 |

### 论文写作
| 命令 | 功能 |
|------|------|
| `/ccg-scholar:paper-write` | 论文写作（IMRaD） |
| `/ccg-scholar:paper-review` | 论文审查 |
| `/ccg-scholar:paper-structure` | 论文结构规划 |
| `/ccg-scholar:writing-polish` | 写作润色 |
| `/ccg-scholar:anti-ai-check` | 去 AI 痕迹检查 |

### 实验开发
| 命令 | 功能 |
|------|------|
| `/ccg-scholar:experiment-plan` | 实验设计 |
| `/ccg-scholar:experiment-code` | 实验代码生成 |
| `/ccg-scholar:analyze-results` | 结果分析 |
| `/ccg-scholar:visualize` | 数据可视化 |

### 审稿回复
| 命令 | 功能 |
|------|------|
| `/ccg-scholar:rebuttal` | 审稿回复 |
| `/ccg-scholar:rebuttal-review` | 回复审查 |
| `/ccg-scholar:review-response` | 审稿意见回复 |

### 录用后处理
| 命令 | 功能 |
|------|------|
| `/ccg-scholar:presentation` | 会议演讲准备 |
| `/ccg-scholar:poster` | 学术海报设计 |
| `/ccg-scholar:promote` | 论文推广 |

### 辅助工具
| 命令 | 功能 |
|------|------|
| `/ccg-scholar:commit` | Git 提交 |
| `/ccg-scholar:init` | 项目初始化 |
| `/ccg-scholar:update-readme` | 更新 README |
| `/ccg-scholar:checkpoint` | 研究检查点 |

### 团队协作
| 命令 | 功能 |
|------|------|
| `/ccg-scholar:team-research` | 协作文献调研 |
| `/ccg-scholar:team-write` | 协作论文写作 |
| `/ccg-scholar:team-review` | 协作论文评审 |

## 多模型路由

| 任务 | 主模型 | 辅模型 |
|------|--------|--------|
| 文献检索 | Gemini | — |
| 深度分析 | Claude | — |
| 实验代码 | Codex | — |
| 数据可视化 | Gemini | — |
| 论文写作 | Claude | — |
| 交叉评审 | Codex + Gemini | 并行 |

## 科研技能

14 个内置科研技能，覆盖完整研究生命周期：

- `research-ideation` — 研究选题（5W1H, Gap 分析）
- `ml-paper-writing` — ML论文写作（含 LaTeX 模板）
- `results-analysis` — 实验结果分析
- `review-response` — 审稿回复策略
- `citation-verification` — 引用验证（4 层验证）
- `writing-anti-ai` — 去 AI 痕迹
- `paper-self-review` — 论文自审
- `post-acceptance` — 会后处理
- `latex-conference-template-organizer` — LaTeX 模板管理
- `daily-paper-generator` — 每日论文推送
- `git-workflow` — Git 规范
- `verification-loop` — 验证循环
- `planning-with-files` — 文件规划
- `uv-package-manager` — Python 包管理

## 智能代理

| 代理 | 功能 | 多模型调度 |
|------|------|-----------|
| `literature-reviewer` | 文献搜索与趋势分析 | Gemini 扫描 → Claude 分析 |
| `experiment-planner` | 实验设计与可行性 | Claude 设计 → Codex 验证 |
| `paper-architect` | 论文结构规划 | Claude + Codex + Gemini |
| `rebuttal-strategist` | 审稿回复策略 | Claude 分析 → Codex 实验 → Gemini 可视化 |

## 架构

```
ccg-scholar/
├── bin/ccg-scholar.mjs          # CLI 入口
├── src/
│   ├── cli.ts                   # CLI 命令定义
│   ├── types/index.ts           # 类型系统（ModelRouting）
│   ├── utils/
│   │   ├── installer.ts         # 安装核心（WORKFLOW_CONFIGS）
│   │   ├── config.ts            # 配置管理
│   │   └── mcp.ts               # MCP 服务器管理
│   ├── commands/                # CLI 子命令
│   └── i18n/                    # 中英双语
├── templates/
│   ├── commands/                # 28 个命令模板
│   │   └── agents/              # 4 个代理模板
│   ├── prompts/                 # 9 个角色提示词
│   ├── skills/                  # 14 个科研技能
│   ├── rules/                   # 4 个全局规则
│   ├── hooks/                   # 7 个自动化钩子
│   └── output-styles/           # 输出样式
└── dist/                        # 编译输出
```

## 许可证

MIT
