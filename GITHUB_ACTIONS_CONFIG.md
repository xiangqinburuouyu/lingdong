# GitHub Actions 配置指南

---

## 🔐 配置 Expo Token

### 步骤 1：获取 Expo Token

1. 访问 https://expo.dev/settings/access-tokens
2. 点击 "Create Access Token"
3. 填写信息：
   - **Name**: `github-actions-selfmedia`
   - **Expiration**: 选择 90 天或更长
4. 点击 "Create"
5. **复制 token**（格式：`exu_xxxxxxxxxxxxxxxxxxxx`）

⚠️ **重要**: Token 只显示一次，请立即保存！

### 步骤 2：添加到 GitHub Secrets

1. 打开 GitHub 仓库：https://github.com/xiangqinburuouyu/lingdong
2. 进入 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 填写：
   - **Name**: `EXPO_TOKEN`
   - **Secret**: 粘贴你的 Expo token
5. 点击 **Add secret**

### 步骤 3：验证配置

在 GitHub 仓库的 Actions 页面，应该能看到新配置的工作流。

---

## 🚀 触发构建

### 方式 1：推送代码自动触发

```bash
cd /home/admin/openclaw/workspace/temp/自媒体 APP/mobile-app

# 提交代码
git add .
git commit -m "Update app"
git push origin main
```

推送后会自动触发构建。

### 方式 2：手动触发

1. 访问 https://github.com/xiangqinburuouyu/lingdong/actions
2. 选择 "Build Android APK (Advanced)" 工作流
3. 点击 **Run workflow**
4. 选择分支和构建 profile
5. 点击 **Run workflow**

---

## 📦 获取 APK

### 方式 1：Actions Artifacts

1. 访问 https://github.com/xiangqinburuouyu/lingdong/actions
2. 点击完成的构建
3. 在页面底部找到 **Artifacts**
4. 点击 `selfmedia-app-*.apk` 下载

⚠️ **注意**: Artifacts 保留 30 天

### 方式 2：GitHub Releases（如果使用 tag）

1. 创建 tag 并推送：
   ```bash
   git tag v1.0.5
   git push origin v1.0.5
   ```
2. 访问 https://github.com/xiangqinburuouyu/lingdong/releases
3. 下载最新版本的 APK

### 方式 3：Expo Dashboard

1. 访问 https://expo.dev/accounts/lindons/projects/selfmedia-app/builds
2. 找到最新的构建
3. 点击 **Download** 下载 APK

---

## ⚙️ 工作流说明

### build.yml（基础版）

- 简单的构建提交
- 适合日常开发
- 构建完成后在 Expo 查看

### build-advanced.yml（增强版）

- 等待构建完成
- 自动下载 APK
- 上传到 GitHub Artifacts
- 支持 tag 自动发布 Release
- 适合正式发布

---

## 🔧 自定义配置

### 修改构建 Profile

编辑 `.github/workflows/build-advanced.yml`：

```yaml
# 默认使用 preview
- name: Build APK
  run: eas build --platform android --profile preview --non-interactive

# 或手动选择
on:
  workflow_dispatch:
    inputs:
      build_profile:
        type: choice
        options:
          - preview
          - production
```

### 修改触发条件

```yaml
on:
  push:
    branches: [main, develop]  # 添加更多分支
    tags:
      - 'v*'                   # 版本 tag
  schedule:
    - cron: '0 2 * * 1'        # 每周一凌晨 2 点
```

### 添加通知

```yaml
- name: Notify Slack
  if: always()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Build ${{ job.status }}",
        "build_url": "https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 📊 GitHub Actions 使用限制

| 计划 | 每月分钟数 | 并发任务 |
|------|-----------|----------|
| Free | 2,000 分钟 | 20 |
| Pro | 3,000 分钟 | 20 |
| Team | 3,000 分钟 | 20 |
| Enterprise | 50,000 分钟 | 40 |

**我们的构建**: 每次约 25 分钟  
**每月可构建**: 约 80 次

---

## 🐛 常见问题

### Q: Build 失败怎么办？

A: 查看 Actions 日志：
1. 访问 Actions 页面
2. 点击失败的构建
3. 查看具体错误信息
4. 根据错误修复代码后重新触发

### Q: 如何取消构建？

A: 在 Actions 页面点击 **Cancel workflow**

### Q: 如何加快构建速度？

A: 
1. 使用缓存（已配置）
2. 减少 node_modules 大小
3. 使用自托管 runner

### Q: Artifacts 过期了怎么办？

A: 
1. 增加 `retention-days`
2. 使用 GitHub Releases
3. 下载到本地保存

---

## ✅ 检查清单

- [ ] 创建 Expo token
- [ ] 添加 GitHub Secret (EXPO_TOKEN)
- [ ] 创建工作流文件
- [ ] 推送代码触发构建
- [ ] 验证 APK 下载
- [ ] 测试安装到手机

---

**配置完成后，每次 push 代码都会自动构建 APK！** 🎉
