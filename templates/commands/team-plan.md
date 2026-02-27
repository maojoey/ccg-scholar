---
description: "多模型并行制定研究/实验计划 - Codex技术架构 + Gemini方法论 + Claude研究策略"
argument-hint: "研究主题或 team-research 产出目录路径"
---

# Team Collaborative Planning

Generate a unified research and experiment plan using parallel multi-model collaboration. Each model contributes its specialized perspective, then Claude synthesizes a task DAG for execution.

## Input

Research topic or context: $ARGUMENTS

## 多模型调用规范

Use `codeagent-wrapper` for multi-model dispatch:
- `codeagent-wrapper --backend codex` for technical implementation planning (code architecture, tech stack, complexity estimation)
- `codeagent-wrapper --backend gemini` for methodology planning (experiment design, controls, data requirements, evaluation metrics)

## 执行工作流

### Phase 1: Context Gathering (Claude)

Before planning, Claude collects all available research context:

1. **Load Research Outputs** (if available):
   - `papers/references/literature-review.md` — prior literature review
   - `papers/references/gap-analysis.md` — identified research gaps
   - `papers/references/code-repos.md` — existing implementations catalog
   - `papers/references/research-landscape.md` — research landscape map
   - `CLAUDE.md` — project context and conventions

2. **Summarize Key Inputs**:
   - Research topic and scope
   - Identified gaps and opportunities
   - Available baselines and datasets
   - Resource constraints (compute, data, timeline)

3. **Define Planning Scope**:
   - Clarify the objective: paper submission, prototype, benchmark, etc.
   - Identify key decision points that each model should address
   - Prepare a shared context brief to send to Codex and Gemini

### Phase 2: Parallel Planning (Codex + Gemini + Claude)

Dispatch three parallel planning tasks with shared context:

```bash
# Codex: Technical Implementation Plan
~/.claude/bin/codeagent-wrapper --lite --backend codex --prompt "You are a Technical Architect for ML research.

## Context
[INSERT_CONTEXT_BRIEF]

## Your Task
Create a technical implementation plan covering:

1. **Code Architecture**: Module structure, class hierarchy, key interfaces
2. **Tech Stack Selection**: Framework (PyTorch/JAX), libraries, tools with justification
3. **Complexity Estimation**: Lines of code, development effort (person-days) per component
4. **Technical Risks**: Potential blockers, compatibility issues, scalability concerns
5. **Infrastructure**: GPU requirements, storage, CI/CD pipeline needs

## Output Format
Return a JSON array of tasks:
\`\`\`json
[
  {
    \"id\": \"tech-001\",
    \"title\": \"Task title\",
    \"category\": \"implementation|infrastructure|testing\",
    \"description\": \"Detailed description\",
    \"assignedTo\": \"codex\",
    \"estimatedEffort\": \"2d\",
    \"dependencies\": [],
    \"outputs\": [\"file or artifact produced\"],
    \"risks\": [\"potential issues\"]
  }
]
\`\`\`" &

# Gemini: Methodology & Experiment Design Plan
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "You are an Experiment Design Specialist for ML research.

## Context
[INSERT_CONTEXT_BRIEF]

## Your Task
Create a methodology and experiment plan covering:

1. **Experiment Design**: Main experiments, ablation studies, analysis experiments
2. **Dataset Selection**: Training/validation/test splits, preprocessing steps, data augmentation
3. **Baseline Selection**: Methods to compare against with justification
4. **Evaluation Protocol**: Metrics, statistical significance tests, reporting standards
5. **Ablation Strategy**: Which components to ablate, expected insights from each

## Output Format
Return a JSON array of tasks:
\`\`\`json
[
  {
    \"id\": \"exp-001\",
    \"title\": \"Task title\",
    \"category\": \"data-prep|training|evaluation|ablation|analysis\",
    \"description\": \"Detailed description\",
    \"assignedTo\": \"gemini|codex|claude\",
    \"estimatedEffort\": \"1d\",
    \"dependencies\": [],
    \"outputs\": [\"file or artifact produced\"],
    \"metrics\": [\"evaluation metrics if applicable\"]
  }
]
\`\`\`" &
```

Meanwhile, Claude produces its own **Research Strategy Plan**:

1. **Innovation Positioning**: What is novel and why it matters
2. **Paper Outline**: Target venue, section plan, page allocation
3. **Narrative Arc**: How to frame the contribution (problem → insight → method → evidence)
4. **Timeline**: Milestones from implementation to submission
5. **Risk Mitigation**: Backup plans if main approach underperforms

Claude outputs its plan as a JSON array of tasks with the same schema, using `"assignedTo": "claude"` and `"category": "writing|strategy|analysis"`.

Wait for all parallel planning tasks to complete.

### Phase 3: Plan Synthesis (Claude)

Claude merges the three plans into a unified task DAG:

1. **Collect Plans**: Gather task arrays from Codex (technical), Gemini (methodology), and Claude (strategy)

2. **Conflict Resolution**:
   - Detect overlapping tasks and merge duplicates
   - Resolve contradictions (e.g., different framework choices) — Claude makes final call
   - Align terminology and naming conventions

3. **Dependency Graph Construction**:
   - Link cross-model dependencies (e.g., Codex's "implement model" depends on Gemini's "finalize architecture spec")
   - Ensure no circular dependencies
   - Identify the critical path

4. **Wave Assignment**:
   - Topological sort all tasks
   - Group into waves: tasks with no unresolved dependencies form the next wave
   - Balance workload across models within each wave

5. **Generate Unified Plan**:
   - Write `.claude/plan/plan.md` — human-readable plan with wave breakdown
   - Write `.claude/plan/tasks.json` — machine-readable task DAG

## Output

Generate the following files:

- `.claude/plan/plan.md` — Unified research plan with:
  - Executive summary
  - Wave-by-wave task breakdown table
  - Critical path analysis
  - Resource requirements summary
  - Risk register
- `.claude/plan/tasks.json` — Task DAG in JSON format:
  ```json
  {
    "metadata": {
      "topic": "...",
      "createdAt": "ISO-8601",
      "totalTasks": 0,
      "totalWaves": 0,
      "estimatedEffort": "..."
    },
    "tasks": [
      {
        "id": "task-001",
        "title": "...",
        "category": "...",
        "description": "...",
        "assignedTo": "claude|codex|gemini",
        "wave": 1,
        "dependencies": [],
        "outputs": [],
        "status": "pending"
      }
    ]
  }
  ```

## 关键规则

- Claude is the lead planner and final decision-maker on all conflicts
- All three models must receive the same context brief for consistency
- Tasks must have clear, verifiable completion criteria in their descriptions
- Dependencies must reference actual task IDs, not vague descriptions
- Wave 1 must contain only tasks with zero dependencies
- Each task must specify `assignedTo` matching the appropriate model's strength
- The plan must be executable by `/ccg-scholar:team-exec` without human intervention
- Preserve traceability: mark each task with its originating model (codex/gemini/claude)
- If research outputs are not available, skip Phase 1 context loading and plan from the topic directly
