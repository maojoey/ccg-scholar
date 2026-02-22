---
description: "出版级图表生成 - 训练曲线、消融表、对比图"
argument-hint: "图表类型和数据源路径"
---

# Publication-Quality Visualization

Create publication-quality figures for academic papers: training curves, ablation tables, comparison charts.

## Input

Visualization request: $ARGUMENTS

## Phase 1: Determine Requirements

1. Parse the request type:
   - `training-curves`: Loss and metric curves over epochs
   - `comparison-bar`: Bar chart comparing methods
   - `ablation-table`: Ablation study table/heatmap
   - `scatter`: Scatter plot (e.g., accuracy vs latency)
   - `confusion`: Confusion matrix heatmap
   - `attention`: Attention visualization
   - `architecture`: Model architecture diagram
   - `custom`: User-specified chart type

2. Locate data sources from `results/` or user-provided path
3. Read paper style from CLAUDE.md (venue-specific formatting)

## Phase 2: Gemini Figure Generation

```bash
~/.claude/bin/codeagent-wrapper --backend gemini --prompt "Generate Python code using matplotlib and seaborn to create a publication-quality figure:

Type: [FIGURE_TYPE]
Data: [DATA_DESCRIPTION]
Style requirements:
- Font: Serif (Times New Roman or similar), 10pt for labels, 8pt for ticks
- Colors: Use colorblind-friendly palette (tab10 or Set2)
- Size: 3.5 inches wide (single column) or 7 inches (full width)
- DPI: 300 for PNG, vector for PDF
- Grid: Light gray, dashed
- Legend: Outside plot or inside with semi-transparent background
- Error bars: Standard deviation with caps
- Statistical markers: * p<0.05, ** p<0.01, *** p<0.001
- No title (caption goes in LaTeX)
- Tight layout with minimal white space

Save as both PDF and PNG to results/figures/

Additional constraints:
- Must be self-contained (no external data loading)
- Include all data inline or via CSV loading
- Add comments explaining each styling choice"
```

## Phase 3: Standard Figure Templates

### Training Curves
```python
# Template: dual-axis (loss + metric) with multiple runs
# Shaded region for standard deviation across seeds
# Vertical line for best epoch
```

### Comparison Bar Chart
```python
# Template: grouped bars with error bars
# Statistical significance brackets
# Horizontal baseline reference line
```

### Ablation Heatmap
```python
# Template: component x metric heatmap
# Annotated cells with exact values
# Color gradient: red (worse) -> green (better)
```

### Scatter Plot (Trade-off)
```python
# Template: accuracy vs efficiency (FLOPs/params/latency)
# Point size proportional to model size
# Pareto frontier curve
```

## Phase 4: Claude Quality Review

Claude reviews generated figures for:
- [ ] All axes labeled with units
- [ ] Legend is clear and complete
- [ ] Font sizes are readable at print size
- [ ] Colors are distinguishable in grayscale
- [ ] No misleading axis scales (truncated axes flagged)
- [ ] Consistent style across all paper figures

## Output

- Python scripts saved to `scripts/analysis/plot_{figure_name}.py`
- Generated figures saved to `results/figures/`
- LaTeX figure inclusion snippet:
  ```latex
  \begin{figure}[t]
  \centering
  \includegraphics[width=\columnwidth]{figures/figure_name.pdf}
  \caption{Description.}
  \label{fig:name}
  \end{figure}
  ```

## Rules

- Always save figures in both PDF (vector) and PNG (raster) formats
- Use consistent colors for the same method across all figures
- Figure code must be fully reproducible from the saved script
- Prefer PDF for the paper (vector graphics scale better)
- Check that all text in figures is large enough when printed at column width
- Follow venue-specific figure guidelines (e.g., NeurIPS requires specific sizes)
