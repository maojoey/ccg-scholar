---
description: "AI文本检测与降低 - 检查并减少AI生成文本特征"
argument-hint: "论文草稿文件路径"
---

# Anti-AI Text Detection Check

Check for and reduce AI-generated text patterns in academic writing.

## Input

Paper draft: $ARGUMENTS

## Phase 1: Pattern Detection

Claude scans the text for common AI-generated writing patterns:

### Lexical Patterns
- [ ] Overuse of "delve", "crucial", "landscape", "realm", "multifaceted"
- [ ] Excessive use of "leveraging", "harnessing", "utilizing"
- [ ] Formulaic openings: "In recent years", "In the era of"
- [ ] Over-hedging: "It is worth noting that", "It is important to mention"
- [ ] Superlatives without evidence: "groundbreaking", "revolutionary"
- [ ] Filler phrases: "plays a crucial role", "serves as a cornerstone"

### Structural Patterns
- [ ] Uniform sentence length (lack of variation)
- [ ] Excessive parallel structure in consecutive paragraphs
- [ ] Overly balanced pros/cons lists
- [ ] Generic concluding sentences per paragraph
- [ ] Predictable topic sentence patterns

### Semantic Patterns
- [ ] Vague generalizations without specific examples
- [ ] Circular reasoning or tautological statements
- [ ] Missing concrete numbers or specific references
- [ ] Overly diplomatic tone in all contexts

## Phase 2: AI Detection Score Estimation

```bash
~/.claude/bin/codeagent-wrapper --backend gemini --prompt "Analyze the following academic text and estimate its likelihood of being flagged by AI detection tools (GPTZero, Originality.ai, Turnitin AI). Score each paragraph from 0 (clearly human) to 100 (clearly AI). Identify the top 10 most AI-flaggable sentences.

Text: [CONTENT]

Return: paragraph scores, flagged sentences, and overall risk assessment."
```

## Phase 3: Humanization Strategies

For flagged sections, apply targeted revisions:

1. **Add Specificity**: Replace generic statements with concrete examples
   - Before: "This approach significantly outperforms baselines"
   - After: "Our approach achieves 4.2% F1 improvement over BERT-base on SST-2"

2. **Vary Sentence Structure**: Break uniform patterns
   - Mix short declarative sentences with longer complex ones
   - Use occasional questions or imperatives
   - Start sentences with different parts of speech

3. **Inject Domain Expertise**: Add insights that require genuine knowledge
   - Reference specific implementation details
   - Include practical observations from experiments
   - Mention known limitations from experience

4. **Replace AI Vocabulary**: Substitute flagged words
   - "delve" -> "examine" / "investigate" / "explore"
   - "crucial" -> "essential" / "key" / "central" / "important"
   - "landscape" -> "field" / "area" / "domain"
   - "leverage" -> "use" / "employ" / "apply"
   - "multifaceted" -> "complex" / "varied"

5. **Add Imperfections**: Subtle human touches
   - Occasional informal but correct constructions
   - First-person perspective where appropriate ("We observed that...")
   - Acknowledging uncertainty naturally

## Phase 4: Re-assessment

After applying revisions, re-run the detection analysis to verify improvement.

## Output

Generate `papers/drafts/anti-ai-report.md`:

```markdown
# AI Detection Report

## Overall Risk: [Low / Medium / High]

## Flagged Patterns
| Pattern | Count | Severity | Sections Affected |

## Top Flagged Sentences (with revisions)
| # | Original | Revised | Risk Reduction |

## Section Risk Scores
| Section | Before | After |

## Revision Summary
- Words changed: N
- Sentences restructured: M
- Risk reduction: X% -> Y%
```

## Rules

- Never sacrifice technical accuracy for humanization
- Maintain academic tone; do not make text too casual
- Preserve all citations and numerical results exactly
- Focus on the most flagged sections first (diminishing returns)
- This is a writing quality tool, not a plagiarism evasion tool
- The goal is natural academic writing, not detection avoidance
