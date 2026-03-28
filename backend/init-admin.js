const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/selfmedia';

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

mongoose.connect(MONGODB_URI).then(async () => {
  console.log('✅ MongoDB 连接成功');
  
  // 检查是否已有 admin 用户
  const existing = await User.findOne({ email: 'admin@example.com' });
  if (existing) {
    console.log('⚠️  admin 用户已存在');
    process.exit(0);
  }
  
  // 创建 admin 用户
  const hashedPassword = await bcrypt.hash('123456', 10);
  const admin = new User({
    email: 'admin@example.com',
    username: 'admin',
    password: hashedPassword,
    role: 'admin'
  });
  
  await admin.save();
  console.log('✅ admin 用户创建成功');
  console.log('登录邮箱：admin@example.com');
  console.log('登录密码：123456');
  
  process.exit(0);
}).catch(err => {
  console.error('❌ 错误:', err);
  process.exit(1);
});
