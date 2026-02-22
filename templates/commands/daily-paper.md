---
description: "每日论文追踪 - Gemini扫描arXiv新论文 + Claude筛选与研究相关的论文"
argument-hint: "研究主题关键词（可选，默认从 CLAUDE.md 读取）"
---

# Daily Paper Tracker

Track daily arXiv papers relevant to the current research topic.

## Input

Research keywords: $ARGUMENTS (falls back to CLAUDE.md research topic if empty)

## Phase 1: Load Research Context

1. Read `CLAUDE.md` for research topic and keywords
2. Read `papers/references/scan_index.yaml` for previously scanned papers
3. Determine date range: today or specified date

## Phase 2: Gemini arXiv Scan

Dispatch Gemini to scan recent arXiv submissions:

```bash
# Scan primary categories
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "Search arXiv for papers submitted in the last 24-48 hours in categories cs.CL, cs.LG, cs.AI, cs.CV (adjust based on research area) matching keywords: '$ARGUMENTS'.

For each relevant paper found, extract:
- arXiv ID
- Title
- Authors (first 3 + et al.)
- Abstract (first 100 words)
- Primary category
- Submission date

Return as JSON array sorted by relevance." &

# Scan cross-listed papers
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "Search for cross-listed arXiv papers in the last 48 hours that combine multiple relevant areas for '$ARGUMENTS'. These interdisciplinary papers are often high-impact. Return as JSON array." &
```

## Phase 3: Claude Relevance Filtering and Summary

Claude filters and summarizes the scan results:

1. **Relevance Scoring** (1-5):
   - 5: Directly related to current research, must read
   - 4: Highly relevant methodology or application
   - 3: Tangentially related, good to be aware of
   - 2: Same field but different focus
   - 1: Minimal relevance

2. **Summary Generation**: For papers scoring >= 3:
   - One-paragraph summary of contribution
   - How it relates to our research
   - Whether it affects our approach (confirms, challenges, extends)

3. **Action Items**: For papers scoring >= 4:
   - Should we cite this paper?
   - Should we compare against this method?
   - Does this change our research direction?

## Output

Generate `papers/references/daily/YYYY-MM-DD.md`:

```markdown
# Daily Paper Digest - YYYY-MM-DD

## Must Read (Score 5)
### [Paper Title](arXiv_URL)
**Authors**: ... | **Category**: ...
> Summary and relevance assessment

## Highly Relevant (Score 4)
...

## Worth Knowing (Score 3)
...

## Statistics
- Total papers scanned: N
- Relevant papers found: M
- New potential baselines: K
```

Update `papers/references/scan_index.yaml` with newly scanned papers.

## Rules

- Deduplicate against previously scanned papers
- Do not scan on weekends unless explicitly requested (arXiv has no new submissions)
- Limit output to top 15 papers to avoid information overload
- Include arXiv links for all papers
- Suggest `/ccg-scholar:paper-scan` for must-read papers
