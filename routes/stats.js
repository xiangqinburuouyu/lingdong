const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const ViewStats = require('../models/ViewStats');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// 记录文章访问
router.post('/article/:articleId/view', async (req, res) => {
  try {
    const { articleId } = req.params;
    const { userId } = req.body; // 可选，如果用户登录
    
    const today = new Date().setHours(0, 0, 0, 0);
    
    // 更新文章浏览量
    await Article.findByIdAndUpdate(articleId, {
      $inc: { views: 1 }
    });
    
    // 更新统计数据
    await ViewStats.findOneAndUpdate(
      { article: articleId, date: today },
      {
        $inc: { 
          views: 1,
          uniqueVisitors: userId ? 0 : 1 // 简化处理
        }
      },
      { upsert: true }
    );
    
    res.json({ message: '记录成功' });
  } catch (error) {
    res.status(500).json({ message: '记录失败', error: error.message });
  }
});

// 获取文章统计数据
router.get('/article/:articleId', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const articleId = req.params.articleId;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const stats = await ViewStats.find({
      article: articleId,
      date: { $gte: startDate }
    }).sort({ date: 1 });
    
    const totalViews = stats.reduce((sum, s) => sum + s.views, 0);
    const totalVisitors = stats.reduce((sum, s) => sum + s.uniqueVisitors, 0);
    
    res.json({
      data: stats,
      summary: {
        totalViews,
        totalVisitors,
        days: parseInt(days),
        avgViewsPerDay: Math.round(totalViews / days)
      }
    });
  } catch (error) {
    res.status(500).json({ message: '获取失败', error: error.message });
  }
});

// 获取热门文章（需要登录）
router.get('/articles/hot', authMiddleware, async (req, res) => {
  try {
    const { limit = 10, days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    // 获取热门文章
    const articles = await Article.find({
      status: 'published',
      publishedAt: { $gte: startDate }
    })
      .sort({ views: -1 })
      .limit(parseInt(limit))
      .populate('author', 'username avatar')
      .populate('category', 'name slug');
    
    res.json({
      data: articles
    });
  } catch (error) {
    res.status(500).json({ message: '获取失败', error: error.message });
  }
});

// 获取网站总统计（管理员）
router.get('/overview', adminMiddleware, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    // 总文章数
    const totalArticles = await Article.countDocuments();
    
    // 总用户数
    const totalUsers = await User.countDocuments();
    
    // 总浏览量
    const viewStats = await ViewStats.aggregate([
      { $match: { date: { $gte: startDate } } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    
    const totalViews = viewStats.length > 0 ? viewStats[0].total : 0;
    
    res.json({
      data: {
        totalArticles,
        totalUsers,
        totalViews,
        days: parseInt(days)
      }
    });
  } catch (error) {
    res.status(500).json({ message: '获取失败', error: error.message });
  }
});

// 获取每日趋势（管理员）
router.get('/daily-trend', adminMiddleware, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const trend = await ViewStats.aggregate([
      { $match: { date: { $gte: startDate } } },
      { $group: { 
          _id: '$date', 
          views: { $sum: '$views' },
          visitors: { $sum: '$uniqueVisitors' }
        } 
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      data: trend
    });
  } catch (error) {
    res.status(500).json({ message: '获取失败', error: error.message });
  }
});

module.exports = router;
