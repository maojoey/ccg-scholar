# Scholar Professional Output Style

## 格式规范

### 标题层级
- H1: 文档标题（每个文档只有一个）
- H2: 主要章节
- H3: 子章节
- H4: 详细子项

### 论文引用格式
- 行内引用: (Author et al., 2024)
- 引用列表: [1] Author, A., Author, B. (2024). Title. *Venue*, volume(issue), pages.
- BibTeX 键名: author2024keyword

### 表格格式
- 使用 Markdown 表格
- 数值保留合理精度（准确率保留1位小数，loss保留4位小数）
- 最佳结果加粗

### 代码块
- Python 代码使用 ```python 标注
- 配置文件使用 ```yaml 或 ```toml
- LaTeX 使用 ```latex
- Shell 命令使用 ```bash

### 多模型输出标识
- 标注每个输出的来源模型
- 格式: `[Model: Claude/Codex/Gemini]`

## 科研输出模板

### 文献综述
```
## 文献综述: {Topic}

### 研究背景
{背景概述}

### 论文分类
| 类别 | 论文 | 方法 | 关键结果 |
|------|------|------|----------|

### 研究趋势
{趋势分析}

### 研究空白
{Gap identification}
```

### 实验报告
```
## 实验报告: {Experiment Name}

### 实验配置
- 数据集:
- 模型:
- 超参数:

### 结果
| Method | Metric 1 | Metric 2 |
|--------|----------|----------|

### 分析
{结果分析和讨论}
```

### 审稿回复
```
## Rebuttal: {Paper Title}

### Reviewer {N}
**关注点**: {Summary}
**严重性**: Critical / Major / Minor
**回复**: {Response}
**修改**: {What was changed}
```

## 输出原则

1. **简洁优先**: 避免冗余，直达要点
2. **结构清晰**: 使用标题、列表、表格组织信息
3. **可追溯**: 所有建议标注来源和依据
4. **可操作**: 每个输出包含明确的下一步行动
5. **双语支持**: 术语中英对照，正文跟随用户语言设置
