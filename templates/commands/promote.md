---
description: "论文推广材料生成 - 社交媒体、博客、通俗摘要"
argument-hint: "论文文件路径"
---

# Paper Promotion Materials

Generate promotion materials for a research paper across multiple platforms.

## Input

Paper: $ARGUMENTS

## 多模型调用规范

Use `codeagent-wrapper` for multi-model dispatch:
- `codeagent-wrapper --backend gemini` for visual content suggestions and platform optimization

## 执行工作流

### Phase 1: Claude Generates Social Media Summaries (science-communicator role)

Claude reads the paper and creates platform-specific content:

1. **Load Context**:
   - Read the paper from `$ARGUMENTS`
   - Extract: title, authors, key contribution, main result, paper URL
   - Identify target audience (ML researchers, domain practitioners, general public)

2. **Twitter/X Thread** (8-12 tweets):
   ```markdown
   Tweet 1: [Hook - surprising result or bold claim]
   Tweet 2: [Problem - why this matters]
   Tweet 3: [Key insight - the "aha" moment]
   Tweet 4-6: [Method - explained simply with figure references]
   Tweet 7-8: [Results - headline numbers with comparison]
   Tweet 9: [Implications - what this enables]
   Tweet 10: [Links - paper, code, demo]
   ```
   - Each tweet under 280 characters
   - Include figure suggestions for visual tweets
   - Add relevant hashtags

3. **LinkedIn Post** (1 post, 1300 characters max):
   - Professional tone, emphasize practical impact
   - Structure: Hook > Problem > Solution > Results > Call to Action
   - Tag co-authors and institutions

4. **Mastodon/Bluesky Post** (short form):
   - Concise summary with paper link
   - Academic community tone

### Phase 2: Blog Post Outline

Claude creates a technical blog post outline:

1. **Blog Structure** (800-1200 words target):
   ```markdown
   # [Catchy Title - not the paper title]

   ## TL;DR
   [3 bullet points]

   ## The Problem
   [Why should anyone care? Real-world motivation]

   ## Our Approach
   [Method explained with intuitive analogies, minimal math]
   [Key figure from the paper]

   ## Results That Matter
   [Top results with context and comparison]
   [Result figure/table]

   ## What This Means
   [Practical implications and future directions]

   ## Try It Yourself
   [Code repo link, demo link, installation instructions]

   ## Citation
   [BibTeX block]
   ```

2. **Figure Selection**: Pick 2-3 figures from the paper best suited for blog format

### Phase 3: Plain-Language Summary

Claude generates an accessible summary for non-experts:

1. **Plain-Language Abstract** (200 words):
   - No jargon, no acronyms (or define all of them)
   - Explain using everyday analogies
   - Focus on "so what?" - why does this matter to society

2. **Press Release Draft** (300 words):
   - Headline + subheadline
   - Quote from lead author (template)
   - Background context
   - Key finding in plain language
   - Significance and next steps

3. **Elevator Pitch** (30 seconds, ~75 words):
   - For explaining to a non-technical colleague

## Output

Generate the following files:

- `papers/promotion/twitter-thread.md` - Twitter/X thread draft
- `papers/promotion/linkedin-post.md` - LinkedIn post draft
- `papers/promotion/blog-outline.md` - Blog post outline with content
- `papers/promotion/plain-summary.md` - Plain-language summary + press release + elevator pitch

## 关键规则

- Never overstate results; maintain scientific honesty even in promotion
- Include proper attribution for all co-authors
- Adapt language to each platform's norms and audience expectations
- Social media posts should be engaging but not clickbait
- Always include links to the paper (arXiv, DOI) and code repository
- Check that no unpublished or embargoed information is included
- Run through `/ccg-scholar:anti-ai-check` if the paper is under review
