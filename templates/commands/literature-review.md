---
description: "多模型协作文献综述 - Gemini扫描 + Claude分析"
argument-hint: "研究主题或具体论文查询"
---

# Multi-Model Literature Review

Conduct a comprehensive literature review using multi-model collaboration.

## Input

Research query: $ARGUMENTS

## Phase 1: Gemini Parallel Scan (literature-scanner role)

Dispatch multiple Gemini instances in parallel to scan literature sources. Use `run_in_background` for all scan tasks:

```bash
# Scan 1: Recent papers (2023-2025)
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "Search for recent papers (2023-2025) on '$ARGUMENTS'. For each paper found, extract: title, authors, venue, year, abstract summary (2 sentences), methodology type, key contribution. Return as structured JSON array. Focus on top-tier venues (NeurIPS, ICML, ICLR, ACL, KDD, AAAI)." &

# Scan 2: Survey papers and seminal works
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "Find survey papers and seminal/foundational works related to '$ARGUMENTS'. Include citation count estimates and influence on the field. Return as structured JSON." &

# Scan 3: Preprints and emerging trends
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "Search arXiv preprints from the last 6 months on '$ARGUMENTS'. Identify emerging trends, new methodologies, and paradigm shifts. Return as structured JSON." &
```

Wait for all background scans to complete. Merge results and deduplicate by title/DOI.

## Phase 2: Claude Deep Analysis (research-analyst role)

With the merged scan results, Claude performs deep analysis:

1. **Taxonomy Construction**: Organize papers into a hierarchical taxonomy
   - Group by methodology (e.g., supervised, self-supervised, reinforcement learning)
   - Group by application domain
   - Identify cross-cutting themes

2. **Temporal Analysis**: Map the evolution of approaches over time
   - Key milestones and breakthrough papers
   - Methodology transitions and paradigm shifts

3. **Gap Identification**: Analyze what is missing
   - Understudied combinations of methods and domains
   - Unresolved challenges mentioned across papers
   - Scalability and reproducibility concerns

4. **Strength-Weakness Matrix**: For the top 10 most relevant papers
   - Method strengths and limitations
   - Experimental rigor assessment
   - Reproducibility indicators

## Phase 3: Output Generation

Generate two output files:

### literature-review.md

```markdown
# Literature Review: $ARGUMENTS

## 1. Overview
[Field summary, scope, paper count]

## 2. Taxonomy
[Hierarchical categorization with paper references]

## 3. Temporal Evolution
[Timeline of key developments]

## 4. Key Methods Comparison
| Method | Paper | Dataset | Metric | Result | Limitations |

## 5. Research Gaps
[Identified gaps with supporting evidence]

## 6. Recommended Reading Path
[Ordered list: foundational -> core -> frontier]
```

### references.bib

Generate BibTeX entries for all cited papers. Format:
```bibtex
@inproceedings{author2024keyword,
  title={...},
  author={...},
  booktitle={...},
  year={...}
}
```

## Rules

- Always verify paper existence before citing (check arXiv ID, DOI when possible)
- Distinguish between peer-reviewed and preprint sources
- Flag potential citation issues to be verified with `/ccg-scholar:citation-check`
- Output files go to `papers/references/` directory
- Use BibTeX keys in format: `{firstauthor}{year}{keyword}`
- Chinese summary sections are acceptable; BibTeX entries must be in English
