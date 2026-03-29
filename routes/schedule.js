const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// 获取定时发布的文章
router.get('/scheduled', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const articles = await Article.find({
      author: req.user._id,
      status: 'draft',
      publishedAt: { $exists: true, $gt: new Date() }
    })
      .sort({ publishedAt: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Article.countDocuments({
      author: req.user._id,
      status: 'draft',
      publishedAt: { $exists: true, $gt: new Date() }
    });
    
    res.json({
      data: articles,
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

// 设置定时发布
router.put('/:id/schedule', authMiddleware, async (req, res) => {
  try {
    const { publishedAt } = req.body;
    
    if (!publishedAt) {
      return res.status(400).json({ message: '请指定发布时间' });
    }
    
    const publishTime = new Date(publishedAt);
    if (publishTime <= new Date()) {
      return res.status(400).json({ message: '发布时间必须是将来的时间' });
    }
    
    const article = await Article.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      {
        status: 'draft',
        publishedAt: publishTime
      },
      { new: true }
    );
    
    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }
    
    res.json({
      message: '定时发布设置成功',
      data: article,
      scheduledTime: publishTime
    });
  } catch (error) {
    res.status(500).json({ message: '设置失败', error: error.message });
  }
});

// 取消定时发布
router.put('/:id/cancel-schedule', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      {
        $unset: { publishedAt: 1 }
      },
      { new: true }
    );
    
    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }
    
    res.json({
      message: '已取消定时发布',
      data: article
    });
  } catch (error) {
    res.status(500).json({ message: '取消失败', error: error.message });
  }
});

// 立即发布（跳过定时）
router.put('/:id/publish-now', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      {
        status: 'published',
        publishedAt: new Date()
      },
      { new: true }
    );
    
    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }
    
    res.json({
      message: '文章已发布',
      data: article
    });
  } catch (error) {
    res.status(500).json({ message: '发布失败', error: error.message });
  }
});

module.exports = router;
