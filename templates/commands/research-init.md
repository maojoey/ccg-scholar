---
description: "研究项目初始化 - 创建项目结构、生成 CLAUDE.md、配置实验追踪"
argument-hint: "研究课题名称或方向"
---

# Research Project Initialization

Initialize a structured research project with multi-model collaboration support.

## Input

Research topic or direction: $ARGUMENTS

## Phase 1: Project Structure Creation

Create the standard research project directory structure:

```
project_root/
  data/
    raw/
    processed/
    external/
  models/
    checkpoints/
    pretrained/
  results/
    figures/
    tables/
    logs/
  papers/
    drafts/
    references/
    reviews/
  configs/
    experiment/
    model/
  scripts/
    train/
    eval/
    analysis/
  notebooks/
  plan/
  temp/
```

**Actions**:
1. Create all directories listed above
2. Add `.gitkeep` to empty directories
3. Create `pyproject.toml` with project metadata and common ML dependencies
4. Create `.gitignore` for Python/ML projects (data/, checkpoints/, wandb/, etc.)

## Phase 2: Generate CLAUDE.md

Generate a project-level `CLAUDE.md` with research context:

```markdown
# [Project Name] Research Context

## Research Topic
[From $ARGUMENTS]

## Research Questions
- RQ1: [To be defined]
- RQ2: [To be defined]

## Methodology
[To be defined after literature review]

## Key Decisions Log
| Date | Decision | Rationale |

## Experiment Tracking
- Tool: Weights & Biases / TensorBoard
- Naming: {method}_{dataset}_{date}_{seed}

## File Conventions
- configs/: Hydra YAML configs
- scripts/: Entry point scripts
- results/: Auto-generated, never edit manually
```

## Phase 3: Experiment Tracking Setup

1. Initialize Git repository with `git init`
2. Create initial commit with project structure
3. Set up experiment tracking config:

```bash
# If W&B is available
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "Check if wandb is installed and suggest experiment tracking setup for a research project on: $ARGUMENTS. Output a configs/tracking.yaml template."
```

4. Generate `configs/experiment/default.yaml` with standard hyperparameter template

## Phase 4: Literature Seed

Dispatch Gemini to do a quick literature scan for initial context:

```bash
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "For the research topic '$ARGUMENTS', identify the top 5 most cited recent papers (2023-2025), list key authors, and suggest 3-5 search keywords for deeper review. Output as YAML."
```

Save output to `papers/references/initial_seed.yaml`.

## Completion

Present summary to user:
- Project structure created at `[path]`
- CLAUDE.md generated with research context
- Experiment tracking configured
- Initial literature seed saved
- Suggest next step: `/ccg-scholar:literature-review $ARGUMENTS`

## Rules

- Never overwrite existing project files without confirmation
- Always use `uv` for Python package management when available
- Follow Conventional Commits for the initial commit
- All config files use YAML format with comments explaining each field
