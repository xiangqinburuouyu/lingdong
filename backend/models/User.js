/**
 * 用户模型
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // 基本信息
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    unique: true,
    trim: true,
    minlength: [3, '用户名至少 3 个字符'],
    maxlength: [30, '用户名不能超过 30 个字符']
  },
  email: {
    type: String,
    required: [true, '邮箱不能为空'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请输入有效的邮箱地址']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^1[3-9]\d{9}$/, '请输入有效的手机号']
  },
  password: {
    type: String,
    required: [true, '密码不能为空'],
    minlength: [6, '密码至少 6 个字符'],
    select: false // 默认不返回密码字段
  },
  
  // 个人信息
  avatar: {
    type: String,
    default: ''
  },
  nickname: {
    type: String,
    trim: true,
    maxlength: [30, '昵称不能超过 30 个字符']
  },
  bio: {
    type: String,
    maxlength: [200, '简介不能超过 200 个字符']
  },
  
  // 社交账号（可选）
  wechat: { type: String, trim: true },
  weibo: { type: String, trim: true },
  
  // 统计信息
  articleCount: {
    type: Number,
    default: 0
  },
  followerCount: {
    type: Number,
    default: 0
  },
  followingCount: {
    type: Number,
    default: 0
  },
  
  // 账号状态
  role: {
    type: String,
    enum: ['user', 'author', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'banned', 'deleted'],
    default: 'active'
  },
  
  // 时间戳
  lastLoginAt: {
    type: Date
  }
}, {
  timestamps: true // 自动添加 createdAt 和 updatedAt
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 实例方法：比较密码
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 实例方法：生成公开用户信息（不包含敏感数据）
userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    phone: this.phone,
    avatar: this.avatar,
    nickname: this.nickname,
    bio: this.bio,
    wechat: this.wechat,
    weibo: this.weibo,
    articleCount: this.articleCount,
    followerCount: this.followerCount,
    followingCount: this.followingCount,
    role: this.role,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt
  };
};

module.exports = mongoose.model('User', userSchema);
