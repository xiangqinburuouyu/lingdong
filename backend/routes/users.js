/**
 * 用户路由
 */

const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// 更新用户信息验证 schema
const updateProfileSchema = Joi.object({
  nickname: Joi.string().max(30).optional(),
  avatar: Joi.string().uri().optional(),
  bio: Joi.string().max(200).optional(),
  wechat: Joi.string().optional(),
  weibo: Joi.string().optional()
});

/**
 * GET /api/users/:id
 * 获取用户信息
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        message: '用户不存在',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      data: {
        user: user.toPublicJSON()
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * PUT /api/users/:id
 * 更新用户信息
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // 检查权限：只能更新自己的信息
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ 
        message: '无权修改他人信息',
        code: 'FORBIDDEN'
      });
    }

    // 验证输入
    const { error, value } = updateProfileSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        message: '输入验证失败',
        errors: error.details.map(d => d.message)
      });
    }

    // 更新用户信息
    const user = await User.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    );

    res.json({
      message: '更新成功',
      data: {
        user: user.toPublicJSON()
      }
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * GET /api/users/:id/articles
 * 获取用户的文章列表
 */
router.get('/:id/articles', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        message: '用户不存在',
        code: 'USER_NOT_FOUND'
      });
    }

    const articles = await Article.find({ 
      author: req.params.id,
      status: 'published'
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Article.countDocuments({ 
      author: req.params.id,
      status: 'published'
    });

    res.json({
      data: {
        articles,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取用户文章列表错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

module.exports = router;
