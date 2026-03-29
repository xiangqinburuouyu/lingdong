const express = require('express');
const router = express.Router();
const Follow = require('../models/Follow');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// 关注用户（需要登录）
router.post('/:followingId', authMiddleware, async (req, res) => {
  try {
    if (req.params.followingId === req.user._id.toString()) {
      return res.status(400).json({ message: '不能关注自己' });
    }

    const user = await User.findById(req.params.followingId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    const follow = await Follow.findOneAndUpdate(
      { 
        follower: req.user._id, 
        following: req.params.followingId 
      },
      { 
        follower: req.user._id, 
        following: req.params.followingId 
      },
      { upsert: true, new: true }
    );

    res.json({ 
      message: '关注成功',
      data: follow
    });
  } catch (error) {
    res.status(500).json({ message: '关注失败', error: error.message });
  }
});

// 取消关注（需要登录）
router.delete('/:followingId', authMiddleware, async (req, res) => {
  try {
    await Follow.findOneAndDelete({
      follower: req.user._id,
      following: req.params.followingId
    });

    res.json({ message: '取消关注成功' });
  } catch (error) {
    res.status(500).json({ message: '操作失败', error: error.message });
  }
});

// 获取关注列表（需要登录）
router.get('/following', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const follows = await Follow.find({ follower: req.user._id })
      .populate('following', 'username avatar bio')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Follow.countDocuments({ follower: req.user._id });
    
    res.json({
      data: follows.map(f => f.following),
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 获取粉丝列表
router.get('/followers/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const follows = await Follow.find({ following: req.params.userId })
      .populate('follower', 'username avatar bio')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Follow.countDocuments({ following: req.params.userId });
    
    res.json({
      data: follows.map(f => f.follower),
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 检查是否关注
router.get('/check/:followingId', authMiddleware, async (req, res) => {
  try {
    const follow = await Follow.findOne({
      follower: req.user._id,
      following: req.params.followingId
    });

    res.json({
      following: !!follow
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

module.exports = router;
