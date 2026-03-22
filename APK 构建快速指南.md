# 📱 APK 构建 - 3 步搞定

**更新时间**: 2026-03-21 09:21

---

## 🚀 最简单方式：Expo 网页构建

### 步骤 1：访问 Expo 并登录

**网址**: https://expo.dev

**登录账号**:
- 邮箱：`qini0113@163.com`
- 密码：`dong236386`

---

### 步骤 2：创建项目

1. 登录后点击右上角 **头像**
2. 选择 **"Create Project"** 或 **"New Project"**
3. 输入项目名称：`selfmedia-app`
4. 点击 **"Create"**

---

### 步骤 3：上传代码并构建

**选项 A：使用 GitHub（推荐）**

1. 将代码推送到 GitHub
2. 在 Expo 项目页面选择 **"Connect GitHub repository"**
3. 选择你的仓库
4. 点击 **"Build"** → 选择 **"Android"**
5. 等待 10-20 分钟
6. 下载 APK

**选项 B：使用 EAS CLI**

```bash
cd /home/admin/openclaw/workspace/temp/自媒体 APP/mobile-app

# 配置项目
eas build:configure

# 开始构建
eas build --platform android --profile preview
```

---

## 📦 代码已打包 ready

**位置**: `/home/admin/openclaw/workspace/temp/自媒体 APP/selfmedia-app-code.tar.gz`
**大小**: 228 MB
**内容**:
- ✅ backend/ (后端服务)
- ✅ mobile-app/ (前端 APP)
- ✅ docs/ (所有文档)

---

## 🔗 快速链接

| 链接 | 用途 |
|------|------|
| https://expo.dev | Expo 官网 - 创建项目 |
| https://expo.dev/accounts/[your-account]/projects | 查看构建进度 |
| https://docs.expo.dev/build/introduction/ | EAS Build 文档 |

---

## ⏱️ 构建时间

- **准备时间**: 2-5 分钟（上传代码）
- **构建时间**: 10-20 分钟
- **总计**: 约 15-25 分钟

---

## 📥 下载 APK

构建完成后：
1. 会收到邮件通知
2. 登录 https://expo.dev
3. 进入项目页面
4. 点击 **"Downloads"**
5. 下载 APK 文件

---

## 📱 安装 APK

1. 下载 APK 到手机
2. 设置 → 安全 → 允许"未知来源"安装
3. 点击 APK 文件安装
4. 打开应用测试

---

## 💡 常见问题

### Q: 构建失败怎么办？
A: 检查代码是否有错误，查看构建日志

### Q: 构建太慢？
A: 云端构建通常 10-20 分钟，请耐心等待

### Q: APK 太大？
A: 228MB 是开发包，发布版会更小

### Q: 如何测试 iOS？
A: 在 Expo 选择 "iOS" 构建，需要 Apple Developer 账号

---

## 🎯 现在开始

1. **打开浏览器**
2. **访问** https://expo.dev
3. **登录** qini0113@163.com
4. **创建项目** selfmedia-app
5. **上传代码**
6. **点击 Build**

---

**准备好了吗？开始构建吧！** 🚀
