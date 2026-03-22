# 🚀 快速构建 APK - 3 步搞定

---

## 方式一：EAS 云端构建（推荐 ⭐）

**无需 Android SDK，最简单！**

### 第 1 步：登录 Expo

```bash
cd "/home/admin/openclaw/workspace/temp/自媒体 APP/mobile-app"
eas login
```

如果没有账号，访问 https://expo.dev 注册（免费）

### 第 2 步：配置项目

```bash
eas build:configure
```

按提示选择 `Android`

### 第 3 步：开始构建

```bash
# 构建 APK（内部测试）
eas build --platform android --profile preview
```

**等待 10-20 分钟**，构建完成后会提供下载链接！

---

## 方式二：本地构建（需要 Android Studio）

### 前提条件
- ✅ Android Studio 已安装
- ✅ Android SDK 已配置
- ✅ JAVA_HOME 已设置

### 构建命令

```bash
cd "/home/admin/openclaw/workspace/temp/自媒体 APP/mobile-app"

# 调试版 APK
npx expo run:android --variant debug

# 发布版 APK（需要签名）
npx expo run:android --variant release
```

**APK 位置**: `android/app/build/outputs/apk/`

---

## 📱 安装测试

### 下载 APK 后

1. **传输到手机** - 微信/QQ/USB
2. **允许安装** - 设置 > 安全 > 未知来源
3. **点击安装** - 打开 APK 文件
4. **测试应用** - 确保功能正常

---

## ⚠️ 重要提示

### 1. API 地址配置

构建前修改 `app.json` 中的 API 地址：

```json
{
  "extra": {
    "apiBaseUrl": "http://你的服务器 IP:3000/api"
  }
}
```

**注意**: 
- 不能用 `localhost`（手机无法访问）
- 使用公网 IP 或域名
- 确保后端服务已启动

### 2. 图标资源

确保以下文件存在：
- `assets/icon.png` (1024x1024)
- `assets/splash.png` (1242x2436)
- `assets/adaptive-icon.png` (1024x1024)

临时方案：使用占位图片，后续更新

### 3. 构建时间

- **云端构建**: 10-20 分钟
- **本地构建**: 5-10 分钟（首次更长）

---

## 🔗 有用链接

- **EAS 控制台**: https://expo.dev/accounts/[your-account]/projects
- **构建历史**: 登录后查看所有构建
- **Expo 文档**: https://docs.expo.dev/build/introduction/

---

## 💡 快速命令

```bash
# 查看构建状态
eas build:list

# 取消构建
eas build:cancel [BUILD_ID]

# 查看项目配置
eas project:view
```

---

**开始构建吧！** 🎉
