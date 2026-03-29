# 自媒体博客系统

一个功能完整的自媒体博客平台，包含 22 个核心功能，支持文章管理、用户互动、数据统计、界面优化和通知系统。

**版本：** v1.0.0  
**开发日期：** 2026-03-29  
**功能数：** 22 个 ✅  
**完成度：** 100%  
**代码量：** ~6500 行  
**文件数：** 70+ 个

---

## ✨ 功能特性

### 📝 P0 - 内容管理（7 个功能）

| 功能 | 说明 | 状态 |
|------|------|------|
| 文章管理 | 完整的文章 CRUD 操作 | ✅ |
| 富文本编辑 | 支持 Markdown 语法 | ✅ |
| 图片上传 | 封面图片上传，最大 5MB | ✅ |
| 草稿箱 | 自动保存草稿 | ✅ |
| 定时发布 | 设置将来发布时间 | ✅ |
| 分类管理 | 文章分类管理 | ✅ |
| 标签系统 | 文章标签管理 | ✅ |

### 👥 P1 - 用户互动（5 个功能）

| 功能 | 说明 | 状态 |
|------|------|------|
| 评论系统 | 支持回复和审核 | ✅ |
| 点赞功能 | 文章点赞统计 | ✅ |
| 收藏功能 | 收藏文章管理 | ✅ |
| 分享功能 | 多平台分享（微信/微博/QQ） | ✅ |
| 关注作者 | 关注作者功能 | ✅ |

### 📊 P2 - 数据统计（4 个功能）

| 功能 | 说明 | 状态 |
|------|------|------|
| 访问统计 | 实时访问数据统计 | ✅ |
| 热门文章 | 热门文章排行榜 | ✅ |
| 阅读进度 | 文章阅读进度追踪 | ✅ |
| 用户画像 | 用户行为和偏好分析 | ✅ |

### 🎨 P3 - 界面优化（4 个功能）

| 功能 | 说明 | 状态 |
|------|------|------|
| 深色模式 | 深色/浅色主题切换 | ✅ |
| 字体调整 | 字体大小调节 | ✅ |
| 阅读模式 | 沉浸式阅读体验 | ✅ |
| 目录导航 | 文章目录自动提取 | ✅ |

### 🔔 P4 - 通知系统（3 个功能）

| 功能 | 说明 | 状态 |
|------|------|------|
| 站内通知 | 网站内消息通知 | ✅ |
| 邮件通知 | 邮件提醒功能 | ✅ |
| 推送通知 | 浏览器推送通知 | ✅ |

---

## 🚀 快速开始

### 环境要求

- **Node.js:** >= 18.x
- **MongoDB:** >= 4.4.x
- **npm:** >= 8.x

### 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/xiangqinburuouyu/selfmedia-app.git
cd selfmedia-app
```

#### 2. 安装依赖

```bash
# 后端依赖
cd backend
npm install

# 前端依赖
cd ../web
npm install
```

#### 3. 配置环境变量

**后端配置：**
```bash
cd backend
cp .env.example .env
```

编辑 `backend/.env`：
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/selfmedia
JWT_SECRET=selfmedia_jwt_secret_key_2026
NODE_ENV=development
```

**前端配置：**
```bash
cd web
cp .env.local.example .env.local
```

编辑 `web/.env.local`：
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SITE_NAME=自媒体
```

#### 4. 启动 MongoDB

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

#### 5. 启动服务

**一键启动（推荐）：**
```bash
./start.sh
```

**手动启动：**
```bash
# 启动后端
cd backend
npm run dev

