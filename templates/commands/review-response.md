---
description: "生成正式审稿回复信 - 格式化的逐点回复文档"
argument-hint: "审稿意见文件路径"
---

# Review Response Generation

Generate a formal, structured response to reviewer comments.

## Input

Reviewer comments: $ARGUMENTS

## Phase 1: Parse Review Structure

1. Read reviewer comments from `$ARGUMENTS`
2. Identify:
   - Number of reviewers
   - Review format (numbered points, free text, structured form)
   - Overall scores and recommendations
   - Meta-reviewer comments (if any)
3. If rebuttal analysis exists at `papers/reviews/reviewer_analysis.md`, load it

## Phase 2: Response Strategy

Claude determines the response strategy for each point:

| Strategy | When to Use | Template |
|----------|-------------|----------|
| **Agree & Fix** | Valid concern, easy to address | "We thank the reviewer... We have revised..." |
| **Agree & Explain** | Valid but already addressed | "We agree... As noted in Section X..." |
| **Clarify** | Misunderstanding | "We appreciate this question. To clarify..." |
| **Provide Evidence** | Concern addressed by data | "We conducted the suggested experiment..." |
| **Respectfully Disagree** | Invalid concern | "We understand the concern. However..." |

## Phase 3: Draft Formal Response

```bash
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "Help format the following rebuttal points into a polished, professional response letter. Ensure:
1. Consistent formatting across all responses
2. Reviewer quotes are properly formatted (italicized or quoted)
3. New text/changes are clearly marked
4. References to paper sections are accurate
5. Tone is consistently respectful and grateful

Points to format: [RESPONSE_POINTS]"
```

Claude compiles the formal response document:

```markdown
# Response to Reviewer Comments

Dear Reviewers and Area Chair,

We sincerely thank all reviewers for their thorough and constructive
reviews. Below, we address each comment point by point. All modifications
in the revised manuscript are highlighted in blue.

---

## Response to Reviewer 1 (Score: X, Recommendation: Y)

We thank Reviewer 1 for the insightful comments and recognition of
[positive aspects mentioned].

> **R1.C1**: *[Quoted reviewer comment]*

**Response**: [Detailed response]

**Revision**: [Specific changes made, with section/page references]

> **R1.C2**: *[Quoted reviewer comment]*

**Response**: [Detailed response]

---

## Response to Reviewer 2 ...

---

## Summary of Revisions

| # | Revision | Section | Prompted By |
|---|----------|---------|-------------|
| 1 | Added baseline comparison with X | 4.2 | R1.C1, R2.C3 |
| 2 | Expanded method description | 3.1 | R2.C1 |
| 3 | Added statistical significance tests | 4.3 | R1.C2 |

---

Thank you again for your valuable feedback, which has substantially
improved our manuscript.

Sincerely,
The Authors
```

## Phase 4: Revision Tracking

Generate a revision checklist for modifying the paper:

```markdown
## Paper Revision Checklist

### Must Do (from Critical/Major comments)
- [ ] Add baseline X comparison (R1.C1) → Section 4.2
- [ ] Expand method explanation (R2.C1) → Section 3.1

### Should Do (from Minor comments)
- [ ] Fix typo on page 3 (R3.C5) → Section 2
- [ ] Add reference Y (R1.C4) → Section 2

### Already Done
- [x] Clarified notation (addressed in response)
```

## Output

- `papers/reviews/response_letter.md` - Formal response document
- `papers/reviews/revision_checklist.md` - Actionable revision list
- `papers/reviews/revision_diff.md` - Summary of all paper changes

## Rules

- Match the response format to the venue's expected rebuttal style
- Number responses consistently (R1.C1, R1.C2, R2.C1, etc.)
- Every response must have both a textual reply AND a concrete action
- Keep individual responses focused (3-5 sentences typical)
- Cross-reference related comments from different reviewers
- Include page/line numbers for all revision references
