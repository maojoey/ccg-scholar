---
description: "论文结构规划 - IMRaD章节、图表位置、页面预算分配"
argument-hint: "论文主题或已有大纲文件路径"
---

# Paper Structure Planning

Plan detailed paper structure with section dependencies, figure/table placement, and page budget.

## Input

Paper topic or outline: $ARGUMENTS

## Phase 1: Venue and Scope Analysis

1. Determine target venue and constraints:
   - Page limit (e.g., NeurIPS: 9+refs, ICML: 9+refs, ACL: 8+refs)
   - Format (single/double column, font size)
   - Supplementary material allowance
2. Determine paper type: full paper, short paper, workshop paper

## Phase 2: IMRaD Structure Design

Claude designs the paper structure with page budget:

```markdown
# Paper Structure Plan

## Page Budget Allocation (e.g., 9 pages total)
| Section | Pages | Content Focus |
|---------|-------|---------------|
| Abstract | 0.15 | Problem, method, result, impact |
| Introduction | 1.5 | Motivation, gap, contribution |
| Related Work | 1.0 | Positioning, differentiation |
| Method | 2.5 | Core contribution detail |
| Experiments | 2.5 | Results, ablations, analysis |
| Conclusion | 0.35 | Summary, limitations, future |
| **Total** | **8.0** | (1 page buffer for refs) |

## Section Dependencies
Introduction → Related Work (defines scope)
Introduction → Method (defines problem)
Method → Experiments (defines what to test)
Related Work → Method (defines positioning)

## Writing Order (recommended)
1. Method (core contribution first)
2. Experiments (validate method)
3. Introduction (frame the story)
4. Related Work (position the work)
5. Abstract (summarize everything)
6. Conclusion (wrap up)
```

## Phase 3: Figure and Table Planning

```bash
~/.claude/bin/codeagent-wrapper --backend gemini --prompt "For a paper on '$ARGUMENTS', suggest an optimal set of figures and tables:
- Which figures are essential (method overview, main results, ablation)?
- What table format best presents comparison results?
- Where should figures be placed for maximum impact?
Return a figure/table plan with descriptions and placement."
```

### Standard Figure Set
| ID | Type | Section | Description | Size |
|----|------|---------|-------------|------|
| F1 | Method diagram | Method 3.1 | Architecture overview | full-width |
| F2 | Bar/line chart | Exp 4.2 | Main comparison results | column-width |
| F3 | Ablation table | Exp 4.3 | Component contribution | column-width |
| F4 | Qualitative | Exp 4.4 | Example outputs | full-width |

### Standard Table Set
| ID | Section | Content | Format |
|----|---------|---------|--------|
| T1 | Exp 4.1 | Dataset statistics | Compact |
| T2 | Exp 4.2 | Main results comparison | Bold-best |
| T3 | Exp 4.3 | Ablation results | Diff from base |

## Phase 4: Story Arc Design

Claude designs the narrative flow:

1. **Hook**: What grabs the reader in the first paragraph
2. **Problem**: What specific problem are we solving
3. **Tension**: Why is this problem hard / why existing methods fail
4. **Resolution**: How our method addresses the problem
5. **Evidence**: How we prove it works
6. **Impact**: Why this matters

## Output

Save to `papers/drafts/structure_plan.md` with the complete plan.

## Rules

- Page budgets must sum to within 0.5 pages of the venue limit
- Every figure must be referenced in the text
- Tables should be compact; move verbose tables to appendix
- Plan supplementary material for content that does not fit
- Suggest `/ccg-scholar:paper-write` as the next step
