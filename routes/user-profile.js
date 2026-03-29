const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Follow = require('../models/Follow');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// 获取用户画像数据（需要登录）
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // 获取用户基本信息
    const user = {
      id: userId,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt
    };

    // 统计文章数
    const articleCount = await Article.countDocuments({ author: userId });

    // 统计评论数
    const commentCount = await Comment.countDocuments({ user: userId });

    // 统计关注数
    const followingCount = await Follow.countDocuments({ follower: userId });

    // 统计粉丝数
    const followerCount = await Follow.countDocuments({ following: userId });

    // 获取阅读偏好（最近阅读的文章分类）
    const recentArticles = await Article.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('category', 'name');
    
    const categoryMap = {};
    recentArticles.forEach(article => {
      const categoryName = article.category?.name || '未分类';
      categoryMap[categoryName] = (categoryMap[categoryName] || 0) + 1;
    });

    const readingPreference = Object.entries(categoryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 获取活动统计
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentArticlesCount = await Article.countDocuments({
      author: userId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    const recentCommentsCount = await Comment.countDocuments({
      user: userId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      data: {
        user,
        stats: {
          articleCount,
          commentCount,
          followingCount,
          followerCount,
          recentArticlesCount,
          recentCommentsCount
        },
        readingPreference,
        activityLevel: getActivityLevel(recentArticlesCount + recentCommentsCount)
      }
    });
  } catch (error) {
    res.status(500).json({ message: '获取失败', error: error.message });
  }
});

// 获取用户活跃度等级
function getActivityLevel(activityCount) {
  if (activityCount >= 50) return '非常活跃';
  if (activityCount >= 20) return '活跃';
  if (activityCount >= 5) return '一般';
  return '潜水';
}

// 获取其他用户画像（公开信息）
router.get('/user/:userId', async (req, res) => {
  try {
    // TODO: 需要 User 模型支持
    res.json({
      data: {
        message: '需要 User 模型支持'
      }
    });
  } catch (error) {
    res.status(500).json({ message: '获取失败', error: error.message });
  }
});

module.exports = router;
