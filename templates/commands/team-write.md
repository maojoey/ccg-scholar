---
description: "多模型协作论文写作 - 按章节分工并行写作 + 最终合并"
argument-hint: "论文大纲文件路径或写作计划"
---

# Team Collaborative Writing

Split paper writing across multiple models by section, with each model handling its strength area, then merge and ensure consistency.

## Input

Paper outline or plan: $ARGUMENTS

## 多模型调用规范

Use `codeagent-wrapper` for multi-model dispatch:
- `codeagent-wrapper --backend gemini` for figures, visualizations, and presentation-oriented sections
- `codeagent-wrapper --backend codex` for code listings, algorithm pseudocode, and technical appendices

## 执行工作流

### Phase 1: Claude Prepares Writing Plan (lead-author role)

1. **Load Context**:
   - Read paper outline from `$ARGUMENTS`
   - Read `CLAUDE.md` for research context and conventions
   - Read `papers/references/literature-review.md` for citations
   - Read `results/` for experiment data

2. **Section Assignment**:
   ```markdown
   | Section | Assigned To | Reason | Priority |
   |---------|------------|--------|----------|
   | Abstract | Claude | Requires holistic understanding | Last |
   | Introduction | Claude | Narrative and motivation | 1 |
   | Related Work | Claude | Deep citation analysis | 2 |
   | Method (text) | Claude | Core technical writing | 1 |
   | Method (code/algo) | Codex | Algorithm formatting | 2 |
   | Experiments (text) | Claude | Result interpretation | 3 |
   | Experiments (figures) | Gemini | Visual presentation | 3 |
   | Discussion | Claude | High-level synthesis | 4 |
   | Conclusion | Claude | Concise summary | 5 |
   | Appendix (code) | Codex | Code listings | 5 |
   | Appendix (figures) | Gemini | Supplementary visuals | 5 |
   ```

3. **Shared Style Guide**:
   - Define notation conventions (symbols, abbreviations)
   - Set terminology dictionary (consistent naming)
   - Specify citation style and reference format
   - Define figure numbering and cross-reference conventions

### Phase 2: Parallel Writing (Claude + Codex + Gemini)

Claude writes its assigned sections sequentially, while dispatching parallel tasks:

```bash
# Codex: Generate algorithm pseudocode and code listings
~/.claude/bin/codeagent-wrapper --backend codex --prompt "Generate LaTeX algorithm environments for the following methods:
1. [ALGORITHM_1_DESCRIPTION]
2. [ALGORITHM_2_DESCRIPTION]

Requirements:
- Use algorithm2e or algorithmic package format
- Include line numbers
- Add comments explaining key steps
- Ensure variable names match the notation guide: [NOTATION_GUIDE]
Return complete LaTeX code blocks." &

# Gemini: Design figures and visual elements
~/.claude/bin/codeagent-wrapper --backend gemini --prompt "Design the following figures for the paper:
1. Architecture diagram: [DESCRIPTION]
2. Results comparison chart: [DATA]
3. Ablation study visualization: [DATA]

Requirements:
- Publication quality (vector format preferred)
- Consistent color scheme: [COLORS]
- Font: [FONT], minimum 8pt in final size
- Each figure should be self-explanatory with complete caption
Return figure specifications with detailed descriptions and suggested tools (matplotlib, tikz, draw.io)." &
```

Claude writes Introduction, Related Work, Method (text), Experiments (text), Discussion, and Conclusion in sequence, saving each section to `papers/drafts/sections/`.

### Phase 3: Merge and Consistency Check

Claude integrates all contributions:

1. **Collect All Sections**:
   - Claude's text sections from `papers/drafts/sections/`
   - Codex's algorithm blocks and code listings
   - Gemini's figure specifications and captions

2. **Consistency Pass**:
   - Verify notation is uniform across all sections
   - Check cross-references (`\ref{}`, `\cite{}`) resolve correctly
   - Ensure terminology is consistent (no synonyms for the same concept)
   - Verify figure/table numbering is sequential
   - Check all claims in text match actual result numbers

3. **Flow and Transition Check**:
   - Ensure logical flow between sections
   - Add transition paragraphs where sections by different models meet
   - Verify the story arc is coherent from introduction to conclusion

4. **Final Assembly**:
   - Merge into single document (`papers/drafts/paper_v1.tex` or `.md`)
   - Generate `\input{}` structure for modular LaTeX
   - Run word/page count check against venue limits

## Output

- `papers/drafts/paper_v1.tex` - Complete merged paper draft
- `papers/drafts/sections/` - Individual section files
- `papers/drafts/figures_needed.md` - Figure specifications from Gemini
- `papers/drafts/algorithms/` - Algorithm blocks from Codex
- `papers/drafts/style-guide.md` - Notation and terminology reference
- `papers/drafts/merge-log.md` - Log of merge decisions and conflict resolutions

## 关键规则

- Claude is the lead author and final decision-maker on all content
- The style guide must be established BEFORE parallel writing begins
- Every section must reference the shared notation guide
- Do not allow different models to define conflicting notation
- After merging, run `/ccg-scholar:writing-polish` for language quality
- After polishing, run `/ccg-scholar:paper-review` for self-review
- Never fabricate results; use `[PLACEHOLDER]` markers for missing data
- All figure descriptions must be detailed enough for reproduction
