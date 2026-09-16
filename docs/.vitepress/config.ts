import { defineConfig } from 'vitepress'

const base = process.env.BLOG_BASE || '/tech-notes/'

export default defineConfig({
  title: 'Data × AI · 技术笔记',
  description: '面向数据工程与 Data Agent 的学习笔记、可复现实验与问题复盘。',
  lang: 'zh-CN',
  base,
  head: [
    ['meta', { name: 'theme-color', content: '#0f766e' }],
    ['meta', { name: 'color-scheme', content: 'light dark' }]
  ],
  themeConfig: {
    outline: { level: [2, 3] },
    nav: [
      { text: '首页', link: '/' },
      { text: '学习路线', link: '/roadmap' },
      { text: '项目推荐', link: '/projects' },
      {
        text: '技术笔记',
        items: [
          { text: 'SQL：一对多关联为何会重复计数', link: '/notes/sql-one-to-many' },
          { text: 'Agent 的决策机制', link: '/notes/agent-decision-mechanism' },
          { text: 'Spark 慢作业诊断实验（计划）', link: '/notes/spark-slow-job-lab' }
        ]
      },
      { text: '关于本站', link: '/about' }
    ],
    sidebar: {
      '/notes/': [
        {
          text: '技术笔记',
          items: [
            { text: 'SQL：一对多关联为何会重复计数', link: '/notes/sql-one-to-many' },
            { text: 'Agent 的决策机制', link: '/notes/agent-decision-mechanism' },
            { text: 'Spark 慢作业诊断实验（计划）', link: '/notes/spark-slow-job-lab' }
          ]
        },
        {
          text: '站点信息',
          items: [
            { text: '学习路线', link: '/roadmap' },
            { text: '关于本站', link: '/about' }
          ]
        }
      ],
      '/projects': [
        {
          text: 'GitHub 项目推荐',
          items: [
            { text: '七个项目与整合练习', link: '/projects' }
          ]
        },
        {
          text: '站点信息',
          items: [
            { text: '学习路线', link: '/roadmap' },
            { text: '关于本站', link: '/about' }
          ]
        }
      ]
    },
    search: {
      provider: 'local'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hfg369/tech-notes' }
    ],
    footer: {
      message: '持续学习，持续验证。',
      copyright: '© 2026 Data × AI · 技术笔记'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '切换深色模式',
    lightModeSwitchTitle: '切换浅色模式',
    darkModeSwitchTitle: '切换深色模式'
  }
})
