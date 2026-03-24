# 部署到 Vercel 指南

## 🚀 方法一：使用 Vercel CLI（推荐）

### 1. 安装 Vercel CLI
```bash
npm install -g vercel
```

### 2. 登录 Vercel
```bash
vercel login
```
按提示选择登录方式（GitHub/GitLab/Bitbucket/Email）

### 3. 部署项目
```bash
cd /home/admin/openclaw/workspace/temp/自媒体 APP/web
vercel --prod
```

### 4. 获取访问链接
部署完成后会显示：
```
🔍  Inspect: https://vercel.com/your-account/your-project
✅  Production: https://your-project.vercel.app
```

---

## 🌐 方法二：使用 Vercel 网页（最简单）

### 1. 访问 Vercel
打开 https://vercel.com

### 2. 登录/注册
- 使用 GitHub 账号登录（推荐）
- 或使用 GitLab/Bitbucket/Email

### 3. 导入项目
点击 **"Add New Project"**

### 4. 选择部署方式

#### 方式 A：从 GitHub 导入（推荐）
1. 选择 **"Import Git Repository"**
2. 选择 GitHub 仓库
3. 点击 **"Import"**

#### 方式 B：上传项目
1. 选择 **"Deploy from folder"**
2. 将 `web` 文件夹拖拽到上传区域
3. 等待上传完成

### 5. 配置项目
- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: `./`（保持默认）
- **Build Command**: `npm run build`（自动填充）
- **Output Directory**: `.next`（自动填充）

### 6. 点击部署
点击 **"Deploy"** 按钮

### 7. 等待部署完成
通常 1-2 分钟即可完成

### 8. 获取访问链接
部署完成后会显示：
```
https://your-project.vercel.app
```

---

## ⚙️ 环境变量配置

如果项目需要环境变量，在 Vercel 项目设置中添加：

1. 进入项目页面
2. 点击 **"Settings"**
3. 选择 **"Environment Variables"**
4. 添加以下变量：

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SITE_NAME=自媒体
```

---

## 📊 部署后的操作

### 查看部署状态
- 访问 https://vercel.com/dashboard
- 查看项目部署历史

### 自定义域名
1. 进入项目设置
2. 选择 **"Domains"**
3. 添加你的域名
4. 按提示配置 DNS

### 自动部署
如果从 GitHub 导入：
- 每次 push 到 main 分支会自动部署
- Pull Request 会创建预览部署

---

## 🔍 故障排查

### 构建失败
查看构建日志：
```bash
vercel logs
```

### 本地测试构建
```bash
npm run build
```

### 清除缓存重新部署
```bash
vercel --prod --force
```

---

## 📱 测试账号

部署后使用以下账号测试：
- 用户名：admin
- 密码：123456

---

## 💡 提示

1. **免费额度**: Vercel 免费个人版足够个人项目使用
2. **自动 HTTPS**: Vercel 自动提供 HTTPS
3. **全球 CDN**: 自动部署到全球边缘节点
4. **无需配置**: Next.js 项目零配置部署

---

**部署时间**: 2026-03-24
**预计耗时**: 2-5 分钟
