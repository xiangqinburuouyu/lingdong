# 自媒体 Web 网站 - 项目打包说明

## 📦 项目信息

- **项目名称**: 自媒体 Web 网站
- **技术栈**: Next.js 14 + TypeScript + Tailwind CSS
- **开发时间**: 2026-03-24
- **版本**: v1.0.0

## 📁 项目结构

```
web/
├── app/                    # Next.js 应用目录
│   ├── admin/             # 后台管理页面
│   │   ├── articles/      # 文章管理
│   │   ├── categories/    # 分类管理
│   │   ├── comments/      # 评论审核
│   │   ├── newsflash/     # 快讯管理
│   │   ├── users/         # 用户管理
│   │   ├── settings/      # 系统设置
│   │   ├── layout.tsx     # 后台布局
│   │   ├── page.tsx       # 后台首页
│   │   └── globals.css    # 后台样式
│   ├── article/[id]/      # 文章详情页
│   ├── category/[slug]/   # 分类页
│   ├── search/            # 搜索页
│   ├── newsflash/         # 快讯页
│   ├── video/             # 视频页
│   ├── login/             # 登录页
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── components/            # 可复用组件
│   ├── Header.tsx        # 头部导航
│   ├── Footer.tsx        # 页脚
│   ├── ArticleCard.tsx   # 文章卡片
│   ├── Sidebar.tsx       # 侧边栏
│   └── CategoryNav.tsx   # 分类导航
├── lib/                   # 工具库
│   ├── api.ts            # API 客户端
│   ├── mockAuth.ts       # 模拟认证
│   ├── utils.ts          # 工具函数
│   └── siteSettings.ts   # 网站设置管理
├── store/                 # 状态管理
│   └── useStore.ts       # Zustand store
├── package.json          # 项目配置
├── next.config.js        # Next.js 配置
├── tailwind.config.ts    # Tailwind 配置
├── tsconfig.json         # TypeScript 配置
└── README.md             # 项目说明
```

## 🚀 部署步骤

### 1. 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 2. 生产构建

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 访问 http://localhost:3000
```

### 3. 部署到 Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel

# 按提示操作即可
```

### 4. 部署到服务器

```bash
# 1. 构建项目
npm run build

# 2. 使用 PM2 管理进程
npm install -g pm2
pm2 start npm --name "selfmedia-web" -- start

# 3. 设置开机自启
pm2 startup
pm2 save
```

## ⚙️ 环境配置

创建 `.env.local` 文件：

```env
# API 地址（如果有后端）
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# 其他配置
NEXT_PUBLIC_SITE_NAME=自媒体
```

## 📊 功能清单

### 前台功能
- ✅ 首页（文章列表、快讯、热门排行）
- ✅ 文章详情页（阅读、收藏、评论）
- ✅ 分类浏览（20+ 分类）
- ✅ 搜索功能（关键词搜索、热门搜索）
- ✅ 快讯页面（7x24 小时快讯）
- ✅ 视频页面（视频列表）
- ✅ 用户登录/注册

### 后台功能
- ✅ 仪表盘（数据统计、快捷操作）
- ✅ 文章管理（增删改查、查看）
- ✅ 分类管理（增删改查）
- ✅ 快讯管理（增删改查）
- ✅ 用户管理（启用/禁用、删除）
- ✅ 评论审核（通过/拒绝、删除）
- ✅ 系统设置（网站配置、实时更新）

### 其他功能
- ✅ 响应式设计（手机/平板/桌面）
- ✅ 登录持久化
- ✅ 按钮统一样式
- ✅ 侧边栏收缩/展开
- ✅ 系统设置实时更新

## 🔐 测试账号

```
管理员账号:
用户名：admin
密码：123456
```

## 📝 注意事项

1. **Node 版本**: 建议使用 Node.js 18 或更高版本
2. **依赖安装**: 首次运行前请执行 `npm install`
3. **端口占用**: 默认使用 3000 端口，如被占用请修改
4. **生产部署**: 建议设置环境变量和 HTTPS

## 🛠️ 技术栈

- **框架**: Next.js 14.2.5
- **语言**: TypeScript 5.0
- **样式**: Tailwind CSS 3.4
- **状态管理**: Zustand 4.4
- **HTTP 客户端**: Axios 1.6
- **路由**: Next.js App Router

## 📞 技术支持

如有问题，请查看：
- Next.js 文档：https://nextjs.org/docs
- Tailwind CSS 文档：https://tailwindcss.com/docs

---

**打包时间**: 2026-03-24
**打包版本**: v1.0.0
