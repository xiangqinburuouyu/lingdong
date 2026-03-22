# 📱 APK 构建步骤

---

## 方式一：Expo 网页构建（最简单 ⭐⭐⭐⭐⭐）

### 步骤 1：访问 Expo
打开浏览器访问：https://expo.dev

### 步骤 2：登录账号
- **邮箱**: qini0113@163.com
- **密码**: dong236386

### 步骤 3：创建项目
1. 登录后点击右上角头像
2. 选择 "Create Project" 或 "New Project"
3. 输入项目名称：`selfmedia-app`
4. 点击 "Create"

### 步骤 4：上传代码

**选项 A：使用 GitHub（推荐）**
1. 将代码推送到 GitHub
2. 在 Expo 项目中选择 "Connect GitHub repository"
3. 选择 `selfmedia-app` 仓库
4. 自动触发构建

**选项 B：使用 EAS CLI**
```bash
cd /home/admin/openclaw/workspace/temp/自媒体 APP/mobile-app

# 配置项目
eas build:configure

# 开始构建
eas build --platform android --profile preview
```

### 步骤 5：等待构建
- 构建时间：10-20 分钟
- 可在 https://expo.dev/accounts/[your-account]/projects 查看进度

### 步骤 6：下载 APK
- 构建完成后会收到邮件通知
- 在 Expo 控制台点击 "Download" 下载 APK

---

## 方式二：本地构建（需要 Android Studio）

### 前提条件
- ✅ Android Studio 已安装
- ✅ Android SDK 已配置
- ✅ JDK 11+

### 构建步骤
```bash
cd /home/admin/openclaw/workspace/temp/自媒体 APP/mobile-app

# 生成 Android 项目
npx expo prebuild --platform android

# 构建调试版 APK
cd android
./gradlew assembleDebug

# APK 位置
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📦 代码包已准备

**位置**: `/home/admin/openclaw/workspace/temp/自媒体 APP/selfmedia-app-code.tar.gz`
**大小**: 228 MB
**内容**: 
- ✅ backend/ (后端服务)
- ✅ mobile-app/ (前端 APP)
- ✅ docs/ (所有文档)
- ✅ 所有配置文件

---

## 🔗 有用链接

| 链接 | 说明 |
|------|------|
| https://expo.dev | Expo 官网 |
| https://docs.expo.dev/build/introduction/ | EAS Build 文档 |
| https://expo.dev/settings/access-tokens | Access Tokens 管理 |

---

## 💡 快速命令

```bash
# 查看构建历史
eas build:list

# 取消构建
eas build:cancel [BUILD_ID]

# 查看项目配置
eas project:view
```

---

**开始构建吧！** 🚀
