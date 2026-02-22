---
description: "自动更新README文档 - 扫描项目结构并生成文档"
argument-hint: "项目根目录路径（可选）"
---

# Update README Documentation

Scan the project structure and codebase to generate or update the README file with accurate, current information.

## Input

Project path: $ARGUMENTS (defaults to current directory)

## 执行工作流

### Phase 1: Scan Project Structure and Code

1. **Directory Scan**:
   ```bash
   find . -type f -not -path './.git/*' -not -path './node_modules/*' -not -path './__pycache__/*' | head -200
   ```

2. **Key File Detection**:
   - `CLAUDE.md` - Project context
   - `setup.py` / `pyproject.toml` / `package.json` - Project metadata
   - `requirements.txt` / `environment.yml` - Dependencies
   - `Makefile` / `Dockerfile` - Build and run configurations
   - `configs/` - Configuration files
   - `results/` - Experiment results

3. **Code Analysis**:
   - Read main entry points (e.g., `src/`, `main.py`, `train.py`)
   - Extract public API or CLI interface
   - Identify key classes and functions
   - Detect supported arguments and options

4. **Results Detection**:
   - Scan `results/` for latest experiment outcomes
   - Check for result tables, figures, and metrics
   - Read experiment logs for best performance numbers

### Phase 2: Generate README Sections

Update or create the following sections:

```markdown
# [Project Title]

[One-line description from CLAUDE.md or package metadata]

## Overview
[2-3 paragraph project description]

## Installation

### Prerequisites
[Detected from environment files]

### Setup
```bash
# Installation commands derived from setup.py/requirements.txt
```

## Usage

### Quick Start
```bash
# Most common use case
```

### Training
```bash
# Training commands from scripts/ or Makefile
```

### Evaluation
```bash
# Evaluation commands
```

## Project Structure
```
[Auto-generated tree from directory scan]
```

## Results

| Experiment | Dataset | Metric | Score |
|-----------|---------|--------|-------|
[Populated from results/ directory]

## Configuration

[Key configuration options from configs/]

## Citation

```bibtex
[From papers/ if available]
```

## License

[Detected from LICENSE file]
```

### Phase 3: Merge with Existing README

If a README already exists:

1. Read the existing README
2. Preserve manually written sections (marked with `<!-- manual -->` comments)
3. Update auto-generated sections with fresh data
4. Highlight sections that have significant changes
5. Show a diff summary to the user before overwriting

## Output

- Updated `README.md` in the project root
- `docs/readme-changelog.md` - Log of what changed in this update

## 关键规则

- Never delete manually written content in an existing README
- Use `<!-- auto-generated -->` comments to mark sections that can be safely updated
- Results section should reflect the latest experiment data, not stale numbers
- Installation instructions must be verified by checking actual dependency files
- Include badges where appropriate (build status, license, Python version)
- Keep the README concise; link to `docs/` for detailed documentation
- If no results are available yet, include a placeholder section
