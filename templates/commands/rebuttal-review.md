---
description: "审稿回复草稿审查 - 提交前检查回复质量"
argument-hint: "回复草稿文件路径"
---

# Rebuttal Draft Review

Review the rebuttal draft before submission to ensure quality and completeness.

## Input

Rebuttal draft: $ARGUMENTS

## Phase 1: Load Context

1. Read the rebuttal draft from `$ARGUMENTS`
2. Read the original reviewer comments from `papers/reviews/reviewer_analysis.md`
3. Read the original paper from `papers/drafts/`
4. Read the action items from `papers/reviews/action_items.md`

## Phase 2: Completeness Check

Claude verifies every reviewer point is addressed:

- [ ] Every numbered comment from every reviewer has a response
- [ ] Every question raised is directly answered
- [ ] Every requested experiment is either done or explained why not
- [ ] Every suggested reference is acknowledged
- [ ] Positive comments are briefly acknowledged with thanks

## Phase 3: Quality Assessment

### Tone Review
- [ ] Respectful and professional throughout
- [ ] No defensive or dismissive language
- [ ] Acknowledges valid concerns genuinely
- [ ] Thanks reviewers for constructive feedback

### Evidence Review
- [ ] Claims in rebuttal are supported by data
- [ ] New experimental results include proper statistics
- [ ] References to revised sections are accurate
- [ ] Figures/tables referenced actually exist

### Persuasiveness Review

```bash
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "Evaluate the persuasiveness of this rebuttal response. For each reviewer response:
1. Would the reviewer be satisfied?
2. Is the evidence sufficient?
3. Are there logical gaps?
4. Could the response be more convincing?

Rate each response: Strong / Adequate / Weak

Rebuttal: [CONTENT]"
```

### Strategic Review
- [ ] Critical issues are addressed most thoroughly
- [ ] Minor issues are handled efficiently (not over-explained)
- [ ] Revisions are clearly highlighted for reviewers
- [ ] Overall narrative maintains paper's contribution story

## Phase 4: Format Check

- [ ] Within word/page limit for the venue's rebuttal period
- [ ] Reviewer comments are clearly quoted or referenced
- [ ] Changes are marked with color or notation
- [ ] Point-by-point format is followed consistently
- [ ] Summary of changes table is present

## Output

Generate `papers/reviews/rebuttal_review.md`:

```markdown
# Rebuttal Review Report

## Completeness: [Complete / Gaps Found]
Missing responses: [list]

## Quality Scores
| Reviewer | Response Quality | Persuasiveness | Action |
|----------|-----------------|----------------|--------|
| R1 | Strong | 4/5 | Minor edits |
| R2 | Adequate | 3/5 | Strengthen evidence |
| R3 | Strong | 5/5 | Ready |

## Recommended Revisions
1. [Specific revision suggestion with reason]
2. ...

## Ready for Submission: [Yes / After revisions]
```

## Rules

- Simulate a skeptical reviewer reading the rebuttal
- Check for inconsistencies between rebuttal claims and paper revisions
- Verify that promised changes are actually reflected in the revised paper
- Ensure the rebuttal does not introduce new claims not in the paper
- Time-box: rebuttal review should take < 30 minutes
