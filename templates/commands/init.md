---
description: "研究项目初始化 - 创建标准目录结构和配置文件"
argument-hint: "项目名称或研究主题"
---

# Research Project Initialization

Create a standardized research project structure with experiment directories, configuration files, and documentation templates.

## Input

Project name or topic: $ARGUMENTS

## 执行工作流

### Phase 1: Create Project Directory Structure

```
$ARGUMENTS/
├── CLAUDE.md                  # Project context for AI assistants
├── README.md                  # Project overview
├── .gitignore                 # Git ignore rules
├── configs/                   # Experiment configurations
│   ├── base.yaml              # Base configuration
│   └── experiments/           # Per-experiment configs
├── data/                      # Data directory
│   ├── raw/                   # Original unprocessed data
│   ├── processed/             # Preprocessed data
│   └── README.md              # Data documentation
├── src/                       # Source code
│   ├── models/                # Model definitions
│   ├── data/                  # Data loading and processing
│   ├── training/              # Training loops and utilities
│   ├── evaluation/            # Evaluation metrics and scripts
│   └── utils/                 # Shared utilities
├── scripts/                   # Run scripts
│   ├── train.sh               # Training launch script
│   └── eval.sh                # Evaluation launch script
├── experiments/               # Experiment tracking
│   └── .gitkeep
├── results/                   # Experiment results
│   ├── figures/               # Generated figures
│   ├── tables/                # Generated tables
│   └── logs/                  # Training logs
├── papers/                    # Paper-related files
│   ├── drafts/                # Paper drafts
│   ├── references/            # Literature review and BibTeX
│   ├── figures/               # Publication-quality figures
│   └── presentations/         # Slides and posters
├── notebooks/                 # Jupyter notebooks
│   └── exploration.ipynb      # Initial data exploration
├── tests/                     # Unit tests
│   └── .gitkeep
└── docs/                      # Additional documentation
    ├── checkpoints/           # Research progress checkpoints
    └── notes/                 # Research notes
```

### Phase 2: Initialize Configuration Files

1. **CLAUDE.md**: Generate project context file
   ```markdown
   # Project: $ARGUMENTS
   ## Research Topic: [description]
   ## Key Objectives: [objectives]
   ## Current Status: Initialized
   ## Tech Stack: [languages, frameworks]
   ```

2. **.gitignore**: Standard research project gitignore
   - Python: `__pycache__/`, `*.pyc`, `.eggs/`
   - Data: `data/raw/`, `*.csv`, `*.parquet` (large files)
   - Models: `*.pt`, `*.ckpt`, `*.h5` (model weights)
   - Environment: `.env`, `wandb/`, `.vscode/`
   - OS: `.DS_Store`, `Thumbs.db`

3. **configs/base.yaml**: Minimal base configuration template

4. **README.md**: Project README with standard sections

### Phase 3: Initialize Version Control and Tools

```bash
cd $ARGUMENTS
git init
git add .
git commit -m "chore(init): initialize research project structure"
```

### Phase 4: Post-Initialization Checklist

- [ ] Update `CLAUDE.md` with specific research context
- [ ] Configure experiment tracking (W&B, MLflow, or TensorBoard)
- [ ] Set up virtual environment or conda environment
- [ ] Install base dependencies and freeze requirements
- [ ] Run `/ccg-scholar:literature-review` to populate `papers/references/`

## Output

- Complete project directory structure
- Initialized git repository with first commit
- Template configuration and documentation files

## 关键规则

- Always create `CLAUDE.md` as the first file; it is the project's AI context anchor
- Use `.gitkeep` files to preserve empty directories in git
- Never commit large data files; use `.gitignore` to exclude them
- Directory structure should be language-agnostic but biased toward Python ML projects
- If `$ARGUMENTS` includes a specific framework (PyTorch, JAX), adapt `src/` structure accordingly
- Suggest running `/ccg-scholar:experiment-plan` after initialization
