# CCG-Scholar

> Claude-Codex-Gemini 多模型协作科研工作流系统

[English](#english) | [中文](#中文)

---

## 中文

CCG-Scholar 是一个面向学术研究的多模型协作工作流系统。它整合 **Claude**（深度分析/论文写作）、**Codex**（实验代码）和 **Gemini**（文献检索/数据可视化）三大模型的能力，通过 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) 的命令系统实现一键调用，覆盖从文献调研到论文发表的完整科研生命周期。

### 特性

- **四大核心工作流**: 文献调研、论文写作、实验开发、审稿回复
- **三模型智能路由**: Claude + Codex + Gemini 按任务自动分工
- **28 个命令模板**: 在 Claude Code 中通过 `/ccg-scholar:xxx` 即开即用
- **14 个科研技能**: 覆盖选题、写作、实验、引用验证、去 AI 痕迹等
- **4 个智能代理**: 文献审查员、实验规划师、论文架构师、审稿策略师
- **7 个自动化钩子**: 会话管理、安全防护、技能自动激活
- **MCP 集成**: Zotero 文献管理、Context7、Playwright 等
- **中英双语**: CLI 和所有输出支持中英文切换
- **LaTeX 模板**: 内置 NeurIPS / ICML / ICLR / ACL / AAAI / COLM 模板

### 前置条件

