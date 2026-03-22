# 🔐 EAS 登录指南

---

## 方式一：网页登录（推荐 ⭐⭐⭐⭐⭐）

### 步骤 1：访问 Expo 官网
https://expo.dev

### 步骤 2：注册/登录账号
- 点击 "Sign Up" 注册新账号（免费）
- 或 "Log In" 登录已有账号

### 步骤 3：获取访问令牌
1. 登录后点击右上角头像
2. 选择 "Account Settings"
3. 找到 "Access Tokens" 选项卡
4. 点击 "Create Access Token"
5. 输入名称（如：selfmedia-app）
6. 复制生成的 token（只显示一次！）

### 步骤 4：使用 token 登录
```bash
export EXPO_TOKEN=你的 token
cd "/home/admin/openclaw/workspace/temp/自媒体 APP/mobile-app"
eas build --platform android --profile preview
```

---

## 方式二：命令行登录（需要交互）

```bash
eas login
```

然后按提示输入：
- Email 或用户名
- 密码

**注意**: 当前云端环境不支持交互式输入，请使用方式一。

---

## 方式三：使用现有账号

如果你已经有 Expo 账号：

1. **获取 Token**: https://expo.dev/settings/access-tokens
2. **设置环境变量**:
   ```bash
   export EXPO_TOKEN=exu_xxxxxxxxxxxxxxxxxxxx
   ```
3. **直接构建**:
   ```bash
   eas build --platform android --profile preview
   ```

---

## 📱 没有账号？快速注册

1. 访问 https://expo.dev
2. 点击 "Sign Up"
3. 使用以下方式注册：
   - GitHub 账号
   - Google 账号
   - 邮箱注册
4. 验证邮箱
5. 完成！

**全程免费**，无需信用卡！

---

## 🔑 获取 Token 截图指南

### 1. 进入设置页面
登录后访问：https://expo.dev/settings/access-tokens

### 2. 创建新 Token
点击 "Create Access Token"

### 3. 填写信息
- **Name**: selfmedia-app-build
- **Expiration**: 选择过期时间（建议 90 天）
- 点击 "Create"

### 4. 复制 Token
```
exu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
⚠️ **重要**: Token 只显示一次，请立即保存！

### 5. 使用 Token
```bash
export EXPO_TOKEN=exu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## ✅ 验证登录

```bash
# 查看当前登录用户
eas whoami

# 应该显示你的用户名
```

---

## 🚀 登录后构建 APK

```bash
cd "/home/admin/openclaw/workspace/temp/自媒体 APP/mobile-app"

# 开始构建
eas build --platform android --profile preview
```

构建开始后：
1. 会显示构建 ID 和进度链接
2. 约 10-20 分钟完成
3. 完成后提供 APK 下载链接

---

## 💡 常见问题

### Q: Token 安全吗？
A: Token 相当于密码，不要分享给他人，不要提交到代码仓库。

### Q: Token 过期了怎么办？
A: 重新创建一个新的 token 即可。

### Q: 可以删除 Token 吗？
A: 可以，在 Access Tokens 页面点击删除。

### Q: 免费账号有构建限制吗？
A: 免费账号每月有构建次数限制，但对于个人开发足够使用。

---

## 📞 获取帮助

- **Expo 登录页面**: https://expo.dev/login
- **注册页面**: https://expo.dev/signup
- **Token 管理**: https://expo.dev/settings/access-tokens
- **官方文档**: https://docs.expo.dev/accounts/programmatic-access/

---

**下一步**: 获取 Token 后，执行 `export EXPO_TOKEN=你的 token` 然后开始构建！
