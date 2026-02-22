---
description: "实验设计 - 假设、变量、对照、指标、计算资源预算"
argument-hint: "研究假设或实验目标描述"
---

# Experiment Planning

Design rigorous experiments with clear hypotheses, variables, controls, metrics, and compute budget.

## Input

Research hypothesis or goal: $ARGUMENTS

## Phase 1: Hypothesis Formulation

Claude helps formalize the research hypothesis:

1. **Null Hypothesis (H0)**: What we expect if our method has no effect
2. **Alternative Hypothesis (H1)**: What we expect if our method works
3. **Specific Claims**: Break into testable sub-hypotheses
   - H1a: Method X outperforms baseline Y on metric Z
   - H1b: Component A contributes more than component B
   - H1c: Method scales better with data size N

## Phase 2: Experimental Design

### Variables
| Type | Variable | Values / Range |
|------|----------|---------------|
| Independent | Method variant | Ours, Baseline1, Baseline2 |
| Independent | Dataset | D1, D2, D3 |
| Dependent | Performance metric | Accuracy, F1, BLEU |
| Controlled | Random seed | 42, 123, 456 |
| Controlled | Hardware | GPU type, memory |

### Controls
- **Baseline Selection**: Justify each baseline choice
  ```bash
  GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "For the research topic '$ARGUMENTS', identify the top 5 most appropriate baselines to compare against. Include: paper reference, whether code is available, reported results on common benchmarks. Return as structured table."
  ```
- **Ablation Plan**: Which components to ablate
- **Sanity Checks**: Trivial baselines (random, majority class)

### Metrics
- **Primary**: The single metric for the main claim
- **Secondary**: Supporting metrics for deeper analysis
- **Statistical**: Significance test choice (paired t-test, bootstrap, Wilcoxon)
- **Effect Size**: Cohen's d or equivalent

## Phase 3: Compute Budget

```bash
~/.claude/bin/codeagent-wrapper --lite --backend codex --prompt "Estimate the compute requirements for the following experiment plan:
- Model: [MODEL_DESCRIPTION]
- Dataset sizes: [SIZES]
- Number of runs: [SEEDS * VARIANTS]
- Training epochs: [EPOCHS]
- Inference: [EVAL_SETS]

Provide estimates for:
1. GPU memory per run
2. Training time per run (A100/H100/V100)
3. Total GPU hours
4. Storage requirements
5. Estimated cloud cost (AWS/GCP pricing)

Return as a resource table."
```

## Phase 4: Timeline and Milestones

```markdown
## Experiment Timeline

| Week | Task | Deliverable | Compute |
|------|------|-------------|---------|
| 1 | Data preparation | Preprocessed datasets | CPU only |
| 1 | Baseline reproduction | Verified baseline results | 8 GPU-hours |
| 2 | Main method implementation | Working training loop | 4 GPU-hours |
| 2-3 | Main experiments (3 seeds) | Result tables | 48 GPU-hours |
| 3 | Ablation studies | Ablation table | 24 GPU-hours |
| 4 | Analysis & visualization | Figures, error analysis | 4 GPU-hours |
| **Total** | | | **88 GPU-hours** |
```

## Output

Save to `plan/experiment_plan.md` with the complete experiment design.

Generate `configs/experiment/plan.yaml` with structured experiment configs:
```yaml
experiment:
  name: $ARGUMENTS
  hypotheses: [H1a, H1b, H1c]
  seeds: [42, 123, 456]
  baselines: [...]
  metrics:
    primary: accuracy
    secondary: [f1, precision, recall]
  compute_budget:
    total_gpu_hours: 88
    gpu_type: A100
```

## Rules

- Every experiment must be run with at least 3 random seeds
- Always include at least one strong and one simple baseline
- Compute budget must be realistic for available resources
- Plan for failure: include contingency for negative results
- Suggest `/ccg-scholar:experiment-code` as the next step
