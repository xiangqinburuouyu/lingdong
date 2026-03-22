# 🔐 获取 Expo 访问令牌

---

## 你的账号信息
- **邮箱**: qini0113@163.com
- **状态**: 需要在浏览器中登录

---

## 📱 步骤 1：在浏览器中登录

### 方式 A：使用当前打开的浏览器
1. 访问：https://expo.dev/login
2. 输入邮箱：`qini0113@163.com`
3. 输入密码：`dong236386`
4. 点击 "Log in"

### 方式 B：使用你的手机/电脑浏览器
1. 打开浏览器
2. 访问：https://expo.dev/login
3. 登录你的账号

---

## 🔑 步骤 2：获取访问令牌

登录后：

1. **访问令牌页面**：
   https://expo.dev/settings/access-tokens

2. **创建新令牌**：
   - 点击 "Create Access Token"
   - Name: `selfmedia-app-build`
   - Expiration: 选择 `90 days`（或更长）
   - 点击 "Create"

3. **复制令牌**：
   ```
   exu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   ⚠️ **重要**：令牌只显示一次，请立即复制保存！

---

## 🚀 步骤 3：告诉我令牌

复制令牌后，在聊天中告诉我：
```
我的 token 是：exu_xxxxxxxxxx
```

然后我会帮你执行：
```bash
export EXPO_TOKEN=exu_xxxxxxxxxx
eas build --platform android --profile preview
```

---

## 💡 快捷方式

如果你已经登录，直接访问：
https://expo.dev/settings/access-tokens

---

## 📞 需要帮助？

- **登录问题**: https://expo.dev/support
- **令牌问题**: https://docs.expo.dev/accounts/programmatic-access/

---

**下一步**: 登录 → 获取令牌 → 告诉我令牌 → 开始构建 APK！