| 依赖 | 说明 | 安装方式 |
|------|------|---------|
| [Node.js](https://nodejs.org/) ≥ 18 | 运行环境 | `brew install node` |
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | 主框架 | `npm install -g @anthropic-ai/claude-code` |
| [Codex CLI](https://github.com/openai/codex) | 实验代码生成（可选） | `npm install -g @openai/codex` |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | 文献检索/可视化（可选） | 安装 CLI 或配置 `GEMINI_API_KEY` |

> **注意**: Codex CLI 和 Gemini CLI 仅在使用多模型协作命令（如 `team-research`、`literature-review` 等）时需要。单模型命令（如 `paper-write`、`commit`）只需 Claude Code。

### 安装

#### 方式一：npm 全局安装（推荐）

```bash
# 安装
npm install -g ccg-scholar

# 初始化（交互式选择工作流、MCP、语言等）
ccg-scholar init
```

#### 方式二：从源码安装

```bash
# 克隆仓库
git clone https://github.com/your-username/ccg-scholar.git
cd ccg-scholar

# 安装依赖并构建
npm install
npx unbuild

# 运行初始化
node bin/ccg-scholar.mjs init
```

#### 方式三：npx 一键运行

```bash
npx ccg-scholar init
```

### 安装 codeagent-wrapper（多模型调度）

`codeagent-wrapper` 是多模型协作的核心二进制，负责将任务分发给 Codex 和 Gemini。来源于 [cexll/myclaude](https://github.com/cexll/myclaude)。

#### 自动安装

如果已安装 [ccg-workflow](https://www.npmjs.com/package/ccg-workflow)，可直接复用：

```bash
# ccg-workflow 的 init 会自动安装 codeagent-wrapper 到 ~/.claude/bin/
npx ccg-workflow init
```

#### 手动安装

从 ccg-workflow npm 包中提取二进制：

```bash
# 1. 下载 ccg-workflow 包
npm pack ccg-workflow
tar -xzf ccg-workflow-*.tgz

# 2. 创建目标目录
mkdir -p ~/.claude/bin

# 3. 根据你的平台选择对应二进制
# macOS Apple Silicon (M1/M2/M3/M4):
cp package/bin/codeagent-wrapper-darwin-arm64 ~/.claude/bin/codeagent-wrapper

# macOS Intel:
# cp package/bin/codeagent-wrapper-darwin-amd64 ~/.claude/bin/codeagent-wrapper

# Linux x86_64:
# cp package/bin/codeagent-wrapper-linux-amd64 ~/.claude/bin/codeagent-wrapper

# Linux ARM64:
# cp package/bin/codeagent-wrapper-linux-arm64 ~/.claude/bin/codeagent-wrapper

# Windows (PowerShell):
# copy package\bin\codeagent-wrapper-windows-amd64.exe $env:USERPROFILE\.claude\bin\codeagent-wrapper.exe

# 4. 设置可执行权限（Unix/macOS）
chmod +x ~/.claude/bin/codeagent-wrapper

# 5. 验证安装
~/.claude/bin/codeagent-wrapper --version

# 6. 清理临时文件
rm -rf package ccg-workflow-*.tgz
```

#### 支持平台

| 平台 | 架构 | 二进制文件 |
|------|------|----------|
| macOS | Apple Silicon (ARM64) | `codeagent-wrapper-darwin-arm64` |
| macOS | Intel (x86_64) | `codeagent-wrapper-darwin-amd64` |
| Linux | ARM64 | `codeagent-wrapper-linux-arm64` |
| Linux | x86_64 | `codeagent-wrapper-linux-amd64` |
| Windows | ARM64 | `codeagent-wrapper-windows-arm64.exe` |
| Windows | x86_64 | `codeagent-wrapper-windows-amd64.exe` |

### 配置

#### 权限白名单

安装后，在 `~/.claude/settings.json` 中添加 codeagent-wrapper 的权限白名单，避免每次多模型调用弹出确认：

```jsonc
{
  "permissions": {
    "allow": [
      "Bash(~/.claude/bin/codeagent-wrapper --backend codex*)",
      "Bash(~/.claude/bin/codeagent-wrapper --backend gemini*)"
    ]
  }
}
```

#### MCP 服务器

`ccg-scholar init` 过程中可选择安装以下 MCP 服务器：

| MCP | 功能 | 适用场景 |
|-----|------|---------|
| **Zotero** | 文献管理与引文集成 | 文献调研、引用验证 |
| **Context7** | 实时文档检索 | 获取最新框架文档 |
| **Playwright** | 浏览器自动化 | 网页数据采集 |
| **DeepWiki** | 代码仓库知识检索 | 了解开源项目 |
| **Exa** | AI 语义搜索引擎 | 深度搜索（需 API key） |
| **AceTool + ContextWeaver** | 代码检索工具 | 代码搜索与上下文增强 |

也可后续单独配置：

```bash
ccg-scholar mcp
```

#### 模型路由

安装时可选择协作模式：

| 模式 | 说明 |
|------|------|
| **智能模式**（默认） | 根据任务类型自动分配最适合的模型 |
| **并行模式** | 多个模型同时执行，适合交叉评审 |
| **顺序模式** | 按流程依次执行，适合线性工作流 |

默认路由配置：

| 任务 | 主模型 | 说明 |
|------|--------|------|
| 文献检索 | Gemini | 大规模论文扫描与趋势检测 |
| 深度分析 | Claude | 方法论评估与研究空白识别 |
| 实验代码 | Codex | ML 训练脚本与数据管线 |
| 数据可视化 | Gemini | matplotlib/seaborn 图表生成 |
| 论文写作 | Claude | IMRaD 结构写作与润色 |
| 交叉评审 | Codex + Gemini | 多角度并行审查 |

### 使用

#### 初始化

```bash
ccg-scholar init
```

交互式引导你完成：
1. 选择语言（中文 / English）
2. 选择协作模式（智能 / 并行 / 顺序）
3. 勾选要安装的工作流
4. 配置 MCP 服务器
5. 确认并安装

安装完成后，所有命令、技能、代理会被安装到 `~/.claude/` 目录下。

#### 在 Claude Code 中使用

打开 Claude Code，通过斜杠命令调用：

```
/ccg-scholar:literature-review 注意力机制在多模态学习中的应用
```

#### 命令列表

##### 文献调研（6 个）

| 命令 | 功能 | 模型分工 |
|------|------|---------|
| `/ccg-scholar:research-init` | 启动研究项目 | Claude |
| `/ccg-scholar:literature-review` | 系统性文献综述 | Gemini 扫描 → Claude 分析 |
| `/ccg-scholar:gap-analysis` | 研究空白分析 | Gemini + Claude |
| `/ccg-scholar:paper-scan` | 论文快速扫描 | Gemini |
| `/ccg-scholar:citation-check` | 引用验证 | Claude |
| `/ccg-scholar:daily-paper` | 每日论文推送 | Gemini 扫描 → Claude 筛选 |

##### 论文写作（5 个）

| 命令 | 功能 | 模型分工 |
|------|------|---------|
| `/ccg-scholar:paper-structure` | 论文结构规划（IMRaD） | Claude |
| `/ccg-scholar:paper-write` | 多模型协作写论文 | Claude 写 → Codex+Gemini 审 |
| `/ccg-scholar:paper-review` | 论文自审清单 | Claude |
| `/ccg-scholar:writing-polish` | 学术写作润色 | Claude |
| `/ccg-scholar:anti-ai-check` | 去 AI 痕迹检查 | Claude |

##### 实验开发（4 个）

| 命令 | 功能 | 模型分工 |
|------|------|---------|
| `/ccg-scholar:experiment-plan` | 实验设计 | Claude |
| `/ccg-scholar:experiment-code` | 实验代码生成 | Codex 生成 → Claude 审查 |
| `/ccg-scholar:analyze-results` | 结果分析 | Claude + Gemini 可视化 |
| `/ccg-scholar:visualize` | 数据可视化 | Gemini |

##### 审稿回复（3 个）

| 命令 | 功能 | 模型分工 |
|------|------|---------|
| `/ccg-scholar:rebuttal` | 多模型协作审稿回复 | Claude → Codex → Gemini |
| `/ccg-scholar:rebuttal-review` | 回复草稿审查 | Claude |
| `/ccg-scholar:review-response` | 正式回复信生成 | Claude |

##### 录用后处理（3 个）

| 命令 | 功能 | 模型分工 |
|------|------|---------|
| `/ccg-scholar:presentation` | 会议演讲准备 | Claude + Gemini |
| `/ccg-scholar:poster` | 学术海报设计 | Claude + Gemini |
| `/ccg-scholar:promote` | 论文推广材料 | Claude |

##### 辅助工具（4 个）

| 命令 | 功能 |
|------|------|
| `/ccg-scholar:commit` | Git 提交（Conventional Commits） |
| `/ccg-scholar:init` | 项目目录初始化 |
| `/ccg-scholar:update-readme` | 自动更新 README |
| `/ccg-scholar:checkpoint` | 研究进度检查点 |

##### 团队协作（3 个）

| 命令 | 功能 | 模型分工 |
|------|------|---------|
| `/ccg-scholar:team-research` | 协作文献调研 | Codex+Gemini 并行扫描 → Claude 综合 |
| `/ccg-scholar:team-write` | 协作论文写作 | 多模型分章节并行写作 |
| `/ccg-scholar:team-review` | 协作论文评审 | 多模型多角度交叉评审 |

### 典型工作流

#### 从零到投稿

```
研究构思
  /ccg-scholar:research-init              → 创建项目结构
  /ccg-scholar:literature-review          → Gemini 扫描 + Claude 深度分析
  /ccg-scholar:gap-analysis               → 识别研究空白

实验开发
  /ccg-scholar:experiment-plan            → Claude 设计实验方案
  /ccg-scholar:experiment-code            → Codex 生成训练代码
  /ccg-scholar:analyze-results            → 统计分析 + Gemini 画图

论文写作
  /ccg-scholar:paper-structure            → 规划 IMRaD 结构
  /ccg-scholar:paper-write                → Claude 主笔 + 多模型审查
  /ccg-scholar:anti-ai-check              → 去 AI 痕迹
  /ccg-scholar:citation-check             → 验证引用

投稿后
  /ccg-scholar:rebuttal                   → 多模型协作写 rebuttal
  /ccg-scholar:presentation               → 准备会议演讲
  /ccg-scholar:promote                    → 生成推广材料
```

#### 每日论文追踪

```
/ccg-scholar:daily-paper attention mechanism, multimodal learning
```

Gemini 扫描当日 arXiv 新论文 → Claude 筛选与你研究相关的 → 输出摘要报告。

### 科研技能

14 个内置技能在 Claude Code 会话中自动激活：

| 技能 | 功能 |
|------|------|
| `research-ideation` | 研究选题（5W1H 框架、Gap 分析） |
| `ml-paper-writing` | ML 论文写作（含 NeurIPS/ICML/ICLR/ACL/AAAI/COLM LaTeX 模板） |
| `results-analysis` | 实验结果分析（统计检验、可视化、消融实验） |
| `review-response` | 审稿回复策略 |
| `citation-verification` | 引用验证（格式 → API → 信息 → 内容 四层验证） |
| `writing-anti-ai` | 去 AI 写作痕迹（中英文双语） |
| `paper-self-review` | 论文自审（6 项质量检查清单） |
| `post-acceptance` | 会后处理（演示、海报、推广） |
| `latex-conference-template-organizer` | LaTeX 会议模板整理 |
| `daily-paper-generator` | 每日论文推送生成 |
| `git-workflow` | Git 工作流规范（Conventional Commits） |
| `verification-loop` | 验证循环 |
| `planning-with-files` | 文件规划 |
| `uv-package-manager` | Python uv 包管理 |

### 智能代理

4 个代理在需要时自动激活：

| 代理 | 触发时机 | 模型调度 |
|------|---------|---------|
| `literature-reviewer` | 新研究课题 | Gemini 批量扫描 → Claude 深度分析 |
| `experiment-planner` | 设计实验 | Claude 设计 → Codex 验证可行性 |
| `paper-architect` | 开始写论文 | Claude 结构 + Codex 方法论 + Gemini 图表 |
| `rebuttal-strategist` | 收到审稿意见 | Claude 分析 → Codex 补充实验 → Gemini 可视化 |

### CLI 命令

```bash
ccg-scholar              # 交互式菜单
ccg-scholar init         # 安装工作流（首次使用）
ccg-scholar mcp          # 配置 MCP 服务器
ccg-scholar diagnose     # 诊断配置状态
ccg-scholar update       # 检查更新
ccg-scholar uninstall    # 卸载所有工作流
ccg-scholar --help       # 帮助
ccg-scholar --version    # 版本
```

### 安装路径

`ccg-scholar init` 会将文件安装到以下位置：

```
~/.claude/
├── commands/ccg-scholar/      # 28 个命令模板
├── agents/ccg-scholar/        # 4 个代理模板
├── skills/                    # 14 个科研技能
├── rules/                     # 4 个全局规则
├── hooks/                     # 7 个自动化钩子
├── bin/codeagent-wrapper      # 多模型调度二进制（需手动安装）
├── settings.json              # MCP 配置
└── .ccg-scholar/
    └── config.toml            # CCG-Scholar 配置
```

### 项目结构

```
ccg-scholar/
├── bin/ccg-scholar.mjs              # CLI 入口
├── src/
│   ├── cli.ts                       # CLI 命令定义（cac 框架）
│   ├── types/index.ts               # 类型系统（ModelRouting 等）
│   ├── utils/
│   │   ├── installer.ts             # 安装核心（ALL_COMMANDS, WORKFLOW_CONFIGS）
│   │   ├── config.ts                # 配置管理（TOML）
│   │   └── mcp.ts                   # MCP 服务器管理
│   ├── commands/                    # CLI 子命令（init, menu, mcp, diagnose...）
│   └── i18n/index.ts                # 中英双语（i18next）
├── templates/
│   ├── commands/                    # 28 个命令模板（.md）
│   │   └── agents/                  # 4 个代理模板
│   ├── prompts/                     # 9 个角色提示词
│   │   ├── codex/                   #   experiment-coder, code-reviewer, debugger
│   │   ├── gemini/                  #   literature-scanner, data-visualizer, presentation-designer
│   │   └── claude/                  #   research-analyst, paper-writer, review-synthesizer
│   ├── skills/                      # 14 个科研技能（含 LaTeX 模板）
│   ├── rules/                       # 4 个全局规则
│   ├── hooks/                       # 7 个自动化钩子（Node.js）
│   └── output-styles/               # 输出样式模板
├── package.json
├── build.config.ts                  # unbuild 构建配置
└── tsconfig.json
```

### 开发

```bash
# 安装依赖
npm install

# 构建
npx unbuild

# 开发模式运行
npx tsx src/cli.ts --help

# 类型检查
npx tsc --noEmit
```

### 致谢

- [ccg-workflow](https://github.com/fengshao1227/ccg-workflow) — 多模型协作基础设施与 codeagent-wrapper
- [claude-scholar](https://github.com/Galaxy-Dawn/claude-scholar) — 科研技能、代理与领域知识
- [cexll/myclaude](https://github.com/cexll/myclaude) — codeagent-wrapper 二进制
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — 命令/技能/代理框架

### 许可证

MIT

---

## English

CCG-Scholar is a multi-model collaborative research workflow system for academia. It integrates **Claude** (deep analysis / paper writing), **Codex** (experiment code), and **Gemini** (literature retrieval / data visualization) through the [Claude Code](https://docs.anthropic.com/en/docs/claude-code) command system, covering the complete research lifecycle from literature survey to paper publication.

### Features

- **4 Core Workflows**: Literature survey, paper writing, experiment development, rebuttal response
- **3-Model Smart Routing**: Claude + Codex + Gemini with automatic task assignment
- **28 Command Templates**: Use via `/ccg-scholar:xxx` in Claude Code
- **14 Research Skills**: Topic selection, writing, experiments, citation verification, anti-AI detection
- **4 Intelligent Agents**: Literature reviewer, experiment planner, paper architect, rebuttal strategist
- **MCP Integration**: Zotero, Context7, Playwright, DeepWiki, Exa
- **Bilingual**: Full Chinese/English support
- **LaTeX Templates**: Built-in NeurIPS / ICML / ICLR / ACL / AAAI / COLM templates

### Prerequisites

| Dependency | Purpose | Install |
|-----------|---------|---------|
| [Node.js](https://nodejs.org/) ≥ 18 | Runtime | `brew install node` |
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | Main framework | `npm install -g @anthropic-ai/claude-code` |
| [Codex CLI](https://github.com/openai/codex) | Experiment code (optional) | `npm install -g @openai/codex` |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | Literature / visualization (optional) | Install CLI or set `GEMINI_API_KEY` |

> **Note**: Codex CLI and Gemini CLI are only needed for multi-model commands (e.g., `team-research`, `literature-review`). Single-model commands (e.g., `paper-write`, `commit`) only require Claude Code.

### Quick Start

```bash
# Install globally
npm install -g ccg-scholar

# Interactive setup (select workflows, MCP servers, language)
ccg-scholar init
```

### Installing codeagent-wrapper (Multi-Model Dispatch)

`codeagent-wrapper` is the core binary for multi-model collaboration, dispatching tasks to Codex and Gemini. Source: [cexll/myclaude](https://github.com/cexll/myclaude).

#### Option A: Via ccg-workflow

```bash
# ccg-workflow's init automatically installs codeagent-wrapper to ~/.claude/bin/
npx ccg-workflow init
```

#### Option B: Manual Installation

```bash
# 1. Download ccg-workflow package
npm pack ccg-workflow
tar -xzf ccg-workflow-*.tgz

# 2. Create target directory
mkdir -p ~/.claude/bin

# 3. Copy the binary for your platform
# macOS Apple Silicon (M1/M2/M3/M4):
cp package/bin/codeagent-wrapper-darwin-arm64 ~/.claude/bin/codeagent-wrapper

# macOS Intel:
# cp package/bin/codeagent-wrapper-darwin-amd64 ~/.claude/bin/codeagent-wrapper

# Linux x86_64:
# cp package/bin/codeagent-wrapper-linux-amd64 ~/.claude/bin/codeagent-wrapper

# Linux ARM64:
# cp package/bin/codeagent-wrapper-linux-arm64 ~/.claude/bin/codeagent-wrapper

# Windows (PowerShell):
# copy package\bin\codeagent-wrapper-windows-amd64.exe $env:USERPROFILE\.claude\bin\codeagent-wrapper.exe

# 4. Set executable permission (Unix/macOS)
chmod +x ~/.claude/bin/codeagent-wrapper

# 5. Verify installation
~/.claude/bin/codeagent-wrapper --version

# 6. Clean up
rm -rf package ccg-workflow-*.tgz
```

#### Supported Platforms

| Platform | Architecture | Binary |
|----------|-------------|--------|
| macOS | Apple Silicon (ARM64) | `codeagent-wrapper-darwin-arm64` |
| macOS | Intel (x86_64) | `codeagent-wrapper-darwin-amd64` |
| Linux | ARM64 | `codeagent-wrapper-linux-arm64` |
| Linux | x86_64 | `codeagent-wrapper-linux-amd64` |
| Windows | ARM64 | `codeagent-wrapper-windows-arm64.exe` |
| Windows | x86_64 | `codeagent-wrapper-windows-amd64.exe` |

### Configuration

#### Permission Whitelist

Add codeagent-wrapper to Claude Code's permission whitelist in `~/.claude/settings.json` to avoid confirmation prompts:

```jsonc
{
  "permissions": {
    "allow": [
      "Bash(~/.claude/bin/codeagent-wrapper --backend codex*)",
      "Bash(~/.claude/bin/codeagent-wrapper --backend gemini*)"
    ]
  }
}
```

#### MCP Servers

During `ccg-scholar init`, you can select MCP servers to install:

| MCP | Purpose | Use Case |
|-----|---------|----------|
| **Zotero** | Citation manager integration | Literature survey, citation verification |
| **Context7** | Real-time documentation retrieval | Latest framework docs |
| **Playwright** | Browser automation | Web data collection |
| **DeepWiki** | Repository knowledge retrieval | Understanding open-source projects |
| **Exa** | AI semantic search engine | Deep search (requires API key) |
| **AceTool + ContextWeaver** | Code retrieval tools | Code search and context |

Configure later with:

```bash
ccg-scholar mcp
```

### Usage

Open Claude Code and use slash commands:

```
/ccg-scholar:literature-review attention mechanisms in multimodal learning
/ccg-scholar:experiment-plan design ablation study for transformer variants
/ccg-scholar:paper-write write introduction section
/ccg-scholar:rebuttal respond to reviewer 2 comments
```

### Command Reference

| Category | Commands |
|----------|---------|
| **Literature** (6) | `research-init`, `literature-review`, `gap-analysis`, `paper-scan`, `citation-check`, `daily-paper` |
| **Paper** (5) | `paper-structure`, `paper-write`, `paper-review`, `writing-polish`, `anti-ai-check` |
| **Experiment** (4) | `experiment-plan`, `experiment-code`, `analyze-results`, `visualize` |
| **Rebuttal** (3) | `rebuttal`, `rebuttal-review`, `review-response` |
| **Post-acceptance** (3) | `presentation`, `poster`, `promote` |
| **Utility** (4) | `commit`, `init`, `update-readme`, `checkpoint` |
| **Team** (3) | `team-research`, `team-write`, `team-review` |

All commands are prefixed with `/ccg-scholar:` in Claude Code.

### Model Routing

| Task | Primary Model | Strategy |
|------|--------------|----------|
| Literature Search | Gemini | Large-scale paper scanning |
| Deep Analysis | Claude | Methodology evaluation |
| Experiment Code | Codex | ML training scripts |
| Data Visualization | Gemini | Publication-quality figures |
| Paper Writing | Claude | IMRaD structure writing |
| Cross Review | Codex + Gemini | Parallel multi-angle review |

### Typical Workflow: Zero to Submission

```
/ccg-scholar:research-init       → Set up project
/ccg-scholar:literature-review   → Gemini scans + Claude analyzes
/ccg-scholar:gap-analysis        → Identify research gaps
/ccg-scholar:experiment-plan     → Design experiments
/ccg-scholar:experiment-code     → Codex generates training code
/ccg-scholar:analyze-results     → Statistical analysis + visualization
/ccg-scholar:paper-structure     → Plan IMRaD structure
/ccg-scholar:paper-write         → Claude writes + multi-model review
/ccg-scholar:anti-ai-check       → Remove AI patterns
/ccg-scholar:citation-check      → Verify citations
/ccg-scholar:rebuttal            → Multi-model rebuttal
/ccg-scholar:presentation        → Prepare conference talk
```

### CLI Commands

```bash
ccg-scholar              # Interactive menu
ccg-scholar init         # Install workflows (first-time setup)
ccg-scholar mcp          # Configure MCP servers
ccg-scholar diagnose     # Diagnose configuration
ccg-scholar update       # Check for updates
ccg-scholar uninstall    # Uninstall all workflows
ccg-scholar --help       # Help
ccg-scholar --version    # Version
```

### Development

```bash
npm install          # Install dependencies
npx unbuild          # Build
npx tsx src/cli.ts   # Dev mode
npx tsc --noEmit     # Type check
```

### Credits

- [ccg-workflow](https://github.com/fengshao1227/ccg-workflow) — Multi-model collaboration infrastructure and codeagent-wrapper
- [claude-scholar](https://github.com/Galaxy-Dawn/claude-scholar) — Research skills, agents, and domain knowledge
- [cexll/myclaude](https://github.com/cexll/myclaude) — codeagent-wrapper binary
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — Commands / Skills / Agents framework

### License

MIT
