# 部署指南

## 上线前配置清单

### 1. 环境变量配置

将 `env.example` 重命名为 `.env.local`，并确保以下配置正确：

```bash
# Supabase配置 (已配置完成)
NEXT_PUBLIC_SUPABASE_URL=https://dfpyhzwlnstwtgwsypgb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmcHloandsbnN0d3Rnd3N5cGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNDAxMTIsImV4cCI6MjA2OTYxNjExMn0.KL0L2U7h7tbVsn1K42ZRym3a-cCKfwjg43jr9mnnEks

# Google AdSense (需要申请)
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=your_google_adsense_id
```

### 2. Google AdSense 申请

1. 访问 [Google AdSense](https://www.google.com/adsense)
2. 注册账户并等待审核通过
3. 获取你的 AdSense ID
4. 将 ID 填入环境变量 `NEXT_PUBLIC_GOOGLE_ADSENSE_ID`

### 3. Vercel 部署

1. 注册 [Vercel](https://vercel.com) 账户
2. 连接你的 GitHub 仓库
3. 在 Vercel 项目设置中添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GOOGLE_ADSENSE_ID`

### 4. 域名配置 (可选)

1. 购买域名 (推荐: Namecheap, GoDaddy)
2. 在 Vercel 中添加自定义域名
3. 配置 DNS 记录

### 5. 数据库检查

确保 Supabase 数据库已正确设置：
- ✅ 表结构已创建
- ✅ RLS 策略已配置
- ✅ 初始管理员账户已创建
- ✅ 触发器已设置

### 6. 功能测试清单

- [ ] 用户注册/登录
- [ ] 文件上传
- [ ] 文件查看
- [ ] 评论功能
- [ ] 点赞/收藏
- [ ] 私信系统
- [ ] 占卜功能
- [ ] 搜索功能
- [ ] 管理员功能

### 7. 性能优化

- [ ] 图片压缩
- [ ] 代码分割
- [ ] 缓存策略
- [ ] CDN 配置

### 8. SEO 优化

- [ ] Meta 标签
- [ ] Sitemap
- [ ] Robots.txt
- [ ] 结构化数据

### 9. 安全配置

- [ ] HTTPS 强制
- [ ] CSP 头
- [ ] 输入验证
- [ ] XSS 防护

## 部署命令

```bash
# 本地测试
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 监控和维护

1. 设置错误监控 (Sentry)
2. 配置性能监控
3. 定期备份数据库
4. 监控服务器资源使用

## 预算控制

- Vercel: 免费 tier
- Supabase: 免费 tier (每月 500MB 数据库)
- 域名: ~$10/年
- 总预算: 约 $10/年

## 联系信息

如有问题，请检查：
1. Supabase 控制台日志
2. Vercel 部署日志
3. 浏览器开发者工具 