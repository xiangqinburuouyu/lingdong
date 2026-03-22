# 🚀 GitHub Actions 自动构建 APK - 完整指南

---

## 📋 已创建的文件

以下文件已创建在 `mobile-app/` 目录：

```
mobile-app/
├── .github/
│   └── workflows/
│       ├── build.yml              # 基础版工作流
│       └── build-advanced.yml     # 增强版工作流
└── GITHUB_ACTIONS_CONFIG.md       # 配置指南
```

---

## ⚠️ 重要：推送失败原因

刚才推送失败是因为 **Personal Access Token 缺少 `workflow` 权限**。

### 解决方案

#### 方式 1：创建新的 PAT（推荐）

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. **勾选权限**:
   - ✅ `repo` (完整权限)
   - ✅ `workflow` ← **必须勾选！**
4. 生成 token
5. 使用新 token 推送

#### 方式 2：手动上传文件

1. 访问 https://github.com/xiangqinburuouyu/lingdong
2. 点击 **Add file** → **Upload files**
3. 上传以下文件：
   - `.github/workflows/build.yml`
   - `.github/workflows/build-advanced.yml`
   - `GITHUB_ACTIONS_CONFIG.md`
4. 提交到 main 分支

#### 方式 3：使用 GitHub CLI

```bash
# 安装 GitHub CLI
sudo apt install gh

# 登录
gh auth login

# 推送
cd /home/admin/openclaw/workspace/temp/自媒体 APP/mobile-app
git push origin main
```

---

## 🔐 配置 GitHub Secrets

### 步骤 1：获取 Expo Token

1. 访问 https://expo.dev/settings/access-tokens
2. 点击 "Create Access Token"
3. 填写：
   - **Name**: `github-actions-selfmedia`
   - **Expiration**: 90 天
4. 点击 "Create"
5. **复制 token**（格式：`exu_xxxxxxxxxxxxxxxxxxxx`）

⚠️ **重要**: Token 只显示一次！

### 步骤 2：添加到 GitHub

1. 访问 https://github.com/xiangqinburuouyu/lingdong/settings/secrets/actions
2. 点击 **New repository secret**
3. 填写：
   - **Name**: `EXPO_TOKEN`
   - **Secret**: 粘贴 Expo token
4. 点击 **Add secret**

---

## 🚀 触发构建

### 方式 1：推送代码（自动触发）

```bash
cd /home/admin/openclaw/workspace/temp/自媒体 APP/mobile-app

# 确保文件已上传到 GitHub
git status

# 推送代码
git push origin main
```

### 方式 2：手动触发

1. 访问 https://github.com/xiangqinburuouyu/lingdong/actions
2. 选择 **"Build Android APK (Advanced)"**
3. 点击 **Run workflow**
4. 选择分支（main）
5. 选择构建 profile（preview 或 production）
6. 点击 **Run workflow**

---

## 📦 获取 APK

### 构建完成后（约 15-25 分钟）

#### 方式 1：GitHub Actions Artifacts

1. 访问 https://github.com/xiangqinburuouyu/lingdong/actions
2. 点击完成的构建
3. 滚动到页面底部
4. 在 **Artifacts** 区域点击 `selfmedia-app-*.apk`
5. 下载 APK

⚠️ **注意**: Artifacts 保留 30 天

#### 方式 2：Expo Dashboard

1. 访问 https://expo.dev/accounts/lindons/projects/selfmedia-app/builds
2. 找到最新的构建
3. 点击 **Download** 下载 APK

---

## 📊 工作流说明

### build.yml（基础版）

```yaml
name: Build Android APK

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js + Expo
      - Install dependencies
      - Build APK (提交到 Expo)
      - Upload build info
```

**特点**:
- ✅ 简单快速
- ✅ 适合日常开发
- ⚠️ 需要手动到 Expo 下载 APK

### build-advanced.yml（增强版）

