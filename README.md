# 自媒体博客 APP - React Native 前端

基于 React Native (Expo) 开发的跨平台移动应用，兼容 iOS 和 Android。

## 🚀 快速开始

### 环境要求

- Node.js >= 18.x
- npm 或 yarn
- Expo CLI
- iOS Simulator (Mac) 或 Android Emulator

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
# 启动 Expo
npx expo start

# 或直接运行在特定平台
npm run ios    # iOS
npm run android # Android
```

### 扫描 QR 码

启动后，使用 Expo Go APP 扫描二维码即可在真机上运行。

## 📁 项目结构

```
mobile-app/
├── App.js                  # 应用入口
├── app.json               # Expo 配置
├── package.json           # 依赖配置
├── src/
│   ├── components/        # 可复用组件
│   │   ├── ArticleCard.js    # 文章卡片
│   │   ├── NavBar.js         # 底部导航
│   │   └── SearchBar.js      # 搜索栏
│   ├── screens/           # 页面
│   │   ├── HomeScreen.js     # 首页
│   │   ├── ArticleScreen.js  # 文章详情
│   │   ├── LoginScreen.js    # 登录页
│   │   └── ProfileScreen.js  # 个人中心
│   ├── config/            # 配置
│   │   └── api.js            # API 配置
│   └── store/             # 状态管理
│       └── authStore.js      # 认证状态
```

## 🎨 UI 设计

参考钛媒体移动端风格：

- **主色调**: `#0066FF` (钛媒体蓝)
- **背景色**: `#F5F5F5` (浅灰)
- **文字色**: `#1A1A1A` (主文字), `#666` (次要), `#999` (辅助)

### 核心组件

1. **ArticleCard** - 文章卡片，展示封面、标题、摘要、作者、统计数据
2. **NavBar** - 底部 4 Tab 导航（首页、分类、发现、我的）
3. **SearchBar** - 顶部搜索栏，支持搜索和清除

## 📱 页面说明

### HomeScreen (首页)
- 文章列表展示
- 分类标签筛选
- 下拉刷新
- 上拉加载更多

### ArticleScreen (文章详情)
- 文章完整内容
- 作者信息卡片
- 点赞、收藏、评论、分享操作
- 标签展示

### LoginScreen (登录页)
- 邮箱密码登录
- 微信/Apple 第三方登录（待实现）
- 注册入口

### ProfileScreen (个人中心)
- 用户信息展示
- 我的文章/收藏/点赞/评论
- 设置入口
- 退出登录

## 🔧 API 集成

所有 API 调用配置在 `src/config/api.js` 中，使用 axios 封装。

**修改 API 地址**:
```javascript
// src/config/api.js
const API_BASE_URL = 'http://YOUR_SERVER_IP:3000/api';
```

**注意**: 真机调试时需要使用局域网 IP，不能用 localhost。

## 📦 构建发布

### iOS

```bash
# 构建 IPA
eas build --platform ios
```

### Android

```bash
# 构建 APK
eas build --platform android
```

## ⚠️ 开发注意事项

1. **真机调试**: 确保手机和电脑在同一局域网，API 地址改为电脑 IP
2. **iOS 模拟器**: 需要 Mac + Xcode
3. **Android 模拟器**: 可使用 Android Studio 或 Expo Go
4. **热重载**: 修改代码后自动刷新，按 `r` 手动刷新

## 📝 待办事项

- [ ] 分类页面实现
- [ ] 发现页面实现
- [ ] 评论页面实现
- [ ] 搜索页面实现
- [ ] 分享功能（微信、微博）
- [ ] 推送通知
- [ ] 深色模式
- [ ] 离线缓存

## 📄 许可证

MIT License
