---
description: "论文自审清单 - 新颖性、清晰度、完整性、可复现性、格式检查"
argument-hint: "论文草稿文件路径"
---

# Paper Self-Review

Systematic self-review checklist to evaluate paper quality before submission.

## Input

Paper draft: $ARGUMENTS

## Pre-check

1. Read the paper draft from `$ARGUMENTS`
2. Identify the target venue from CLAUDE.md or paper header
3. Load venue-specific formatting requirements

## Review Dimensions

### 1. Novelty Assessment

- [ ] Is the contribution clearly stated and non-trivial?
- [ ] Does the paper differentiate from closest related work?
- [ ] Would a reviewer say "this is incremental" or "this is new"?
- [ ] Are there at least 2-3 distinct technical contributions?

```bash
~/.claude/bin/codeagent-wrapper --backend gemini --prompt "Compare the method described in this paper against the top 5 most similar published methods. Identify what is genuinely novel vs incremental improvement. Paper content: [ABSTRACT+METHOD]"
```

### 2. Clarity Assessment

- [ ] Can the abstract stand alone? (Problem, Gap, Method, Result)
- [ ] Is the introduction motivating and well-structured?
- [ ] Are all symbols defined before first use?
- [ ] Is the method section reproducible from text alone?
- [ ] Are figures self-explanatory with complete captions?
- [ ] Is the writing free of jargon overuse?

### 3. Completeness Assessment

- [ ] Are all baselines reasonable and up-to-date?
- [ ] Is there an ablation study for each component?
- [ ] Are error bars or confidence intervals reported?
- [ ] Is the related work comprehensive and fair?
- [ ] Are failure cases discussed?
- [ ] Are computational costs reported?

### 4. Reproducibility Assessment

- [ ] Are all hyperparameters specified?
- [ ] Is the dataset fully described (size, splits, preprocessing)?
- [ ] Is the training procedure detailed (optimizer, LR schedule, epochs)?
- [ ] Is code or pseudocode provided?
- [ ] Are hardware specifications mentioned?
- [ ] Can someone reproduce results in < 1 week?

### 5. Formatting Check

- [ ] Within page limit for target venue
- [ ] Correct citation format (numbered vs author-year)
- [ ] All references have complete metadata
- [ ] Figure resolution meets requirements (300+ DPI)
- [ ] Tables fit within column width
- [ ] No orphaned section headers
- [ ] Supplementary material is properly referenced

## Output

Generate `papers/reviews/self-review.md`:

```markdown
# Self-Review Report

## Overall Assessment: [Strong Accept / Accept / Borderline / Reject]

## Scores
| Dimension | Score (1-5) | Key Issue |
|-----------|-------------|-----------|
| Novelty | X | ... |
| Clarity | X | ... |
| Completeness | X | ... |
| Reproducibility | X | ... |
| Formatting | X | ... |

## Critical Issues (Must Fix Before Submission)
1. ...

## Major Issues (Strongly Recommend Fixing)
1. ...

## Minor Issues (Nice to Fix)
1. ...

## Strengths to Emphasize in Cover Letter
1. ...
```

## Rules

- Be honest and critical; a kind self-review leads to harsh external reviews
- Score relative to the target venue's acceptance standards
- Flag any potential ethical concerns (data privacy, bias, dual use)
- Suggest `/ccg-scholar:writing-polish` for clarity issues
- Suggest `/ccg-scholar:anti-ai-check` before final submission
