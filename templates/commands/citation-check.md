---
description: "引用验证 - 检查DOI有效性、交叉验证引用声明、检测遗漏引用"
argument-hint: "BibTeX文件路径或论文草稿路径"
---

# Citation Verification

Verify citations for correctness, completeness, and proper attribution.

## Input

Target file: $ARGUMENTS

## Phase 1: Citation Extraction

1. Parse the input file:
   - If `.bib` file: extract all BibTeX entries
   - If `.tex` or `.md` file: extract all `\cite{}` or `[@ref]` references
   - If directory: scan all `.tex`/`.md` files recursively
2. Build citation inventory: key, title, authors, year, venue, DOI/arXiv ID

## Phase 2: DOI and Metadata Validation

Dispatch Gemini for parallel validation:

```bash
# Validate DOIs and metadata
~/.claude/bin/codeagent-wrapper --backend gemini --prompt "For each of the following citations, verify:
1. DOI validity (if provided)
2. Title accuracy (exact match with published version)
3. Author list completeness
4. Venue and year correctness
5. Whether the paper is peer-reviewed, preprint, or retracted

Citations to verify:
[CITATION_LIST]

Return a validation report with status for each: VALID, WARNING, ERROR, UNVERIFIABLE."
```

## Phase 3: Claim Cross-Reference

Claude analyzes citation usage in the paper draft:

1. **Citation-Claim Alignment**: For each citation in the text:
   - Extract the claim being supported
   - Verify the cited paper actually supports that claim
   - Flag misattributions or overclaims

2. **Missing Citation Detection**:
   - Identify claims without citations that need support
   - Identify well-known results that should be cited
   - Check if foundational methods are properly attributed

3. **Self-Citation Balance**:
   - Count self-citations vs total citations
   - Flag if self-citation ratio exceeds 20%

## Phase 4: Completeness Check

```bash
~/.claude/bin/codeagent-wrapper --backend gemini --prompt "Given the paper topic and the following reference list, identify important missing citations:
- Seminal works not cited
- Recent state-of-the-art not cited
- Competing approaches not cited
- Dataset original papers not cited

Topic: [FROM CLAUDE.md]
Current references: [REFERENCE_LIST]"
```

## Output

Generate `papers/references/citation-report.md`:

```markdown
# Citation Verification Report

## Summary
- Total citations: N
- Valid: X | Warnings: Y | Errors: Z

## Issues Found

### Errors (Must Fix)
| # | Citation Key | Issue | Recommendation |

### Warnings (Should Review)
| # | Citation Key | Issue | Recommendation |

## Missing Citations
[Suggested additions with justification]

## Self-Citation Analysis
- Self-citations: N/M (X%)
- Assessment: [Acceptable / Review needed]
```

## Rules

- Never fabricate citation metadata; mark as UNVERIFIABLE if cannot confirm
- Distinguish between formatting issues and factual errors
- Prioritize errors that could lead to reviewer criticism
- Check for consistent citation style (numbered vs author-year)
- Verify BibTeX entry types match the actual publication type
