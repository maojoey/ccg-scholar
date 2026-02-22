---
description: "学术会议演示准备 - Claude提取要点 + Gemini设计幻灯片布局"
argument-hint: "论文文件路径或会议名称"
---

# Conference Presentation Preparation

Prepare conference presentation materials from a research paper using multi-model collaboration.

## Input

Paper or topic: $ARGUMENTS

## 多模型调用规范

Use `codeagent-wrapper` for multi-model dispatch:
- `codeagent-wrapper --backend gemini` for slide layout and visual design tasks
- `codeagent-wrapper --backend codex` for code demo preparation

## 执行工作流

### Phase 1: Claude Analyzes Paper (content-strategist role)

Claude reads the paper and extracts presentation-ready content:

1. **Load Context**:
   - Read the paper from `$ARGUMENTS`
   - Identify target venue and talk duration (default: 15 min + 5 min Q&A)
   - Check `CLAUDE.md` for presentation preferences

2. **Key Message Extraction**:
   - Core contribution (1 sentence elevator pitch)
   - Problem motivation (why should the audience care?)
   - Method intuition (explain without equations first)
   - Key results (top 3 results that tell the story)
   - Take-home message (what should the audience remember?)

3. **Story Arc Construction**:
   ```markdown
   # Presentation Story Arc
   - Hook: [Surprising fact or question] (1 min)
   - Problem: [What's broken/missing] (2 min)
   - Background: [Just enough context] (2 min)
   - Method: [Intuition first, then details] (4 min)
   - Results: [Key experiments + demos] (4 min)
   - Conclusion: [Impact + future directions] (2 min)
   ```

### Phase 2: Gemini Designs Slide Layout (presentation-designer role)

```bash
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "Design a slide deck layout for a conference presentation based on this story arc and content. For each slide provide:
- Slide number and title
- Layout type (title, content, figure, comparison, code, summary)
- Visual elements (diagrams, charts, animations)
- Text content (bullet points, max 5 per slide)
- Speaker note cues
- Color scheme and typography suggestions
Target: [DURATION] minute talk, [VENUE] style.
Content: [STORY_ARC + KEY_CONTENT]"
```

### Phase 3: Speaker Notes and Timing Guide

Claude generates detailed speaker notes:

1. **Per-Slide Notes**:
   - Exact talking points (not just bullet repetition)
   - Transition phrases between slides
   - Anticipated audience questions per section
   - Backup slides for deep-dive questions

2. **Timing Guide**:
   ```markdown
   | Slide | Topic | Duration | Cumulative | Notes |
   |-------|-------|----------|------------|-------|
   | 1     | Title | 0:30     | 0:30       | ...   |
   | 2     | Hook  | 1:00     | 1:30       | ...   |
   ```

3. **Q&A Preparation**:
   - Top 10 likely questions with prepared answers
   - Defensive points for methodology weaknesses
   - Pointer to specific slides for each question

## Output

Generate the following files:

- `papers/presentations/outline.md` - Presentation outline with story arc
- `papers/presentations/slides.md` - Slide-by-slide content specification
- `papers/presentations/speaker-notes.md` - Detailed speaker notes with timing
- `papers/presentations/qa-prep.md` - Q&A preparation guide

## 关键规则

- Keep slides minimal: prefer figures over text, max 5 bullet points per slide
- One key message per slide; if you need more, split the slide
- Ensure font sizes are readable from the back row (24pt+ for body text)
- Include slide numbers and section indicators for navigation
- Prepare 2-3 backup slides for anticipated deep questions
- Time allocation: ~1 minute per slide for a 15-minute talk
- Suggest `/ccg-scholar:visualize` for creating presentation figures
