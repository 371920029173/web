import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 模拟数据
export const mockFiles = [
  {
    id: '1',
    title: '欢迎使用文件分享平台',
    description: '这是一个示例文件，展示平台功能',
    content: `# 欢迎使用文件分享平台

这是一个功能完整的文件分享和社区交流平台。

## 主要功能

- 📄 **文件分享**: 支持Markdown格式的文件上传和展示
- 👥 **用户系统**: 完整的注册、登录、用户管理
- ❤️ **互动功能**: 点赞、收藏、评论系统
- 🔍 **搜索功能**: 实时搜索文件内容
- 💬 **私信系统**: 用户间私信交流
- 🔮 **占卜系统**: 每日运势占卜

## 技术特点

- **现代化设计**: 简约风格，符合Google AdSense要求
- **响应式布局**: 完美适配各种设备
- **流畅动画**: 优雅的页面过渡效果
- **高性能**: 基于Next.js 14构建

## 开始使用

1. 注册账户
2. 上传您的第一个文件
3. 与其他用户互动交流
4. 体验占卜功能

祝您使用愉快！`,
    author_id: '1',
    created_at: new Date().toISOString(),
    likes_count: 15,
    favorites_count: 8,
    author: {
      nickname: '平台管理员',
      nickname_color: '#3B82F6'
    }
  },
  {
    id: '2',
    title: 'Markdown语法指南',
    description: '学习如何使用Markdown格式编写文档',
    content: `# Markdown语法指南

## 标题

使用 \`#\` 创建标题：

\`\`\`
# 一级标题
## 二级标题
### 三级标题
\`\`\`

## 文本格式

- **粗体**: \`**文本**\`
- *斜体*: \`*文本*\`
- ~~删除线~~: \`~~文本~~\`

## 列表

### 无序列表
\`\`\`
- 项目1
- 项目2
  - 子项目
\`\`\`

### 有序列表
\`\`\`
1. 第一项
2. 第二项
3. 第三项
\`\`\`

## 链接和图片

\`\`\`
[链接文本](URL)
![图片描述](图片URL)
\`\`\`

## 代码

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## 表格

| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |

## 引用

> 这是一个引用块
> 可以包含多行内容

## 分割线

---

使用 \`---\` 创建分割线。`,
    author_id: '2',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    likes_count: 23,
    favorites_count: 12,
    author: {
      nickname: '技术达人',
      nickname_color: '#10B981'
    }
  },
  {
    id: '3',
    title: '今日运势分享',
    description: '分享今日占卜结果和心情',
    content: `# 今日运势分享

## 🔮 今日占卜结果

**运势**: 大吉 🍀

### 宜
- 宜出行
- 宜交友
- 宜投资
- 宜表白

### 忌
- 忌争吵
- 忌熬夜

## 💭 心情分享

今天真是美好的一天！早上起床就感觉特别有精神，果然占卜显示是大吉。

### 今日计划

1. ✅ 完成工作项目
2. ✅ 与朋友聚会
3. ✅ 学习新技能
4. ⏳ 整理房间

### 感悟

有时候一个小小的占卜就能给一天带来好心情。虽然知道这只是娱乐，但积极的心态确实能影响我们的状态。

希望每个人都能保持乐观的心态，迎接每一天的挑战！

---

*分享于 ${new Date().toLocaleDateString('zh-CN')}*`,
    author_id: '3',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    likes_count: 8,
    favorites_count: 5,
    author: {
      nickname: '幸运星',
      nickname_color: '#F59E0B'
    }
  }
]

export const mockComments = [
  {
    id: '1',
    file_id: '1',
    user_id: '2',
    content: '这个平台真的很棒！界面设计很现代化，功能也很齐全。',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    user: {
      nickname: '技术达人',
      nickname_color: '#10B981'
    }
  },
  {
    id: '2',
    file_id: '1',
    user_id: '3',
    content: '占卜功能很有趣，每天都会来看看今日运势。',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    user: {
      nickname: '幸运星',
      nickname_color: '#F59E0B'
    }
  }
]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string
          nickname: string
          nickname_color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          nickname: string
          nickname_color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          nickname?: string
          nickname_color?: string
          created_at?: string
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          author_id: string
          created_at: string
          updated_at: string
          likes_count: number
          favorites_count: number
        }
        Insert: {
          id?: string
          title: string
          description: string
          content: string
          author_id: string
          created_at?: string
          updated_at?: string
          likes_count?: number
          favorites_count?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content?: string
          author_id?: string
          created_at?: string
          updated_at?: string
          likes_count?: number
          favorites_count?: number
        }
      }
      comments: {
        Row: {
          id: string
          file_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          file_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          file_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          file_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          file_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          file_id?: string
          user_id?: string
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          file_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          file_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          file_id?: string
          user_id?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content?: string
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          image_url?: string | null
          created_at?: string
        }
      }
      fortune_history: {
        Row: {
          id: string
          user_id: string
          fortune: string
          advice: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          fortune: string
          advice: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          fortune?: string
          advice?: string
          created_at?: string
        }
      }
    }
  }
} 