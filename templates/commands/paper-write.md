---
description: "多模型协作论文写作 - Claude主笔 + Codex/Gemini并行审查"
argument-hint: "论文标题或写作计划文件路径"
---

# Multi-Model Paper Writing

Collaborative paper writing with Claude leading, Codex reviewing technical content, and Gemini reviewing presentation.

## Input

Paper topic or plan: $ARGUMENTS

## Phase 1: Claude Builds Outline (paper-writer role)

Claude constructs a detailed paper outline:

1. **Load Context**:
   - Read `CLAUDE.md` for research context
   - Read `papers/references/literature-review.md` for related work
   - Read `results/` for experiment results and figures
   - Read `papers/references/gap-analysis.md` for motivation

2. **Outline Construction**:
   ```markdown
   # [Paper Title]

   ## Abstract (150-250 words)
   [Problem] [Gap] [Method] [Results] [Impact]

   ## 1. Introduction (1.5 pages)
   - Hook and motivation
   - Problem definition
   - Limitations of existing approaches
   - Our contribution (3 bullet points)
   - Paper organization

   ## 2. Related Work (1-1.5 pages)
   - Category 1: [...]
   - Category 2: [...]
   - Positioning statement

   ## 3. Method (2-3 pages)
   - 3.1 Problem Formulation
   - 3.2 [Core Method Name]
   - 3.3 [Key Component]
   - 3.4 Training / Optimization

   ## 4. Experiments (2-3 pages)
   - 4.1 Setup (datasets, baselines, metrics)
   - 4.2 Main Results
   - 4.3 Ablation Study
   - 4.4 Analysis

   ## 5. Conclusion (0.5 pages)
   ```

3. **Get user approval** before proceeding to writing

## Phase 2: Claude Writes Chapter by Chapter

For each section, Claude writes the content with integrated citation verification:

1. Write section draft following the outline
2. Insert citations using `\cite{key}` format
3. For each citation used, verify with:
   ```bash
   ~/.claude/bin/codeagent-wrapper --backend gemini --prompt "Verify that paper [TITLE] by [AUTHORS] actually supports the claim: '[CLAIM]'. Return: CONFIRMED, PARTIAL, or UNSUPPORTED with explanation."
   ```
4. Mark sections needing figures/tables with `[FIGURE:description]` placeholders
5. Save each section to `papers/drafts/sections/`

## Phase 3: Parallel Review (Codex + Gemini)

Launch parallel reviews using `run_in_background`:

```bash
# Codex: Technical correctness review
~/.claude/bin/codeagent-wrapper --backend codex --prompt "Review the following paper draft for technical correctness:
- Mathematical notation consistency
- Algorithm description accuracy
- Experiment methodology soundness
- Statistical claim validity
- Code-paper alignment (if code available)
Flag issues with severity: Critical/Major/Minor.
Draft: [PAPER_CONTENT]" &

# Gemini: Presentation quality review
~/.claude/bin/codeagent-wrapper --backend gemini --prompt "Review the following paper draft for presentation quality:
- Clarity of writing and logical flow
- Figure and table effectiveness
- Abstract and introduction hook strength
- Related work completeness and fairness
- Conclusion impact and future work
Provide specific revision suggestions.
Draft: [PAPER_CONTENT]" &
```

## Phase 4: Claude Integrates Revisions

Claude processes all review feedback:

1. **Triage**: Sort suggestions by severity and impact
2. **Integrate**: Apply revisions to the draft
3. **Reconcile**: Resolve conflicting suggestions between reviewers
4. **Polish**: Final pass for language quality and consistency
5. **Output**: Save final draft to `papers/drafts/paper_v1.tex` or `paper_v1.md`

## Output

- `papers/drafts/paper_v1.tex` - Complete paper draft
- `papers/drafts/revision_log.md` - Log of all revisions applied
- `papers/drafts/figures_needed.md` - List of figures to create

## Rules

- Follow target venue formatting guidelines (page limits, citation style)
- Use hedging language appropriately ("our results suggest" not "we prove")
- Ensure every claim is supported by evidence or citation
- Maintain consistent notation throughout (define notation table)
- Do not fabricate results; use placeholder `[RESULT]` if data unavailable
- Suggest `/ccg-scholar:writing-polish` after completing the first draft
