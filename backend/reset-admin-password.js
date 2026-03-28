const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/selfmedia';

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const User = mongoose.model('User', UserSchema);

mongoose.connect(MONGODB_URI).then(async () => {
  console.log('✅ MongoDB 连接成功');
  
  // 查找 admin 用户
  const admin = await User.findOne({ username: 'admin' });
  if (!admin) {
    console.log('❌ 未找到 admin 用户');
    process.exit(1);
  }
  
  console.log('找到用户:', admin.username);
  console.log('邮箱:', admin.email);
  
  // 重置密码为 123456
  const hashedPassword = await bcrypt.hash('123456', 10);
  admin.password = hashedPassword;
  await admin.save();
  
  console.log('✅ 密码重置成功');
  console.log('登录邮箱:', admin.email);
  console.log('登录密码: 123456');
  
  process.exit(0);
}).catch(err => {
  console.error('❌ 错误:', err);
  process.exit(1);
});
