/**
 * 认证路由 - 注册、登录、登出
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 生成 JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// 注册验证 schema
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).optional(),
  password: Joi.string().min(6).required(),
  nickname: Joi.string().max(30).optional()
});

// 登录验证 schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

/**
 * POST /api/auth/register
 * 用户注册
 */
router.post('/register', async (req, res) => {
  try {
    // 验证输入
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        message: '输入验证失败',
        errors: error.details.map(d => d.message)
      });
    }

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ 
      $or: [{ username: value.username }, { email: value.email }] 
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        message: '用户名或邮箱已被注册',
        code: 'USER_EXISTS'
      });
    }

    // 创建用户
    const user = new User({
      username: value.username,
      email: value.email,
      phone: value.phone,
      password: value.password,
      nickname: value.nickname || value.username
    });

    await user.save();

    // 生成 token
    const token = generateToken(user._id);

    res.status(201).json({
      message: '注册成功',
      data: {
        user: user.toPublicJSON(),
        token
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * POST /api/auth/login
 * 用户登录
 */
router.post('/login', async (req, res) => {
  try {
    // 验证输入
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        message: '输入验证失败',
        errors: error.details.map(d => d.message)
      });
    }

    // 查找用户（包含密码字段）
    const user = await User.findOne({ email: value.email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        message: '邮箱或密码错误',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // 检查账号状态
    if (user.status !== 'active') {
      return res.status(403).json({ 
        message: '账号已被禁用',
        code: 'ACCOUNT_DISABLED'
      });
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(value.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: '邮箱或密码错误',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date();
    await user.save();

    // 生成 token
    const token = generateToken(user._id);

    res.json({
      message: '登录成功',
      data: {
        user: user.toPublicJSON(),
        token
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * POST /api/auth/logout
 * 用户登出
 */
router.post('/logout', authMiddleware, async (req, res) => {
  // JWT 是无状态的，登出主要是客户端删除 token
  // 如果需要实现 token 黑名单，可以在此处添加逻辑
  res.json({
    message: '登出成功'
  });
});

/**
 * GET /api/auth/me
 * 获取当前用户信息
 */
router.get('/me', authMiddleware, async (req, res) => {
  res.json({
    data: {
      user: req.user.toPublicJSON()
    }
  });
});

module.exports = router;
