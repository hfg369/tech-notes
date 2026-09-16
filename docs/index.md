---
layout: home

hero:
  name: Data × AI
  text: 技术笔记
  tagline: 用小实验把数据工程与 AI Agent 的概念，变成可以运行、检查和复盘的工程判断。
  actions:
    - theme: brand
      text: 从第一篇笔记开始
      link: /notes/sql-one-to-many
    - theme: alt
      text: 查看学习路线
      link: /roadmap

features:
  - icon: ◇
    title: 从数据粒度开始
    details: 先问清表、字段与指标的粒度，再写 SQL 或搭建 Agent。
  - icon: ↗
    title: 证据先于结论
    details: 记录可复现的输入、观察、假设与验证，让“看起来对”变成“可以核对”。
  - icon: ◎
    title: 面向真实工程
    details: 关注失败处理、边界、权限与维护成本，逐步靠近数据工程与 Data Agent 工作。
---

<div class="home-intro">

## 这里记录什么

这是一个面向数据工程与 Data Agent 的学习站。文章从初学者会遇到的具体问题出发：一对多关联为什么让金额翻倍，Agent 如何决定下一步，Spark 作业变慢时应该先看什么证据。

每篇笔记都尽量保留四件事：问题、最小例子、判断依据和下一步实验。站点里的“计划”内容代表待完成的学习任务，不代表已经做过或在生产环境验证过。

## 推荐阅读顺序

先读 [SQL：一对多关联为何会重复计数](/notes/sql-one-to-many)，建立数据粒度意识；接着读 [Agent 的决策机制](/notes/agent-decision-mechanism)，理解模型、工具与程序规则怎样配合；最后查看 [Spark 慢作业诊断实验](/notes/spark-slow-job-lab)，按清单准备一次可复现实验。

如果想把零散主题串成一条路线，可以从 [学习路线](/roadmap) 开始。

<div class="home-note">
  <span class="home-note-mark">学习状态</span>
  <span>持续整理中 · 先完成小而完整的实验，再扩大工具范围</span>
</div>

</div>
