---
description: "多模型协作审稿 - 多角度并行审查 + 综合评审意见"
argument-hint: "待审查的论文草稿文件路径"
---

# Team Collaborative Review

Conduct a multi-model parallel review of a manuscript, with each model reviewing from a different specialized angle, then synthesize all feedback into a unified review.

## Input

Manuscript to review: $ARGUMENTS

## 多模型调用规范

Use `codeagent-wrapper` for multi-model dispatch:
- `codeagent-wrapper --backend gemini` for presentation, figures, and formatting review
- `codeagent-wrapper --backend codex` for code correctness and algorithm verification

## 执行工作流

### Phase 1: Pre-Review Setup

1. **Load Manuscript**:
   - Read the paper draft from `$ARGUMENTS`
   - Identify target venue and its review criteria
   - Load venue-specific formatting requirements
   - Read `CLAUDE.md` for project context

2. **Prepare Review Prompts**:
   - Extract paper content into sections for targeted review
   - Prepare context package for each reviewer model

### Phase 2: Multi-Model Parallel Review

Dispatch all three review perspectives in parallel using `run_in_background`:

```bash
# Claude: Methodology and Logic Review (reviewer-methodology role)
# [Claude reviews directly in the main thread after dispatching others]

# Codex: Code and Algorithm Correctness Review
~/.claude/bin/codeagent-wrapper --backend codex --prompt "Review this paper draft as a technical reviewer focusing on CODE and ALGORITHM correctness:

1. Algorithm Analysis:
   - Are all algorithms correctly specified? (termination, correctness, complexity)
   - Are there edge cases not handled?
   - Does the pseudocode match the described method?

2. Mathematical Verification:
   - Check equation derivations for errors
   - Verify mathematical notation consistency
   - Check dimensionality of tensor operations

3. Implementation Concerns:
   - Could the method be implemented from the paper alone?
   - Are there numerical stability concerns?
   - Are computational complexity claims accurate?

4. Reproducibility:
   - Are all hyperparameters specified?
   - Is the experimental setup fully described?
   - Are random seeds and variance reporting adequate?

Rate each aspect: [Strong/Acceptable/Weak/Critical Issue]
For each issue, provide: location, severity, description, suggested fix.

Paper content: [PAPER_CONTENT]" &

# Gemini: Figures, Presentation, and Formatting Review
~/.claude/bin/codeagent-wrapper --backend gemini --prompt "Review this paper draft as a reviewer focusing on PRESENTATION and VISUAL quality:

1. Figure Quality:
   - Are all figures necessary and informative?
   - Are figures self-explanatory with complete captions?
   - Is the resolution and font size publication-ready?
   - Is the color scheme accessible (color-blind safe)?

2. Table Quality:
   - Are tables well-organized and easy to read?
   - Are the best results properly highlighted?
   - Do tables have appropriate captions and column headers?

3. Writing Clarity:
   - Is the abstract complete (problem, gap, method, result)?
   - Is the introduction motivating?
   - Are there unclear or ambiguous passages?
   - Is the paper well-organized with logical flow?

4. Formatting Compliance:
   - Page limit adherence
   - Citation format correctness
   - Reference completeness (no missing fields)
   - Section numbering and cross-references

Rate each aspect: [Strong/Acceptable/Weak/Critical Issue]
For each issue, provide: location, severity, description, suggested fix.

Paper content: [PAPER_CONTENT]" &
```

### Phase 3: Claude Reviews Methodology and Logic

While Codex and Gemini run in parallel, Claude performs its own review:

1. **Novelty Assessment**:
   - Is the contribution genuinely novel or incremental?
   - How does it differ from the closest related work?
   - Are the claims proportional to the evidence?

2. **Methodology Soundness**:
   - Is the problem well-formulated?
   - Are assumptions clearly stated and reasonable?
   - Is the proposed method technically sound?
   - Are there logical gaps in the reasoning?

3. **Experimental Rigor**:
   - Are baselines appropriate and up-to-date?
   - Are datasets and metrics well-chosen?
   - Is the evaluation comprehensive (ablations, analysis)?
   - Are results statistically significant?

4. **Related Work Fairness**:
   - Is the literature coverage comprehensive?
   - Are comparisons fair and accurate?
   - Are recent concurrent works acknowledged?

### Phase 4: Synthesize All Reviews

Claude collects all three reviews and produces a unified assessment:

1. **Merge and Deduplicate**:
   - Combine issues from all three reviewers
   - Merge duplicate findings (same issue flagged by multiple models)
   - Strengthen confidence for issues flagged by multiple reviewers

2. **Triage by Severity**:
   ```markdown
   ## Critical Issues (Must fix before submission)
   [Issues that would cause desk rejection or strong reject]

   ## Major Issues (Strongly recommend fixing)
   [Issues that significantly weaken the paper]

   ## Minor Issues (Nice to fix)
   [Issues that improve quality but are not deal-breakers]

   ## Suggestions (Optional improvements)
   [Ideas for strengthening the paper further]
   ```

3. **Unified Review Score**:
   ```markdown
   | Dimension | Claude | Codex | Gemini | Consensus |
   |-----------|--------|-------|--------|-----------|
   | Novelty | X/5 | - | - | X/5 |
   | Soundness | X/5 | X/5 | - | X/5 |
   | Clarity | X/5 | - | X/5 | X/5 |
   | Significance | X/5 | - | - | X/5 |
   | Reproducibility | X/5 | X/5 | - | X/5 |
   | Presentation | - | - | X/5 | X/5 |
   | **Overall** | | | | **X/5** |
   ```

4. **Recommendation**: Strong Accept / Accept / Borderline / Reject / Strong Reject

## Output

Generate the following files:

- `papers/reviews/team-review-unified.md` - Synthesized review with all findings
- `papers/reviews/review-methodology.md` - Claude's methodology review
- `papers/reviews/review-technical.md` - Codex's technical review
- `papers/reviews/review-presentation.md` - Gemini's presentation review
- `papers/reviews/action-items.md` - Prioritized list of revisions to make

## 关键规则

- Be constructive: every criticism must come with a suggested fix
- Be specific: reference exact sections, equations, figures, and line numbers
- Issues flagged by multiple models should be treated with higher confidence
- Distinguish between objective errors and subjective preferences
- Do not soften critical issues; honest feedback prevents harsh external reviews
- After review, suggest `/ccg-scholar:writing-polish` for clarity issues
- After fixing all issues, suggest `/ccg-scholar:anti-ai-check` before submission
- Keep the unified review under 2000 words; link to detailed sub-reviews for depth