# 启动前端
cd web
npm run dev
```

#### 6. 访问网站

| 页面 | 地址 |
|------|------|
| 前台首页 | http://localhost:3000 |
| 后台管理 | http://localhost:3000/admin |
| 登录页面 | http://localhost:3000/login |

**测试账号：**
- 用户名：`admin`
- 密码：`123456`

---

## 📁 项目结构

```
selfmedia-app/
├── backend/                 # 后端 API
│   ├── models/             # 数据模型
│   │   ├── Article.js      # 文章模型
│   │   ├── Comment.js      # 评论模型
│   │   ├── Follow.js       # 关注模型
│   │   ├── Notification.js # 通知模型
│   │   └── ViewStats.js    # 统计模型
│   ├── routes/             # 路由
│   │   ├── articles.js     # 文章路由
│   │   ├── comments.js     # 评论路由
│   │   ├── drafts.js       # 草稿路由
│   │   ├── follows.js      # 关注路由
│   │   ├── interactions.js # 互动路由
│   │   ├── notifications.js# 通知路由
│   │   ├── schedule.js     # 定时发布路由
│   │   ├── stats.js        # 统计路由
│   │   ├── upload.js       # 上传路由
│   │   └── user-profile.js # 用户画像路由
│   ├── middleware/         # 中间件
│   ├── utils/              # 工具函数
│   │   └── email.js        # 邮件工具
│   ├── server.js           # 入口文件
│   ├── package.json
│   └── .env.example
├── web/                    # 前端 Next.js
│   ├── app/               # 页面
│   │   ├── admin/         # 后台管理
│   │   │   ├── articles/  # 文章管理
│   │   │   ├── drafts/    # 草稿箱
│   │   │   ├── stats/     # 数据统计
│   │   │   ├── profile/   # 用户画像
│   │   │   └── ...
│   │   ├── article/       # 文章详情
│   │   ├── login/         # 登录页面
│   │   └── ...
│   ├── components/        # 组件
│   │   ├── CommentList.tsx        # 评论组件
│   │   ├── FollowButton.tsx       # 关注按钮
│   │   ├── ImageUploader.tsx      # 图片上传
│   │   ├── InteractionButtons.tsx # 互动按钮
│   │   ├── NotificationCenter.tsx # 通知中心
│   │   ├── ReadingProgress.tsx    # 阅读进度
│   │   ├── ThemeToggle.tsx        # 主题切换
│   │   └── ...
│   ├── lib/               # 工具库
│   ├── store/             # 状态管理
│   ├── package.json
│   └── .env.local.example
├── mobile-app/            # 移动端 React Native
├── start.sh               # 一键启动脚本
├── README.md              # 本文件
├── TESTING_GUIDE.md       # 测试指南
├── QUICK_START.md         # 快速启动指南
└── DEVELOPMENT_COMPLETE.md # 开发完成报告
```

---

## 🧪 功能测试

详细测试指南请查看：[TESTING_GUIDE.md](./TESTING_GUIDE.md)

### 快速测试清单

#### ✅ 内容管理
- [ ] 访问后台文章列表
- [ ] 新建一篇文章
- [ ] 上传封面图片
- [ ] 发布文章
- [ ] 查看草稿箱

#### ✅ 用户互动
- [ ] 打开文章详情页
- [ ] 发表评论
- [ ] 点赞文章
- [ ] 收藏文章
- [ ] 分享文章

#### ✅ 数据统计
- [ ] 访问统计页面
- [ ] 查看用户画像

#### ✅ 界面优化
- [ ] 切换深色模式
- [ ] 调整字体大小
- [ ] 打开阅读模式
- [ ] 查看目录导航

#### ✅ 通知系统
- [ ] 查看站内通知
- [ ] 测试推送通知

---

## 🛠️ 技术栈

### 后端
- **框架:** Express.js 4.x
- **数据库:** MongoDB 4.4+
- **ORM:** Mongoose 7.x
- **认证:** JWT (jsonwebtoken 9.x)
- **验证:** Joi 17.x
- **文件上传:** Multer 1.4.x
- **邮件:** Nodemailer 6.x
- **密码加密:** bcryptjs 2.4.x

### 前端
- **框架:** Next.js 14
- **语言:** TypeScript 5.x
- **UI 库:** React 18.x
- **状态管理:** Zustand 4.4.x
- **样式:** Tailwind CSS 3.4.x
- **HTTP 客户端:** Axios 1.6.x

### 移动端
- **框架:** React Native (Expo)
- **导航:** React Navigation 6.x
- **状态管理:** Zustand

---

## 📝 API 文档

### 认证相关

```bash
# 用户登录
POST /api/auth/login
{
  "identifier": "admin",
  "password": "123456"
}

