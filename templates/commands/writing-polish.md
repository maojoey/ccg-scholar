---
description: "学术写作润色 - 语法、术语、语气缓和、过渡句优化"
argument-hint: "论文草稿文件路径或具体段落"
---

# Academic Writing Polish

Improve academic writing quality: grammar, terminology, hedging, and transitions.

## Input

Text to polish: $ARGUMENTS

## Phase 1: Load Content

1. If file path: read the full document
2. If text passage: work on the provided text directly
3. Identify the language (English assumed unless otherwise specified)
4. Identify target venue style (from CLAUDE.md or document header)

## Phase 2: Multi-Dimension Polish

### Grammar and Style
- Fix grammatical errors without changing technical meaning
- Correct subject-verb agreement, tense consistency
- Remove redundant words and phrases
- Fix dangling modifiers and ambiguous pronouns
- Ensure parallel structure in lists and enumerations

### Academic Terminology
- Replace informal language with academic equivalents
  - "a lot of" -> "numerous" or "substantial"
  - "get" -> "obtain" / "achieve"
  - "show" -> "demonstrate" / "illustrate" / "indicate"
  - "big" -> "significant" / "substantial" / "considerable"
- Ensure field-specific terminology is used correctly
- Maintain consistency in term usage throughout

### Hedging Language
- Add appropriate hedging where claims are not fully proven:
  - "X improves Y" -> "X tends to improve Y" / "Our results suggest X improves Y"
  - "This proves" -> "This provides evidence that" / "This indicates"
- Remove over-hedging where evidence is strong:
  - "It might potentially be possible that" -> "Our experiments indicate that"
- Calibrate confidence level to match evidence strength

### Transition Optimization
- Add transitions between paragraphs for logical flow
- Use appropriate connectors:
  - Contrast: "However", "In contrast", "Nevertheless"
  - Addition: "Furthermore", "Moreover", "In addition"
  - Causation: "Therefore", "Consequently", "As a result"
  - Sequence: "First", "Subsequently", "Finally"
- Ensure each paragraph has a clear topic sentence

### Conciseness
- Eliminate wordiness and redundancy
- "In order to" -> "To"
- "Due to the fact that" -> "Because"
- "It is important to note that" -> remove or "Notably,"
- Target: reduce word count by 10-15% without losing content

## Phase 3: Section-Specific Polish

```bash
~/.claude/bin/codeagent-wrapper --backend gemini --prompt "Review the following academic text for:
1. Sentences that sound AI-generated or unnatural
2. Overuse of specific phrases
3. Passive voice overuse (flag if >40% of sentences)
4. Sentence length variation (flag if too uniform)

Text: [CONTENT]

Return specific suggestions with line references."
```

## Output

Provide the polished text with:
1. Track-changes style diff (original -> revised)
2. Summary of changes by category
3. Word count comparison (before/after)

If full document, save polished version to `papers/drafts/paper_polished.tex`

## Rules

- Never change the technical content or meaning
- Preserve all citations, equations, and references
- Maintain the author's voice while improving quality
- Do not over-polish to the point of sounding robotic
- Flag sentences that may trigger AI detection as a separate category
- Suggest `/ccg-scholar:anti-ai-check` after polishing
