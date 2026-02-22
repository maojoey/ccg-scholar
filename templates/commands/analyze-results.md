---
description: "实验结果分析 - 统计检验、效应量、置信区间 + Gemini可视化"
argument-hint: "结果文件路径或实验名称"
---

# Experiment Results Analysis

Statistical analysis with significance tests, effect sizes, and confidence intervals. Gemini generates visualizations.

## Input

Results source: $ARGUMENTS

## Phase 1: Data Loading

1. Locate result files:
   - `results/logs/` for training logs (W&B, TensorBoard, CSV)
   - `results/` for evaluation outputs
   - `configs/experiment/` for experiment configurations
2. Parse results into a structured format (DataFrame)
3. Identify all experiment variants, seeds, and metrics

## Phase 2: Statistical Analysis (Claude)

### Descriptive Statistics
- Mean, std, min, max for each metric per variant
- Per-seed results table for transparency

### Significance Tests
- **Paired t-test**: When comparing two methods on same test instances
- **Bootstrap test**: When sample sizes are small or distributions unknown
- **Wilcoxon signed-rank**: Non-parametric alternative
- Report p-values with correction for multiple comparisons (Bonferroni or Holm)

### Effect Sizes
- **Cohen's d**: Standardized mean difference
- **Cliff's delta**: Non-parametric effect size
- Interpret: small (0.2), medium (0.5), large (0.8)

### Confidence Intervals
- 95% CI for all reported metrics
- Bootstrap CI when parametric assumptions are questionable

### Results Table Generation
```markdown
| Method | Metric1 (mean +/- std) | Metric2 | p-value vs Ours |
|--------|----------------------|---------|-----------------|
| Ours   | **85.3 +/- 0.4**    | ...     | -               |
| Base1  | 83.1 +/- 0.6        | ...     | 0.003**         |
| Base2  | 82.7 +/- 0.8        | ...     | 0.001***        |
```

## Phase 3: Gemini Visualization

Dispatch Gemini to generate publication-quality figures:

```bash
# Main results visualization
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "Generate Python matplotlib/seaborn code to create publication-quality figures for the following experiment results:

[RESULTS_DATA]

Generate code for:
1. Main comparison bar chart with error bars (Figure 2)
2. Training curves (loss and metric vs epoch) for all methods (Figure 3)
3. Ablation results grouped bar chart (Figure 4)
4. Radar/spider chart for multi-metric comparison (optional)

Requirements:
- Use academic style (serif fonts, appropriate colors)
- Include statistical significance markers (* p<0.05, ** p<0.01, *** p<0.001)
- Output as both PDF and PNG (300 DPI)
- Use colorblind-friendly palette"
```

## Phase 4: Ablation Analysis

For each ablated component:
1. Measure performance drop when removed
2. Rank components by contribution
3. Check for interaction effects between components

```markdown
## Ablation Results
| Variant | Metric | Delta from Full | % Contribution |
|---------|--------|-----------------|----------------|
| Full model | 85.3 | - | 100% |
| w/o Component A | 83.1 | -2.2 | 42% |
| w/o Component B | 84.0 | -1.3 | 25% |
| w/o Component C | 84.5 | -0.8 | 15% |
```

## Phase 5: Error Analysis

1. Identify failure categories and their frequencies
2. Analyze examples where our method fails but baselines succeed (and vice versa)
3. Correlate failures with input characteristics

## Output

- `results/analysis/statistical_report.md` - Full statistical analysis
- `results/figures/` - Generated visualization code and figures
- `results/tables/` - LaTeX-formatted tables for the paper

## Rules

- Never cherry-pick results; report all seeds and all metrics
- Always report standard deviations, not just means
- Use appropriate statistical tests (do not use t-test with N=2)
- Figures must be reproducible from the generated code
- Report negative results honestly; they inform the community
- Suggest `/ccg-scholar:visualize` for additional custom figures
