# API 文档

## 基础信息

- **Base URL**: `http://localhost:3000/api`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON

## 认证说明

需要在请求头中携带 token:
```
Authorization: Bearer <your-token>
```

---

## 认证接口

### 1. 用户注册
```
POST /auth/register
```

**请求体**:
```json
{
  "username": "zhangsan",
  "email": "zhangsan@example.com",
  "phone": "13800138000",
  "password": "123456",
  "nickname": "张三"
}
```

**响应**:
```json
{
  "message": "注册成功",
  "data": {
    "user": {
      "id": "...",
      "username": "zhangsan",
      "email": "zhangsan@example.com",
      "nickname": "张三"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. 用户登录
```
POST /auth/login
```

**请求体**:
```json
{
  "email": "zhangsan@example.com",
  "password": "123456"
}
```

**响应**:
```json
{
  "message": "登录成功",
  "data": {
    "user": { ... },
    "token": "..."
  }
}
```

---

### 3. 获取当前用户信息
```
GET /auth/me
```

**需要认证**: ✅

**响应**:
```json
{
  "data": {
    "user": {
      "id": "...",
      "username": "zhangsan",
      "email": "zhangsan@example.com",
      "nickname": "张三",
      "avatar": "...",
      "bio": "...",
      "articleCount": 10,
      "followerCount": 100
    }
  }
}
```

---

### 4. 用户登出
```
POST /auth/logout
```

**需要认证**: ✅

---

## 用户接口

### 1. 获取用户信息
```
GET /users/:id
```

**响应**:
```json
{
  "data": {
    "user": { ... }
  }
}
```

---

### 2. 更新用户信息
```
PUT /users/:id
```

**需要认证**: ✅ (只能更新自己的信息)

**请求体**:
```json
{
  "nickname": "新昵称",
  "avatar": "https://...",
  "bio": "个人简介"
}
```

---

### 3. 获取用户的文章列表
```
GET /users/:id/articles?page=1&limit=10
```

---

## 文章接口

### 1. 获取文章列表
```
GET /articles?page=1&limit=10&category=xxx&search=关键词
```

**查询参数**:
- `page`: 页码 (默认 1)
- `limit`: 每页数量 (默认 10)
- `category`: 分类 ID (可选)
- `tag`: 标签 (可选)
- `search`: 搜索关键词 (可选)
- `sort`: 排序方式 (默认 -createdAt)

**响应**:
```json
{
  "data": {
    "articles": [
      {
        "id": "...",
        "title": "文章标题",
        "summary": "文章摘要",
        "coverImage": "...",
        "author": {
          "username": "...",
          "nickname": "...",
          "avatar": "..."
        },
        "category": {
          "name": "分类名",
          "slug": "category-slug"
        },
        "viewCount": 1000,
        "likeCount": 50,
        "commentCount": 10,
        "createdAt": "2026-03-21T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
}
```

---

### 2. 获取文章详情
```
GET /articles/:id
```

**响应**:
```json
{
  "data": {
    "article": {
      "id": "...",
      "title": "文章标题",
      "content": "文章内容...",
      "coverImage": "...",
      "author": { ... },
      "category": { ... },
      "tags": ["标签 1", "标签 2"],
      "viewCount": 1001,
      "likeCount": 50,
      "commentCount": 10,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

---

### 3. 创建文章
```
POST /articles
```

**需要认证**: ✅

**请求体**:
```json
{
  "title": "文章标题",
  "summary": "文章摘要",
  "content": "文章内容...",
  "coverImage": "https://...",
  "categoryId": "...",
  "tags": ["标签 1", "标签 2"],
  "isFeatured": false,
  "isPaid": false,
  "price": 0
}
```

---

### 4. 更新文章
```
PUT /articles/:id
```

**需要认证**: ✅ (仅限作者或管理员)

---

### 5. 删除文章
```
DELETE /articles/:id
```

**需要认证**: ✅ (仅限作者或管理员)

---

### 6. 点赞文章
```
POST /articles/:id/like
```

**需要认证**: ✅

---

### 7. 收藏文章
```
POST /articles/:id/bookmark
```

**需要认证**: ✅

---

## 分类接口

### 1. 获取全部分类
```
GET /categories
```

**响应**:
```json
{
  "data": {
    "categories": [
      {
        "id": "...",
        "name": "科技",
        "slug": "keji",
        "description": "科技类文章",
        "icon": "...",
        "articleCount": 100
      }
    ]
  }
}
```

---

### 2. 获取分类详情
```
GET /categories/:id
```

---

### 3. 获取分类下的文章
```
GET /categories/:id/articles?page=1&limit=10
```

---

## 评论接口

### 1. 获取评论列表
```
GET /comments?article=文章 ID&page=1&limit=20
```

**响应**:
```json
{
  "data": {
    "comments": [
      {
        "id": "...",
        "content": "评论内容",
        "user": {
          "username": "...",
          "nickname": "...",
          "avatar": "..."
        },
        "likeCount": 5,
        "createdAt": "..."
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 2. 获取评论的回复
```
GET /comments/:id/replies?page=1&limit=10
```

---

### 3. 发表评论
```
POST /comments
```

**需要认证**: ✅

**请求体**:
```json
{
  "content": "评论内容",
  "articleId": "...",
  "parentId": "..." // 可选，回复评论时填写
}
```

---

### 4. 删除评论
```
DELETE /comments/:id
```

**需要认证**: ✅ (仅限评论作者或管理员)

---

### 5. 点赞评论
```
POST /comments/:id/like
```

**需要认证**: ✅

---

## 错误响应

所有错误返回统一格式:

```json
{
  "message": "错误信息",
  "code": "错误代码"
}
```

### 常见错误代码

| 代码 | 说明 | HTTP 状态码 |
|------|------|------------|
| UNAUTHORIZED | 未认证 | 401 |
| INVALID_TOKEN | Token 无效 | 401 |
| TOKEN_EXPIRED | Token 过期 | 401 |
| FORBIDDEN | 权限不足 | 403 |
| USER_NOT_FOUND | 用户不存在 | 404 |
| ARTICLE_NOT_FOUND | 文章不存在 | 404 |
| COMMENT_NOT_FOUND | 评论不存在 | 404 |
| USER_EXISTS | 用户已存在 | 409 |
| SERVER_ERROR | 服务器错误 | 500 |

---

## 测试示例

使用 curl 测试:

```bash
# 注册
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"123456"}'

# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# 获取文章列表
curl http://localhost:3000/api/articles?page=1&limit=10

# 获取文章详情（需要 token）
curl http://localhost:3000/api/articles/文章 ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```
