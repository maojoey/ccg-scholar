---
description: "Git提交工作流 - 遵循Conventional Commits规范"
argument-hint: "可选的提交信息或范围描述"
---

# Git Commit Workflow

Standard git commit following Conventional Commits convention.

## Input

Optional commit context: $ARGUMENTS

## 执行工作流

### Step 1: Check Repository Status

```bash
git status
git diff --stat
```

Review all staged and unstaged changes. Identify the scope and nature of modifications.

### Step 2: Review Changes in Detail

```bash
git diff
git diff --cached
```

Understand what changed and why. Group related changes logically.

### Step 3: Stage Changes

Stage files selectively by relevance:

```bash
git add <specific-files>
```

- Prefer staging specific files over `git add -A`
- Do NOT stage files containing secrets (`.env`, credentials, API keys)
- Do NOT stage large binary files or datasets unless intentional
- Group related changes into a single commit

### Step 4: Generate Commit Message

Follow Conventional Commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature or capability
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, no code change
- `refactor`: Code restructuring, no behavior change
- `test`: Adding or modifying tests
- `chore`: Build, config, dependency updates
- `exp`: Experiment-related changes (data, configs, results)

**Examples**:
```
feat(model): add attention mechanism to encoder
fix(dataloader): resolve memory leak in batch prefetch
exp(ablation): run ablation study on dropout rates
docs(readme): update installation instructions
```

### Step 5: Commit

```bash
git commit -m "<type>(<scope>): <description>"
```

Verify with `git log --oneline -3` after committing.

## 关键规则

- One logical change per commit; do not mix unrelated changes
- Commit message subject line under 72 characters
- Use imperative mood in the description ("add" not "added")
- Never commit secrets, credentials, or large data files
- If `$ARGUMENTS` is provided, use it as context for the commit message
- Run `git status` after committing to confirm clean state
