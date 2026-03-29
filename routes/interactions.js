const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { authMiddleware } = require('../middleware/auth');

// 点赞文章（需要登录）
router.post('/articles/:id/like', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }
    
    // 检查是否已点赞（简化版，实际应该用单独的 Like 模型）
    if (!article.likes) article.likes = 0;
    article.likes += 1;
    await article.save();
    
    res.json({
      message: '点赞成功',
      likes: article.likes
    });
  } catch (error) {
    res.status(500).json({ message: '点赞失败', error: error.message });
  }
});

// 收藏文章（需要登录）
router.post('/articles/:id/favorite', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }
    
    // TODO: 实现收藏功能（需要 User 模型支持）
    res.json({
      message: '收藏成功'
    });
  } catch (error) {
    res.status(500).json({ message: '收藏失败', error: error.message });
  }
});

// 取消收藏（需要登录）
router.delete('/articles/:id/favorite', authMiddleware, async (req, res) => {
  try {
    // TODO: 实现取消收藏功能
    res.json({
      message: '取消收藏成功'
    });
  } catch (error) {
    res.status(500).json({ message: '操作失败', error: error.message });
  }
});

// 获取用户的收藏列表（需要登录）
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    // TODO: 实现获取收藏列表功能
    res.json({
      data: [],
      pagination: {
        total: 0,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 分享文章（不需要登录）
router.post('/articles/:id/share', async (req, res) => {
  try {
    const { platform } = req.body; // wechat, weibo, qq, etc.
    
    // TODO: 实现分享统计功能
    res.json({
      message: '分享成功',
      platform
    });
  } catch (error) {
    res.status(500).json({ message: '分享失败', error: error.message });
  }
});

module.exports = router;
