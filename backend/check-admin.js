const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/selfmedia';

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  status: String
});

const User = mongoose.model('User', UserSchema);

mongoose.connect(MONGODB_URI).then(async () => {
  console.log('✅ MongoDB 连接成功');
  
  // 查找所有用户
  const users = await User.find({});
  console.log('数据库中的用户:');
  users.forEach(u => {
    console.log('  - username:', u.username, '| email:', u.email, '| role:', u.role, '| status:', u.status);
  });
  
  // 查找 admin 用户
  const admin = await User.findOne({ username: 'admin' });
  if (admin) {
    console.log('\n✅ 找到 admin 用户:');
    console.log('  username:', admin.username);
    console.log('  email:', admin.email);
    console.log('  role:', admin.role);
    console.log('  status:', admin.status);
    
    // 测试密码
    const testPassword = await bcrypt.compare('123456', admin.password);
    console.log('  密码 123456 是否正确:', testPassword);
  } else {
    console.log('\n❌ 未找到 admin 用户');
  }
  
  process.exit(0);
}).catch(err => {
  console.error('❌ 错误:', err);
  process.exit(1);
});
