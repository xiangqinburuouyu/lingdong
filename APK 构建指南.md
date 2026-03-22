# 自媒体博客 APP - APK 构建指南

---

## 🚀 快速构建（推荐方式）

### 方式一：EAS Cloud Build（最简单）

这是 Expo 官方推荐的构建方式，不需要本地 Android SDK。

#### 步骤 1: 安装 EAS CLI
```bash
npm install -g eas-cli
```

#### 步骤 2: 登录 Expo 账号
```bash
cd /home/admin/openclaw/workspace/temp/自媒体 APP/mobile-app
eas login
```

如果没有账号，访问 https://expo.dev 注册

#### 步骤 3: 配置项目
```bash
eas build:configure
```

#### 步骤 4: 构建 APK
```bash
# 构建 APK（内部测试版）
eas build --platform android --profile preview

# 或构建 AAB（Google Play 发布版）
eas build --platform android --profile production
```

#### 步骤 5: 下载 APK
构建完成后，EAS 会提供下载链接，通常在 10-20 分钟内完成。

---

### 方式二：本地构建（需要 Android SDK）

如果你有 Android Studio 和完整的开发环境：

#### 步骤 1: 安装 Android Studio
下载地址：https://developer.android.com/studio

#### 步骤 2: 安装 SDK 工具
```bash
# 在 Android Studio 中安装：
- Android SDK Platform 33
- Android SDK Build-Tools
- Android Emulator
```

#### 步骤 3: 配置环境变量
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

#### 步骤 4: 生成 APK
```bash
cd mobile-app

# 安装依赖
npm install

# 生成调试版 APK
npx expo run:android --variant debug

# 或生成发布版 APK（需要签名）
npx expo run:android --variant release
```

APK 输出位置：
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📋 构建前检查清单

### 1. 项目配置 ✅
- [x] app.json 配置正确
- [x] eas.json 配置正确
- [x] package.json 依赖完整

### 2. 资源文件 ⚠️
- [ ] icon.png (1024x1024)
- [ ] adaptive-icon.png (1024x1024)
- [ ] splash.png (1242x2436)
- [ ] favicon.png (48x48)

### 3. API 配置 ⚠️
- [ ] 修改 API 地址为实际服务器地址
- [ ] 测试后端服务可访问

### 4. Expo 账号 ⚠️
- [ ] 注册 expo.dev 账号
- [ ] 登录 EAS CLI

---

## 🔧 常见问题

### Q1: 构建失败 "Credentials not configured"
**解决**: 
```bash
eas credentials
```
按提示配置证书

### Q2: 构建时间过长
**解决**: 
- 云端构建通常需要 10-20 分钟
- 可以在 https://expo.dev/accounts/[your-account]/projects/[your-project]/builds 查看进度

### Q3: APK 安装失败
**解决**: 
- 确保允许"未知来源"安装
- 检查 Android 版本兼容性
- 重新下载 APK

### Q4: 应用无法连接后端
**解决**: 
- 修改 `app.json` 中的 `apiBaseUrl`
- 确保后端服务可公网访问
- 使用域名而不是 localhost

---

## 📱 APK 安装测试

### 在 Android 手机上安装

1. **下载 APK** - 从 EAS 构建页面下载
2. **传输到手机** - 通过 USB、微信、QQ 等
3. **允许安装** - 设置 > 安全 > 允许未知来源
4. **安装应用** - 点击 APK 文件安装
5. **测试功能** - 打开应用测试各项功能

---

## 🌐 后端 API 配置

### 开发环境（本地测试）
```json
{
  "extra": {
    "apiBaseUrl": "http://192.168.x.x:3000/api"
  }
}
```
注意：使用电脑 IP 地址，不是 localhost

### 生产环境（正式发布）
```json
{
  "extra": {
    "apiBaseUrl": "https://api.your-domain.com/api"
  }
}
```

---

## 📊 构建输出

### APK 文件信息
- **文件名**: selfmedia-app.apk
- **大小**: 约 30-50 MB
- **架构**: arm64-v8a, armeabi-v7a
- **Android 版本**: 5.0+ (API 21+)

### 构建产物
```
builds/
├── selfmedia-app.apk          # Android 安装包
├── selfmedia-app.aab          # Google Play 发布包
└── build-log.txt              # 构建日志
```

---

## 🎯 快速命令参考

```bash
# 登录
eas login

# 配置项目
eas build:configure

# 构建 APK
eas build --platform android --profile preview

# 查看构建状态
eas build:list

# 取消构建
eas build:cancel [build-id]

# 本地测试
npx expo start
npx expo run:android
```

---

## 📞 获取帮助

- **Expo 文档**: https://docs.expo.dev/
- **EAS Build 文档**: https://docs.expo.dev/build/introduction/
- **Expo 论坛**: https://forums.expo.dev/
- **项目问题**: 查看构建日志

---

## ✅ 构建完成后

1. **测试 APK** - 在多台设备上安装测试
2. **检查功能** - 确保所有功能正常
3. **性能测试** - 检查启动速度、流畅度
4. **收集反馈** - 向测试用户收集意见
5. **修复问题** - 根据反馈优化应用

---

**创建时间**: 2026-03-21  
**版本**: v1.0.0  
**构建工具**: EAS Build
