---
description: "按DAG依赖分Wave并行执行任务 - 拓扑排序 + 多模型并行调度"
argument-hint: "计划文件路径 (默认 .claude/plan/tasks.json)"
---

# Team Collaborative Execution

Execute tasks from a plan DAG in topological wave order, dispatching each task to its assigned model in parallel within each wave.

## Input

Plan file: $ARGUMENTS (defaults to `.claude/plan/tasks.json`)

## 多模型调用规范

Use `codeagent-wrapper` for multi-model dispatch:
- `codeagent-wrapper --backend codex` for implementation and code tasks
- `codeagent-wrapper --backend gemini` for data preparation, visualization, and methodology tasks

## 执行工作流

### Phase 1: Load and Validate Plan

1. **Read Task DAG**:
   - Load `.claude/plan/tasks.json` (or path from `$ARGUMENTS`)
   - Load `.claude/plan/plan.md` for human-readable context
   - Parse all tasks and their dependency edges

2. **Validate DAG**:
   - Check for circular dependencies (reject if found)
   - Verify all dependency IDs reference existing tasks
   - Verify every task has a valid `assignedTo` field
   - Count total tasks and expected waves
   - Report: "Plan loaded: N tasks across M waves"

3. **Initialize Execution Log**:
   - Create `.claude/plan/exec-log.md` with header and plan summary
   - Record start timestamp

### Phase 2: Wave Execution Loop

Execute waves sequentially; tasks within each wave run in parallel:

```
while there are pending tasks:
    1. Find all tasks where ALL dependencies are "completed" → current wave
    2. Log: "=== Wave N: K tasks ==="
    3. For each task in the current wave, dispatch based on assignedTo:
       - codex tasks → codeagent-wrapper --backend codex (run_in_background)
       - gemini tasks → codeagent-wrapper --backend gemini (run_in_background)
       - claude tasks → Claude handles directly (can parallelize with Task tool)
    4. Wait for all tasks in the wave to complete
    5. Collect outputs from each task
    6. Mark tasks as "completed" in the DAG
    7. Log results and any errors to exec-log.md
    8. If any task failed:
       - Log the failure with error details
       - Check if downstream tasks can still proceed
       - Mark blocked downstream tasks as "blocked"
    9. Proceed to next wave
```

#### Dispatching Codex Tasks

```bash
# For each codex task in the current wave
~/.claude/bin/codeagent-wrapper --lite --backend codex --prompt "## Task: [TASK_TITLE]

### Context
[TASK_DESCRIPTION]

### Dependencies Completed
[LIST_OF_COMPLETED_DEPENDENCY_OUTPUTS]

### Expected Output
[TASK_OUTPUTS]

### Instructions
Complete this task and return the results. If you produce code, ensure it is complete and runnable.
If you produce analysis, format it as structured markdown." &
```

#### Dispatching Gemini Tasks

```bash
# For each gemini task in the current wave
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "## Task: [TASK_TITLE]

### Context
[TASK_DESCRIPTION]

### Dependencies Completed
[LIST_OF_COMPLETED_DEPENDENCY_OUTPUTS]

### Expected Output
[TASK_OUTPUTS]

### Instructions
Complete this task and return the results. For data analysis, include methodology details.
For visualizations, provide complete reproducible code." &
```

#### Handling Claude Tasks

Claude executes its assigned tasks directly within the conversation context, leveraging full access to the codebase and prior outputs. For multiple Claude tasks in the same wave, use the Task tool to parallelize.

### Phase 3: Integration and Verification

After all waves complete, Claude performs integration:

1. **Collect All Outputs**:
   - Gather output files and artifacts from all completed tasks
   - Organize by category (code, data, analysis, writing)

2. **Consistency Check**:
   - Verify cross-task references are valid (e.g., code matches method description)
   - Check for naming conflicts or duplicate definitions
   - Ensure evaluation metrics are consistent across experiment tasks

3. **Gap Detection**:
   - Identify any uncompleted or blocked tasks
   - Check if all planned outputs were actually produced
   - Flag missing artifacts that downstream work (e.g., paper writing) would need

4. **Generate Execution Summary**:
   - Update `.claude/plan/tasks.json` with final status for all tasks
   - Finalize `.claude/plan/exec-log.md` with completion summary

## Output

- `.claude/plan/exec-log.md` — Execution log with:
  ```markdown
  # Execution Log

  - **Plan**: [topic]
  - **Started**: [timestamp]
  - **Completed**: [timestamp]
  - **Tasks**: X/Y completed (Z blocked, W failed)

  ## Wave 1
  | Task ID | Title | Assigned To | Status | Duration | Output |
  |---------|-------|-------------|--------|----------|--------|

  ## Wave 2
  ...

  ## Summary
  - Completed tasks: [list]
  - Failed tasks: [list with error details]
  - Blocked tasks: [list with blocking reason]
  - Key outputs produced: [list of artifacts]
  ```
- `.claude/plan/tasks.json` — Updated with execution status for each task
- Task output files as specified in each task's `outputs` field

## 关键规则

- NEVER execute tasks out of dependency order; always respect the DAG
- Tasks within the same wave MUST be dispatched in parallel, not sequentially
- If a task fails, do NOT automatically retry — log the failure and skip dependent tasks
- Claude is the orchestrator; it reads outputs and passes context between waves
- Each dispatched task must receive the outputs of its completed dependencies as context
- Keep the execution log updated in real-time as waves complete
- If `tasks.json` is missing or invalid, abort and instruct the user to run `/ccg-scholar:team-plan` first
- Do not modify the original plan — only update task `status` fields in `tasks.json`
- For long-running tasks (training, large data processing), use `run_in_background` and monitor
- After execution, suggest next steps: `/ccg-scholar:team-write` for paper drafting or `/ccg-scholar:team-review` for review
