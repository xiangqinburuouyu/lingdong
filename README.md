# 自媒体博客 APP

一款兼容 iPhone 和 Android 的自媒体博客移动应用，参考钛媒体移动端设计。

## 📱 项目结构

```
自媒体 APP/
├── mobile-app/     # React Native 前端 (Expo)
├── backend/        # Node.js 后端 API
└── docs/           # 项目文档
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.x
- MongoDB >= 6.x
- npm 或 yarn
- Expo CLI (前端开发)

### 后端启动

```bash
cd backend

# 安装依赖
npm install

# 复制环境变量配置
cp .env.example .env

# 编辑 .env 文件，配置 MongoDB 连接

# 启动开发服务器
npm run dev
```

后端服务将在 `http://localhost:3000` 启动

### 前端启动

```bash
cd mobile-app

# 安装依赖
npm install

# 启动 Expo 开发服务器
npx expo start
```

## 📖 API 文档

详见 [docs/API 文档.md](./docs/API 文档.md)

## 🎨 UI 设计

参考钛媒体移动端风格，主要特点：
- 底部 4  Tab 导航（首页、分类、发现、我的）
- 卡片式文章展示
- 沉浸式阅读体验
- 支持深色模式

## 📋 功能清单

### MVP 功能（Iteration 1）
- [x] 用户注册/登录
- [x] 文章列表展示
- [x] 文章详情阅读
- [x] 分类浏览
- [x] 个人中心

### 互动功能（Iteration 2）
- [ ] 评论系统
- [ ] 点赞功能
- [ ] 收藏功能
- [ ] 搜索功能
- [ ] 分享功能

### 运营功能（Iteration 3）
- [ ] 推送通知
- [ ] 作者专栏
- [ ] 打赏功能
- [ ] 数据分析

## 🛠️ 技术栈

### 前端
- React Native (Expo)
- React Navigation
- Zustand (状态管理)
- Axios (HTTP 请求)

### 后端
- Node.js + Express
- MongoDB + Mongoose
- JWT (认证)
- Joi (数据验证)

## 📝 开发日志

详见 [开发路线图.md](./开发路线图.md)

## 📄 许可证

MIT License
