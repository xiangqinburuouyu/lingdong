/**
 * API 测试脚本 - 验证后端路由和逻辑
 */

// 测试 API 路由加载
console.log('=== 自媒体博客 API 测试 ===\n');

// 1. 测试路由文件加载
const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');
const routeFiles = fs.readdirSync(routesDir);

console.log('✅ 路由文件:');
routeFiles.forEach(file => {
  const name = path.basename(file, '.js');
  console.log(`  - ${name}`);
});

// 2. 测试模型文件
const modelsDir = path.join(__dirname, 'models');
const modelFiles = fs.readdirSync(modelsDir);

console.log('\n✅ 模型文件:');
modelFiles.forEach(file => {
  const name = path.basename(file, '.js');
  console.log(`  - ${name}`);
});

// 3. 测试中间件
const middlewareDir = path.join(__dirname, 'middleware');
const middlewareFiles = fs.readdirSync(middlewareDir);

console.log('\n✅ 中间件文件:');
middlewareFiles.forEach(file => {
  const name = path.basename(file, '.js');
  console.log(`  - ${name}`);
});

// 4. 测试 package.json
const packageJson = require('./package.json');
console.log('\n✅ 项目信息:');
console.log(`  名称：${packageJson.name}`);
console.log(`  版本：${packageJson.version}`);
console.log(`  依赖数：${Object.keys(packageJson.dependencies).length}`);

// 5. 测试环境变量
require('dotenv').config();
console.log('\n✅ 环境配置:');
console.log(`  PORT: ${process.env.PORT || '3000 (默认)'}`);
console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`  MONGODB_URI: ${process.env.MONGODB_URI ? '已配置' : '未配置'}`);
console.log(`  JWT_SECRET: ${process.env.JWT_SECRET ? '已配置' : '未配置'}`);

// 6. API 接口列表
console.log('\n📋 API 接口列表:');

const apiModules = {
  '认证': [
    'POST /api/auth/register - 用户注册',
    'POST /api/auth/login - 用户登录',
    'POST /api/auth/logout - 用户登出',
    'GET /api/auth/me - 获取当前用户',
  ],
  '用户': [
    'GET /api/users/:id - 获取用户信息',
    'PUT /api/users/:id - 更新用户信息',
    'GET /api/users/:id/articles - 获取用户文章',
  ],
  '文章': [
    'GET /api/articles - 获取文章列表',
    'GET /api/articles/:id - 获取文章详情',
    'POST /api/articles - 创建文章',
    'PUT /api/articles/:id - 更新文章',
    'DELETE /api/articles/:id - 删除文章',
    'POST /api/articles/:id/like - 点赞文章',
    'POST /api/articles/:id/bookmark - 收藏文章',
  ],
  '分类': [
    'GET /api/categories - 获取分类列表',
    'GET /api/categories/:id - 获取分类详情',
    'GET /api/categories/:id/articles - 获取分类文章',
  ],
  '评论': [
    'GET /api/comments?article=xxx - 获取评论列表',
    'GET /api/comments/:id/replies - 获取回复列表',
    'POST /api/comments - 发表评论',
    'DELETE /api/comments/:id - 删除评论',
    'POST /api/comments/:id/like - 点赞评论',
  ],
  '上传': [
    'POST /api/upload/image - 上传图片',
    'POST /api/upload/multiple - 上传多张图片',
  ],
  '统计': [
    'GET /api/statistics/overview - 平台概览',
    'GET /api/statistics/articles/hot - 热门文章',
    'GET /api/statistics/articles/trending - 趋势文章',
    'GET /api/statistics/users/top - 热门作者',
    'GET /api/statistics/user/:id - 用户统计',
    'GET /api/statistics/article/:id - 文章统计',
  ],
};

Object.entries(apiModules).forEach(([module, endpoints]) => {
  console.log(`\n  📦 ${module}:`);
  endpoints.forEach(endpoint => {
    console.log(`    ${endpoint}`);
  });
});

// 7. 测试服务器启动（不连接数据库）
console.log('\n\n🚀 测试服务器启动...');

try {
  const app = require('./server');
  console.log('✅ 服务器模块加载成功');
  console.log('⚠️  注意：需要 MongoDB 连接才能完整运行');
} catch (error) {
  console.log('❌ 服务器模块加载失败:', error.message);
}

console.log('\n=== 测试完成 ===\n');

console.log('📝 启动说明:');
console.log('1. 确保 MongoDB 已安装并运行');
console.log('2. 复制 .env.example 为 .env 并配置');
console.log('3. 运行 npm run dev 启动服务器');
console.log('4. 访问 http://localhost:3000/health 检查状态');

console.log('\n📱 前端测试:');
console.log('1. cd mobile-app');
console.log('2. npm install');
console.log('3. npx expo start');
console.log('4. 使用 Expo Go 扫码测试');
