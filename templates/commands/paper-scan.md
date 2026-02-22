---
description: "快速论文扫描 - Gemini读取论文PDF/URL提取关键信息"
argument-hint: "论文PDF路径、arXiv URL 或论文标题"
---

# Quick Paper Scanning

Use Gemini to rapidly scan papers and extract structured key information.

## Input

Paper source: $ARGUMENTS

## Phase 1: Source Resolution

Determine the input type:
- **PDF path**: Read the PDF file directly
- **arXiv URL**: Fetch the paper content via URL
- **arXiv ID** (e.g., `2301.12345`): Construct URL `https://arxiv.org/abs/{id}`
- **Paper title**: Search for the paper first

## Phase 2: Gemini Extraction

Dispatch Gemini to extract structured information:

```bash
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "Read the following paper and extract a structured summary:

Paper: $ARGUMENTS

Extract the following fields:
1. **Title**: Full paper title
2. **Authors**: All authors with affiliations
3. **Venue/Year**: Where and when published
4. **Problem Statement**: What problem does this paper address (2-3 sentences)
5. **Method**: Core methodology description (5-8 sentences)
6. **Key Innovation**: What is novel about this approach
7. **Datasets**: All datasets used with sizes
8. **Baselines**: Methods compared against
9. **Main Results**: Key quantitative results (table format)
10. **Ablation Studies**: What components were ablated
11. **Limitations**: Stated or apparent limitations
12. **Future Work**: Suggested future directions
13. **Code/Data Availability**: Links to repositories or datasets
14. **BibTeX**: Generate the citation entry

Output as structured Markdown."
```

## Phase 3: Claude Quick Assessment

Claude adds a brief research-relevance assessment:

1. **Relevance to Current Project**: How does this paper relate to our research (from CLAUDE.md)
2. **Reproducibility Score** (1-5): Based on code availability, detail level, dataset access
3. **Method Applicability**: Could we adapt this method for our problem
4. **Key Takeaways**: 3 bullet points of what to remember

## Output

Save to `papers/references/scans/{sanitized_title}.md`

Display the structured summary to the user with highlighted key findings.

## Batch Mode

If multiple papers are provided (comma-separated or file list):

```bash
# Parallel scan of multiple papers
for paper in $PAPER_LIST; do
  GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "Scan paper: $paper ..." &
done
```

Merge results into a comparison table.

## Rules

- Always attempt to verify the paper exists before scanning
- For PDFs, use the Read tool to access the file content
- Flag papers that appear to be retracted or have errata
- Maintain a running scan index in `papers/references/scan_index.yaml`
- Suggest `/ccg-scholar:citation-check` for papers to be cited in our work
