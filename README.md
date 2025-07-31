# 文件分享平台

一个精致的文件分享和社区交流平台，符合Google AdSense要求。

## 功能特性

### 🎯 核心功能
- **文件分享**: 支持Markdown格式的文件上传和展示
- **用户系统**: 完整的注册、登录、用户管理
- **互动功能**: 点赞、收藏、评论系统
- **搜索功能**: 实时搜索文件内容
- **私信系统**: 用户间私信交流，支持文字和图片

### 🔮 特色功能
- **占卜系统**: 每日运势占卜，包含宜忌建议
- **个性化**: 用户昵称颜色自定义
- **响应式设计**: 完美适配各种设备

### 📱 界面设计
- **简约风格**: 现代化UI设计，符合Google AdSense要求
- **立体卡片**: 文件展示卡片具有立体感和悬停效果
- **信纸背景**: 文件详情页面采用信纸背景设计
- **动画效果**: 流畅的页面过渡和交互动画

## 技术栈

- **前端**: Next.js 14, React 18, TypeScript
- **样式**: Tailwind CSS, Framer Motion
- **后端**: Supabase (PostgreSQL + Auth + Storage)
- **部署**: Vercel

## 快速开始

### 1. 环境准备

```bash
# 安装依赖
npm install

# 创建环境变量文件
cp .env.example .env.local
```

### 2. 配置Supabase

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 获取项目URL和匿名密钥
3. 在 `.env.local` 中配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 数据库设置

在Supabase SQL编辑器中执行以下SQL：

```sql
-- 创建用户资料表
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  nickname_color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建文件表
CREATE TABLE files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL CHECK (char_length(title) <= 20),
  description TEXT NOT NULL CHECK (char_length(description) <= 30),
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0
);

-- 创建评论表
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 1000),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建点赞表
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(file_id, user_id)
);

-- 创建收藏表
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(file_id, user_id)
);

-- 创建私信表
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  receiver_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT CHECK (char_length(content) <= 1000),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (content IS NOT NULL OR image_url IS NOT NULL)
);

-- 创建占卜历史表
CREATE TABLE fortune_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  fortune TEXT NOT NULL,
  advice JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建RLS策略
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE fortune_history ENABLE ROW LEVEL SECURITY;

-- 设置策略
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Files are viewable by everyone" ON files FOR SELECT USING (true);
CREATE POLICY "Users can insert own files" ON files FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own files" ON files FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Likes are viewable by everyone" ON likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage own likes" ON likes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Favorites are viewable by everyone" ON favorites FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages they sent or received" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Authenticated users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view own fortune history" ON fortune_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can insert own fortune" ON fortune_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建函数来更新计数
CREATE OR REPLACE FUNCTION update_file_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'likes' THEN
      UPDATE files SET likes_count = likes_count + 1 WHERE id = NEW.file_id;
    ELSIF TG_TABLE_NAME = 'favorites' THEN
      UPDATE files SET favorites_count = favorites_count + 1 WHERE id = NEW.file_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF TG_TABLE_NAME = 'likes' THEN
      UPDATE files SET likes_count = likes_count - 1 WHERE id = OLD.file_id;
    ELSIF TG_TABLE_NAME = 'favorites' THEN
      UPDATE files SET favorites_count = favorites_count - 1 WHERE id = OLD.file_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER update_likes_count
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_file_counts();

CREATE TRIGGER update_favorites_count
  AFTER INSERT OR DELETE ON favorites
  FOR EACH ROW EXECUTE FUNCTION update_file_counts();

-- 创建定时任务清理旧数据（15天）
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
  DELETE FROM comments WHERE created_at < NOW() - INTERVAL '15 days';
  DELETE FROM messages WHERE created_at < NOW() - INTERVAL '15 days';
END;
$$ LANGUAGE plpgsql;

-- 设置定时任务（需要手动在Supabase Dashboard中设置）
-- 每天凌晨2点执行清理
-- SELECT cron.schedule('cleanup-old-data', '0 2 * * *', 'SELECT cleanup_old_data();');
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 部署

### Vercel部署

1. 将代码推送到GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 部署完成

### 环境变量

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 功能说明

### 文件管理
- 支持Markdown格式
- 标题限制20字符
- 简介限制30字符
- 按上传时间排序

### 用户系统
- 邮箱注册登录
- 用户昵称颜色自定义
- 个人资料管理

### 互动功能
- 点赞/取消点赞
- 收藏/取消收藏
- 评论系统（1000字符限制）
- 实时计数更新

### 占卜系统
- 每日一次占卜
- 凌晨4点重置
- 包含运势和宜忌建议

### 私信系统
- 文字消息（1000字符限制）
- 图片消息（5MB限制）
- 文字和图片不能同时发送

### 搜索功能
- 实时搜索
- 按标题和简介匹配
- 按契合度排序

## 预算说明

- **Vercel**: 免费套餐足够使用
- **Supabase**: 免费套餐包含50MB数据库和1GB存储
- **域名**: 可选，约10元/月
- **总预算**: 约10元/月

## 技术特点

- **性能优化**: Next.js App Router, 图片优化
- **SEO友好**: 服务端渲染, Meta标签
- **安全性**: RLS策略, 输入验证
- **可扩展**: 模块化设计, TypeScript
- **用户体验**: 响应式设计, 流畅动画

## 许可证

MIT License 