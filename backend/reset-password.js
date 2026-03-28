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
  
  // 查找或创建 admin 用户
  let admin = await User.findOne({ username: 'admin' });
  
  if (!admin) {
    console.log('创建 admin 用户...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    admin = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });
    await admin.save();
    console.log('✅ admin 用户创建成功');
  } else {
    console.log('找到 admin 用户，重置密码...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    admin.password = hashedPassword;
    admin.role = 'admin';
    admin.status = 'active';
    await admin.save();
    console.log('✅ 密码重置成功');
  }
  
  console.log('\n登录信息:');
  console.log('  用户名：admin');
  console.log('  密码：123456');
  console.log('  邮箱：', admin.email);
  
  process.exit(0);
}).catch(err => {
  console.error('❌ 错误:', err);
  process.exit(1);
});
