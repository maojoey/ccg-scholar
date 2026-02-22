---
description: "研究检查点 - 总结进度、记录实验、生成进展报告"
argument-hint: "检查点标签或日期（可选）"
---

# Research Checkpoint

Summarize current research progress, catalog completed experiments, list pending tasks, and generate a progress report.

## Input

Checkpoint label: $ARGUMENTS (defaults to current date)

## 执行工作流

### Phase 1: Gather Project State

1. **Read Project Context**:
   - Read `CLAUDE.md` for research objectives and current status
   - Read previous checkpoints in `docs/checkpoints/` for history
   - Check `git log --oneline -30` for recent activity

2. **Scan Experiment Results**:
   - Read `results/` directory for completed experiments
   - Read `experiments/` for experiment configurations and logs
   - Extract key metrics, model performance, and comparison baselines
   - Identify best-performing configuration

3. **Scan Code Changes**:
   - `git diff --stat` against last checkpoint tag (if exists)
   - Count new files, modified files, deleted files
   - Identify major code additions or refactors

4. **Check Paper Progress**:
   - Scan `papers/drafts/` for draft status
   - Check `papers/references/` for literature review completeness
   - Note any reviewer feedback or rebuttal status

### Phase 2: Summarize Progress

Claude synthesizes all gathered information into a structured report:

1. **Research Objectives Status**:
   - For each objective in `CLAUDE.md`, assess: Completed / In Progress / Not Started / Blocked

2. **Experiment Summary Table**:
   ```markdown
   | # | Experiment | Config | Status | Key Metric | Result | Date |
   |---|-----------|--------|--------|-----------|--------|------|
   | 1 | Baseline  | base.yaml | Done | Accuracy | 82.3% | 2025-01-15 |
   | 2 | +Attention | attn.yaml | Done | Accuracy | 85.1% | 2025-01-20 |
   | 3 | +DataAug  | aug.yaml | Running | - | - | - |
   ```

3. **Key Findings**:
   - What worked and what did not
   - Surprising results or unexpected observations
   - Hypotheses confirmed or rejected

4. **Blockers and Risks**:
   - Current blockers preventing progress
   - Technical risks or uncertainties
   - Resource constraints (compute, data, time)

### Phase 3: Generate Progress Report

Create a checkpoint document:

```markdown
# Research Checkpoint: $ARGUMENTS

**Date**: [current date]
**Previous Checkpoint**: [last checkpoint date]
**Period**: [days since last checkpoint]

## Executive Summary
[3-5 sentences: what happened, what was achieved, what is next]

## Objectives Progress
| Objective | Status | Progress | Notes |
|-----------|--------|----------|-------|

## Completed Since Last Checkpoint
- [list of completed tasks and experiments]

## Experiment Results
[summary table with key metrics]

## Key Findings
1. ...

## Pending Tasks
- [ ] [task 1 with priority]
- [ ] [task 2 with priority]

## Blockers
- [blocker with suggested resolution]

## Next Steps (Priority Order)
1. [most important next action]
2. [second priority]
3. [third priority]

## Resource Usage
- Compute hours used: [estimate]
- Storage used: [estimate]
```

### Phase 4: Save and Update

1. Save checkpoint to `docs/checkpoints/checkpoint-$ARGUMENTS.md`
2. Update `CLAUDE.md` with current status
3. Create git tag: `checkpoint-$ARGUMENTS`

```bash
git add docs/checkpoints/checkpoint-$ARGUMENTS.md
git commit -m "docs(checkpoint): research progress checkpoint $ARGUMENTS"
git tag checkpoint-$ARGUMENTS
```

## Output

- `docs/checkpoints/checkpoint-$ARGUMENTS.md` - Full progress report
- Updated `CLAUDE.md` with current status section
- Git tag `checkpoint-$ARGUMENTS` for easy reference

## 关键规则

- Be honest about progress; do not inflate results or downplay blockers
- Always compare against the previous checkpoint to show trajectory
- Include quantitative metrics wherever possible, not just qualitative statements
- Checkpoints should be self-contained; a new collaborator should understand the project state
- Save checkpoints regularly (at least weekly during active research)
- Use ISO 8601 date format (YYYY-MM-DD) for checkpoint labels if no label is provided