# 用户注册
POST /api/auth/register
{
  "username": "test",
  "email": "test@example.com",
  "password": "123456"
}
```

### 文章相关

```bash
# 获取文章列表
GET /api/articles?page=1&limit=20

# 获取文章详情
GET /api/articles/:id

# 创建文章（需要登录）
POST /api/articles
Authorization: Bearer <token>
{
  "title": "文章标题",
  "summary": "文章摘要",
  "content": "文章内容",
  "status": "published"
}

# 更新文章（需要登录）
PUT /api/articles/:id

# 删除文章（需要登录）
DELETE /api/articles/:id
```

### 互动相关

```bash
# 发表评论（需要登录）
POST /api/comments
{
  "articleId": "文章 ID",
  "content": "评论内容"
}

# 点赞文章（需要登录）
POST /api/interactions/articles/:id/like

# 关注用户（需要登录）
POST /api/follows/:userId
```

### 统计相关

```bash
# 获取总统计（管理员）
GET /api/stats/overview?days=30

# 获取访问趋势（管理员）
GET /api/stats/daily-trend?days=30

# 获取热门文章
GET /api/stats/articles/hot?limit=10&days=7
```

### 通知相关

```bash
# 获取通知列表（需要登录）
GET /api/notifications?limit=10

# 标记为已读（需要登录）
PUT /api/notifications/:id/read

# 全部标记为已读（需要登录）
PUT /api/notifications/read-all
```

完整 API 文档请查看：[API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)

---

## 🐛 常见问题

### MongoDB 连接失败

**错误：** `MongoServerError: connect ECONNREFUSED`

**解决：**
```bash
# 检查 MongoDB 是否运行
ps aux | grep mongod

# 启动 MongoDB
sudo systemctl start mongod
```

### 端口被占用

**错误：** `EADDRINUSE: address already in use`

**解决：**
```bash
# 查找占用端口的进程
lsof -i :3000
lsof -i :3001

# 杀死进程
kill -9 <PID>
```

### 依赖安装失败

**错误：** `Module not found`

**解决：**
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

### 前端构建失败

**错误：** `Build failed because of webpack errors`

**解决：**
```bash
cd web
rm -rf .next
npm run build
```

---

## 📄 许可证

MIT License

---

## 👨‍💻 开发信息

**开发完成日期：** 2026-03-29  
**总代码量：** ~6500 行  
**总文件数：** 70+ 个  
**开发时间：** 30 分钟  
**功能完成度：** 100% (22/22)

### 开发团队

- **开发者:** AI Assistant
- **项目地址:** https://github.com/xiangqinburuouyu/selfmedia-app

---

## 🙋 需要帮助？

### 文档资源

- [QUICK_START.md](./QUICK_START.md) - 快速启动指南
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - 功能测试指南
- [DEVELOPMENT_COMPLETE.md](./DEVELOPMENT_COMPLETE.md) - 开发完成报告
- [SERVER_UPDATE_GUIDE.md](./SERVER_UPDATE_GUIDE.md) - 服务器更新指南

### 联系方式

- **GitHub Issues:** https://github.com/xiangqinburuouyu/selfmedia-app/issues
- **邮箱:** qini0113@163.com

---

## 🎉 功能亮点

1. **完整的内容管理系统** - 从创建到发布的全流程管理
2. **丰富的用户互动** - 评论、点赞、收藏、分享、关注
3. **实时的数据统计** - 访问统计、用户画像、阅读偏好
4. **优秀的用户体验** - 深色模式、字体调整、阅读模式
5. **完善的通知系统** - 站内、邮件、推送三重通知

---

**祝使用愉快！** 🚀

---

*最后更新：2026-03-29*
