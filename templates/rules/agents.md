# Agent Orchestration

## Available Agents

Located in `~/.claude/agents/ccg-scholar/`:

### Research Workflow

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| literature-reviewer | Multi-model literature search, classification, and trend analysis | Starting a new research topic, literature survey, systematic review |
| experiment-planner | Experiment design with WBS, feasibility validation | Designing experiments, planning compute/data requirements |
| paper-architect | Paper structure planning, IMRaD organization | Starting paper writing, restructuring drafts |
| rebuttal-strategist | Rebuttal strategy with multi-model technical analysis | Responding to reviewer comments, planning revisions |

## Automatic Agent Invocation

Use agents proactively without waiting for user request:

1. New research topic → **literature-reviewer**
2. Experiment design needed → **experiment-planner**
3. Paper writing started → **paper-architect**
4. Reviewer comments received → **rebuttal-strategist**

## Multi-Model Coordination

Each agent can leverage codeagent-wrapper for multi-model dispatch:
- **Gemini**: Literature scanning, data visualization, presentation design
- **Codex**: Experiment code, code review, debugging
- **Claude**: Deep analysis, paper writing, review synthesis

## Parallel Task Execution

ALWAYS use parallel Task execution for independent operations:

```markdown
# GOOD: Parallel execution
Launch 3 agents in parallel:
1. Agent 1: literature-reviewer on related work
2. Agent 2: experiment-planner for ablation study
3. Agent 3: paper-architect for results section

# BAD: Sequential when unnecessary
First agent 1, then agent 2, then agent 3
```

## Error Handling

- If an agent fails or times out, retry once before reporting to user
- Log agent errors for debugging
- Fall back to manual approach if agent is unavailable

## Multi-Perspective Analysis

For complex research problems, use split-role sub-agents:
- Methodology reviewer
- Statistical expert
- Domain specialist
- Writing quality reviewer
- Reproducibility checker
