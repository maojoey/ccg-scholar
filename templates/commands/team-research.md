---
description: "多模型协作研究 - Codex+Gemini并行文献扫描 + Claude综合分析"
argument-hint: "研究主题或查询关键词"
---

# Team Collaborative Research

Conduct a comprehensive literature review and research analysis using parallel multi-model collaboration across different databases and sources.

## Input

Research topic: $ARGUMENTS

## 多模型调用规范

Use `codeagent-wrapper` for multi-model dispatch:
- `codeagent-wrapper --backend gemini` for broad literature scanning and trend analysis
- `codeagent-wrapper --backend codex` for technical paper analysis and code repository scanning

## 执行工作流

### Phase 1: Parallel Literature Scan (Codex + Gemini)

Dispatch multiple models in parallel using `run_in_background`:

```bash
# Gemini Scan 1: Academic databases (Google Scholar, Semantic Scholar)
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "Search academic databases for papers on '$ARGUMENTS'. Focus on:
- Top-tier venue papers (2022-2025)
- Survey papers and meta-analyses
- Highly cited foundational works
For each paper: title, authors, venue, year, citation count, abstract summary, methodology category.
Return as structured JSON array." &

# Gemini Scan 2: Preprints and emerging work
GEMINI_MODEL={{GEMINI_MODEL}} ~/.claude/bin/codeagent-wrapper --lite --backend gemini --prompt "Search arXiv and other preprint servers for recent work (last 12 months) on '$ARGUMENTS'. Identify:
- Emerging methodologies and paradigm shifts
- New benchmarks and datasets
- Cross-disciplinary connections
Return as structured JSON array." &

# Codex Scan 1: Code repositories and implementations
~/.claude/bin/codeagent-wrapper --lite --backend codex --prompt "Search GitHub and PapersWithCode for implementations related to '$ARGUMENTS'. For each repository:
- Repository URL and star count
- Associated paper (if any)
- Framework (PyTorch, TensorFlow, JAX)
- Reproducibility status (working, partial, broken)
- Key implementation details
Return as structured JSON array." &

# Codex Scan 2: Technical benchmarks and leaderboards
~/.claude/bin/codeagent-wrapper --lite --backend codex --prompt "Find benchmark results and leaderboards related to '$ARGUMENTS'. For each benchmark:
- Dataset name and task
- Current SOTA method and score
- Top 5 methods with scores
- Evaluation metrics used
Return as structured JSON array." &
```

Wait for all background scans to complete.

### Phase 2: Claude Merges and Deduplicates

Claude collects all scan results and performs:

1. **Deduplication**: Match papers across sources by title, DOI, or arXiv ID
2. **Enrichment**: Cross-reference papers with their code implementations
3. **Quality Filter**: Prioritize peer-reviewed over preprint, high-citation over low
4. **Gap Detection**: Identify topics mentioned but poorly covered

### Phase 3: Claude Synthesizes Findings (research-synthesizer role)

Deep analysis of the merged corpus:

1. **Research Landscape Map**:
   - Taxonomy of approaches (hierarchical categorization)
   - Methodology evolution timeline
   - Key research groups and their contributions

2. **Technical Comparison Matrix**:
   ```markdown
   | Method | Paper | Year | Dataset | Metric | Score | Code | Reproducible |
   |--------|-------|------|---------|--------|-------|------|-------------|
   ```

3. **Research Gaps and Opportunities**:
   - Understudied areas with high potential
   - Methods not yet combined
   - Missing benchmarks or evaluation protocols
   - Scalability and real-world deployment gaps

4. **Recommended Research Directions**:
   - Short-term (incremental improvements)
   - Medium-term (novel combinations)
   - Long-term (paradigm-shifting ideas)

## Output

Generate the following files:

- `papers/references/literature-review.md` - Comprehensive literature review
- `papers/references/references.bib` - BibTeX entries for all papers
- `papers/references/research-landscape.md` - Visual research landscape description
- `papers/references/gap-analysis.md` - Identified gaps and opportunities
- `papers/references/code-repos.md` - Catalog of available implementations

## 关键规则

- Always verify paper existence; do not hallucinate citations
- Distinguish clearly between peer-reviewed papers and preprints
- Include negative results and failed approaches when relevant
- Attribute findings to the correct scanning model for traceability
- Resolve conflicting information between scan sources explicitly
- Use `/ccg-scholar:citation-check` to verify critical references
- Output in English for BibTeX; Chinese annotations are acceptable in review documents
