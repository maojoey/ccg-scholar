---
description: "研究缺口分析 - Gemini扫描未研究领域 + Claude评估可行性与新颖性"
argument-hint: "研究领域或文献综述文件路径"
---

# Research Gap Analysis

Identify research gaps from existing literature and evaluate their feasibility and novelty.

## Input

Research area or literature review path: $ARGUMENTS

## Phase 1: Context Loading

1. If `$ARGUMENTS` is a file path, read the literature review document
2. If `$ARGUMENTS` is a topic, check for existing `papers/references/literature-review.md`
3. If no literature review exists, suggest running `/ccg-scholar:literature-review` first
4. Load `CLAUDE.md` for project research context

## Phase 2: Gemini Gap Scanning

Dispatch Gemini to scan for understudied areas across multiple dimensions:

```bash
# Dimension 1: Methodological gaps
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "Given the research area '$ARGUMENTS', identify methodological gaps: techniques from adjacent fields not yet applied, combinations of existing methods not explored, scalability issues unaddressed. Return structured analysis with evidence." &

# Dimension 2: Application domain gaps
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "For '$ARGUMENTS', identify application domains where this research has not been explored but could have high impact. Consider underrepresented languages, modalities, industries. Return with justification." &

# Dimension 3: Evaluation gaps
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "For '$ARGUMENTS', identify evaluation gaps: missing benchmarks, inadequate metrics, lack of human evaluation, insufficient ablation studies in existing work. Return structured analysis." &
```

## Phase 3: Claude Feasibility and Novelty Analysis

For each identified gap, Claude evaluates:

### Novelty Assessment (1-5 scale)
- 5: No prior work addresses this specific combination
- 4: Very limited prior work (1-2 papers, tangential)
- 3: Some prior work but significant open questions remain
- 2: Active area with room for incremental contribution
- 1: Well-explored, diminishing returns

### Feasibility Assessment (1-5 scale)
- 5: Can be addressed with available data, compute, and methods
- 4: Feasible with moderate effort (new dataset collection or method adaptation)
- 3: Challenging but achievable within 3-6 months
- 2: Requires significant resources or breakthroughs
- 1: Currently infeasible or requires fundamental advances

### Impact Potential (1-5 scale)
- 5: Could open a new research direction
- 4: Significant advancement for the field
- 3: Useful contribution to the community
- 2: Incremental improvement
- 1: Marginal impact

## Phase 4: Output

Generate `papers/references/gap-analysis.md`:

```markdown
# Research Gap Analysis: $ARGUMENTS

## Priority Matrix
| Gap | Novelty | Feasibility | Impact | Priority Score |
[Sorted by Priority Score = Novelty * 0.4 + Feasibility * 0.3 + Impact * 0.3]

## Top 3 Recommended Gaps

### Gap 1: [Title]
- **Description**: ...
- **Evidence**: Papers that mention but don't solve this
- **Approach Sketch**: Proposed methodology
- **Required Resources**: Data, compute, timeline
- **Risk Factors**: What could go wrong

[Repeat for Gap 2, Gap 3]

## Full Gap Inventory
[All identified gaps with brief descriptions]
```

## Rules

- Base gap identification on evidence from actual papers, not speculation
- Cross-reference with recent arXiv submissions to ensure gaps are still open
- Consider the user's compute and time constraints from CLAUDE.md
- Suggest next step: `/ccg-scholar:experiment-plan` for the top-priority gap
