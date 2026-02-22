---
description: "实验代码生成 - Codex编写实验代码 + Claude审查方法论"
argument-hint: "实验计划文件路径或实验描述"
---

# Experiment Code Generation

Codex writes experiment code with proper structure, Claude reviews methodology.

## Input

Experiment plan or description: $ARGUMENTS

## Phase 1: Context Loading

1. Read experiment plan from `$ARGUMENTS` or `plan/experiment_plan.md`
2. Read `CLAUDE.md` for coding conventions and framework preferences
3. Read `configs/experiment/` for existing config templates
4. Check existing code in `scripts/` for patterns to follow

## Phase 2: Codex Code Generation

Dispatch Codex to generate the experiment code:

```bash
~/.claude/bin/codeagent-wrapper --lite --backend codex --prompt "Generate a complete experiment codebase for the following plan:

[EXPERIMENT_PLAN]

Requirements:
1. Use Hydra for configuration management
2. Use PyTorch with Transformers Trainer (or custom training loop if needed)
3. Include W&B / TensorBoard logging
4. Support multi-GPU training via DDP/FSDP
5. Implement checkpoint save/resume
6. Fixed random seeds across all sources of randomness
7. Follow PEP 8, type hints on all functions

Generate these files:
- configs/experiment/default.yaml
- scripts/train/train.py (main training script)
- scripts/eval/evaluate.py (evaluation script)
- scripts/analysis/analyze.py (result analysis)
- src/model.py (model definition)
- src/data.py (dataset and dataloader)
- src/metrics.py (custom metrics)
- src/utils.py (utility functions)
- requirements.txt (pinned dependencies)
- run.sh (experiment launch script)

Provide each file with complete content."
```

## Phase 3: Claude Methodology Review

Claude reviews the generated code for methodological soundness:

1. **Training Procedure**:
   - Is the optimizer choice justified?
   - Is the learning rate schedule appropriate?
   - Are gradient clipping / weight decay properly configured?
   - Is early stopping implemented correctly?

2. **Data Pipeline**:
   - No data leakage between splits?
   - Preprocessing is consistent across train/val/test?
   - Augmentation only applied to training data?
   - Batch construction is appropriate (no bias)?

3. **Evaluation**:
   - Metrics match the experiment plan?
   - Evaluation is done on the correct split?
   - Results are averaged across seeds?
   - Statistical tests are implemented?

4. **Reproducibility**:
   - All random seeds set correctly?
   - Config captures all hyperparameters?
   - Environment is reproducible (requirements.txt)?

## Phase 4: Code Integration

1. Write generated files to the project structure
2. Apply Claude's review suggestions
3. Run a quick sanity check:

```bash
~/.claude/bin/codeagent-wrapper --lite --backend codex --prompt "Write a smoke test for the experiment code that:
1. Creates a tiny synthetic dataset (10 samples)
2. Runs 2 training steps
3. Verifies loss decreases
4. Saves and loads a checkpoint
5. Runs evaluation
Output as scripts/test/smoke_test.py"
```

## Output

- Generated code files in the project structure
- `plan/code_review.md` with Claude's methodology review
- `scripts/test/smoke_test.py` for quick validation

## Rules

- Generated code must follow the project's existing coding style
- Never hardcode file paths; use config-driven paths
- Include docstrings for all public functions and classes
- Use `uv` for dependency management when available
- All configs must have comments explaining each parameter
- Suggest running smoke test before full experiments
