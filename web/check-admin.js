const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://127.0.0.1:27017/selfmedia';

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const User = mongoose.model('User', UserSchema);

mongoose.connect(MONGODB_URI).then(async () => {
  const admin = await User.findOne({ username: 'admin' });
  console.log('username:', admin.username);
  console.log('email:', admin.email);
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
