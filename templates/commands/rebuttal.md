---
description: "多模型协作审稿回复 - Claude分析 + Codex技术验证 + Gemini补充实验"
argument-hint: "审稿意见文件路径或粘贴的审稿内容"
---

# Multi-Model Rebuttal

Systematic rebuttal generation using multi-model collaboration.

## Input

Reviewer comments: $ARGUMENTS

## Phase 1: Claude Analyzes Reviewer Comments

Claude categorizes each reviewer concern:

### Severity Classification
- **Critical**: Fundamental methodological or correctness issues
- **Major**: Significant concerns that affect paper strength
- **Minor**: Presentation, clarity, or formatting issues
- **Positive**: Strengths acknowledged by reviewers (leverage these)

### Category Tags
- `[METHOD]`: Methodology concerns
- `[EXPERIMENT]`: Experimental design or results
- `[WRITING]`: Presentation and clarity
- `[NOVELTY]`: Originality and contribution
- `[MISSING]`: Missing references, baselines, or analysis
- `[QUESTION]`: Questions requiring clarification

### Analysis Output
```markdown
## Reviewer Analysis Summary

### Reviewer 1 (Score: X/10)
| # | Comment Summary | Severity | Category | Response Strategy |
|---|----------------|----------|----------|-------------------|
| R1.1 | ... | Critical | [METHOD] | Run additional experiment |
| R1.2 | ... | Major | [EXPERIMENT] | Provide analysis |
| R1.3 | ... | Minor | [WRITING] | Revise text |

### Common Themes Across Reviewers
1. [Theme 1]: Raised by R1, R2
2. [Theme 2]: Raised by R2, R3
```

## Phase 2: Codex Addresses Technical Concerns

For each Critical/Major technical concern:

```bash
~/.claude/bin/codeagent-wrapper --lite --backend codex --prompt "Address the following reviewer concern with technical analysis:

Concern: [REVIEWER_COMMENT]
Our method: [METHOD_DESCRIPTION]
Current results: [RESULTS]

Tasks:
1. Evaluate if the concern is valid
2. If valid: propose and implement a fix or additional experiment
3. If invalid: prepare a technical explanation with evidence
4. Estimate effort needed: [Quick fix / New experiment / Major revision]

Return: analysis, code changes (if any), and response draft."
```

## Phase 3: Gemini Prepares Additional Experiments/Visualizations

For concerns requiring new evidence:

```bash
# Additional experiments
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "Design and generate code for additional experiments to address these reviewer concerns:

[CONCERNS_REQUIRING_EXPERIMENTS]

For each concern:
1. Design a targeted experiment
2. Generate the experiment code
3. Suggest visualization for the results
4. Estimate compute time" &

# Additional visualizations
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "Create visualizations to address these reviewer concerns:

[CONCERNS_REQUIRING_FIGURES]

Generate matplotlib code for each figure needed.
Focus on clarity and directly addressing the reviewer's point." &
```

## Phase 4: Claude Drafts Point-by-Point Response

Claude compiles everything into a formal rebuttal:

```markdown
# Response to Reviewers

We thank all reviewers for their constructive feedback. We address each
comment below and have made corresponding revisions (marked in blue).

## Response to Reviewer 1

**R1.1** [Reviewer's comment in italics]

[Response: 2-4 sentences addressing the concern]
[Action taken: "We have revised Section X to..." or "We have added..."]
[Evidence: New results, analysis, or references]

**R1.2** ...

## Summary of Changes
| Change | Section | Description |
|--------|---------|-------------|
| New experiment | 4.3 | Added [X] as suggested by R1 |
| Revised text | 3.2 | Clarified [Y] as suggested by R2 |
```

## Output

- `papers/reviews/rebuttal_v1.md` - Complete rebuttal document
- `papers/reviews/reviewer_analysis.md` - Categorized analysis
- `papers/reviews/action_items.md` - Checklist of changes to make
- `scripts/rebuttal/` - Code for additional experiments

## Rules

- Be respectful and grateful in all responses, even for unfair comments
- Never dismiss a reviewer concern without substantial evidence
- Address every single point; do not skip any comment
- For experiments requested by reviewers, actually run them if feasible
- Use "we" not "I" in responses
- Keep responses concise (1 page per reviewer as target)
- Suggest `/ccg-scholar:rebuttal-review` before submission