```yaml
name: Build Android APK (Advanced)

on:
  push:
    branches: [main]
    tags: ['v*']
  workflow_dispatch:
    inputs:
      build_profile:
        type: choice
        options: [preview, production]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js + Expo
      - Install dependencies
      - Build APK
      - Wait for build (轮询等待)
      - Download APK
      - Upload to Artifacts
      - Create Release (如果是 tag)
```

**特点**:
- ✅ 自动等待构建完成
- ✅ 自动下载 APK
- ✅ 上传到 GitHub Artifacts
- ✅ 支持 tag 自动发布 Release
- ✅ 适合正式发布

---

## 🎯 使用示例

### 日常开发构建

```bash
# 1. 提交代码
git add .
git commit -m "Update app features"
git push origin main

# 2. 自动触发构建
# 访问 https://github.com/xiangqinburuouyu/lingdong/actions 查看进度

# 3. 构建完成后下载 APK
# 在 Actions 页面或 Expo dashboard 下载
```

### 正式发布版本

```bash
# 1. 更新版本号
# 编辑 package.json 和 app.json 的 version 字段

# 2. 创建 tag
git tag v1.0.5
git push origin v1.0.5

# 3. 自动触发构建 + 创建 Release
# 访问 https://github.com/xiangqinburuouyu/lingdong/releases 查看
```

---

## ⚙️ 自定义配置

### 修改构建频率

编辑 `.github/workflows/build-advanced.yml`：

```yaml
on:
  push:
    branches: [main, develop]  # 添加更多分支
  schedule:
    - cron: '0 2 * * 1'        # 每周一凌晨 2 点构建
```

### 修改构建 Profile

```yaml
- name: Build APK
  run: eas build --platform android --profile production --non-interactive
```

### 添加通知

```yaml
- name: Notify on completion
  if: always()
  run: |
    echo "Build completed!"
    # 可以添加 Discord/Slack/邮件通知
```

---

## 💰 成本估算

| 项目 | Free 计划 | 我们的使用 |
|------|----------|-----------|
| Actions 分钟 | 2,000 分钟/月 | ~25 分钟/次 |
| 可构建次数 | - | ~80 次/月 |
| 存储空间 | 500 MB | ~100 MB/APK |
| 成本 | $0 | $0 |

---

## 🐛 故障排查

### Q: Workflow 没有触发？

A: 
1. 检查文件路径：`.github/workflows/`
2. 检查 YAML 语法
3. 查看 Actions 页面是否启用

### Q: Build 失败？

A:
1. 查看 Actions 日志
2. 检查 EXPO_TOKEN 是否正确
3. 检查 package.json 依赖

### Q: 构建太慢？

A:
1. 使用缓存（已配置）
2. 减少 node_modules 大小
3. 使用自托管 runner

### Q: Artifacts 找不到？

A:
1. 检查 retention-days（默认 30 天）
2. 使用 Releases 代替
3. 下载到本地保存

---

## ✅ 检查清单

- [ ] 创建 GitHub PAT（带 workflow 权限）
- [ ] 推送工作流文件到 GitHub
- [ ] 创建 Expo token
- [ ] 添加 GitHub Secret (EXPO_TOKEN)
- [ ] 推送代码触发构建
- [ ] 验证 APK 下载
- [ ] 测试安装到手机

---

## 📞 快速开始

```bash
# 1. 确保工作流文件已上传
ls -la /home/admin/openclaw/workspace/temp/自媒体 APP/mobile-app/.github/workflows/

# 2. 配置 GitHub Secret
# 访问 https://github.com/xiangqinburuouyu/lingdong/settings/secrets/actions
# 添加 EXPO_TOKEN

# 3. 触发构建
cd /home/admin/openclaw/workspace/temp/自媒体 APP/mobile-app
git push origin main

# 4. 查看构建进度
# 访问 https://github.com/xiangqinburuouyu/lingdong/actions
```

---

**配置完成后，每次 push 代码都会自动构建 APK！** 🎉
