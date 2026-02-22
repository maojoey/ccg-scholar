---
description: "学术海报设计 - Claude提取内容 + Gemini设计布局"
argument-hint: "论文文件路径或海报尺寸规格"
---

# Academic Poster Design

Create an academic poster from a research paper using multi-model collaboration.

## Input

Paper or specifications: $ARGUMENTS

## 多模型调用规范

Use `codeagent-wrapper` for multi-model dispatch:
- `codeagent-wrapper --backend gemini` for poster layout and visual design
- `codeagent-wrapper --backend codex` for generating figure/chart code

## 执行工作流

### Phase 1: Claude Extracts Poster Content (content-curator role)

Claude reads the paper and distills content for poster format:

1. **Load Context**:
   - Read the paper from `$ARGUMENTS`
   - Identify poster format requirements (default: A0 portrait, 841mm x 1189mm)
   - Check venue poster guidelines (size, orientation, font minimums)

2. **Content Extraction**:
   - **Title Block**: Title, authors, affiliations, logos, contact info
   - **Motivation**: 2-3 sentences on why this matters (with a compelling figure)
   - **Problem Statement**: Concise problem definition (1 paragraph)
   - **Method Overview**: Visual-first explanation (diagram > equations > text)
   - **Key Results**: Top 3 results with figures/tables
   - **Conclusion**: 3 bullet-point takeaways
   - **QR Code Content**: Link to paper, code repo, project page

3. **Figure Inventory**:
   - List all figures from the paper, rank by poster relevance
   - Identify figures that need redesign for poster readability
   - Specify new figures needed (architecture diagram, result highlights)

### Phase 2: Gemini Designs Poster Layout (poster-designer role)

```bash
~/.claude/bin/codeagent-wrapper --backend gemini --prompt "Design an academic poster layout with these specifications:
- Format: [A0/36x48 inches], [portrait/landscape]
- Sections: [CONTENT_BLOCKS]
- Number of figures: [N]
- Style: clean academic, readable from 1.5 meters distance

Provide:
1. Grid layout specification (columns, rows, spacing)
2. Section placement map with exact coordinates (mm or inches)
3. Font size recommendations (title: 72pt+, headers: 36pt+, body: 24pt+)
4. Color palette (primary, secondary, accent, background)
5. Figure placement and sizing
6. Visual flow arrows showing reading order
Content: [EXTRACTED_CONTENT]"
```

### Phase 3: Figure Placement and Visual Flow

Claude finalizes the poster specification:

1. **Visual Hierarchy**:
   - Title and key figure should be visible from 3+ meters
   - Method diagram is the visual centerpiece
   - Results figures placed at natural eye level
   - Reading flow: top-left to bottom-right (columns or Z-pattern)

2. **Content Block Specifications**:
   ```markdown
   | Block | Position | Size | Content Type | Priority |
   |-------|----------|------|-------------|----------|
   | Title | top-center | full-width x 15% | text + logos | 1 |
   | Motivation | left-col, row-1 | 1/3 x 25% | text + figure | 2 |
   | Method | center | 1/3 x 50% | diagram | 1 |
   | Results | right-col | 1/3 x 50% | figures + tables | 1 |
   | Conclusion | bottom | full-width x 10% | text + QR | 3 |
   ```

3. **Production Notes**:
   - Export format recommendations (PDF, high-res PNG)
   - Print-ready checklist (bleed, margins, color space: CMYK)
   - Accessibility considerations (color-blind safe palette, contrast ratios)

## Output

Generate the following files:

- `papers/poster/layout-spec.md` - Detailed layout specification with grid coordinates
- `papers/poster/content-blocks.md` - All text and figure content for each section
- `papers/poster/figure-list.md` - Figures needed with sizing and placement
- `papers/poster/production-notes.md` - Print-ready checklist and export instructions

## 关键规则

- Readability is paramount: if text is not readable from 1.5m, it does not belong on the poster
- Less is more: a poster is a conversation starter, not the full paper
- Maximum 800 words of body text on the entire poster
- Every section must have a visual element (figure, diagram, table, or icon)
- Use consistent color coding between figures and text references
- Ensure all figures are vector or 300+ DPI for print quality
- Suggest `/ccg-scholar:visualize` for creating poster-specific figures
