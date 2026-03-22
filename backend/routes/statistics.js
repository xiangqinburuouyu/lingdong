/**
 * 数据统计路由
 */

const express = require('express');
const Article = require('../models/Article');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/statistics/overview
 * 获取平台概览数据
 */
router.get('/overview', async (req, res) => {
  try {
    // 总文章数
    const totalArticles = await Article.countDocuments({ status: 'published' });
    
    // 总用户数
    const totalUsers = await User.countDocuments({ status: 'active' });
    
    // 总评论数
    const totalComments = await Comment.countDocuments({ status: 'approved' });
    
    // 今日新增文章
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayArticles = await Article.countDocuments({
      status: 'published',
      createdAt: { $gte: today },
    });

    res.json({
      data: {
        overview: {
          totalArticles,
          totalUsers,
          totalComments,
          todayArticles,
        },
      },
    });
  } catch (error) {
    console.error('获取概览数据失败:', error);
    res.status(500).json({
      message: '服务器内部错误',
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * GET /api/statistics/articles/hot
 * 获取热门文章（按阅读量）
 */
router.get('/articles/hot', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const articles = await Article.find({ status: 'published' })
      .populate('author', 'username nickname avatar')
      .sort({ viewCount: -1 })
      .limit(parseInt(limit))
      .select('title coverImage viewCount likeCount commentCount createdAt');

    res.json({
      data: {
        articles,
      },
    });
  } catch (error) {
    console.error('获取热门文章失败:', error);
    res.status(500).json({
      message: '服务器内部错误',
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * GET /api/statistics/articles/trending
 * 获取 trending 文章（按近期增长率）
 */
router.get('/articles/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // 获取最近 7 天的文章
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const articles = await Article.find({
      status: 'published',
      createdAt: { $gte: sevenDaysAgo },
    })
      .populate('author', 'username nickname avatar')
      .sort({ viewCount: -1, likeCount: -1 })
      .limit(parseInt(limit))
      .select('title coverImage viewCount likeCount commentCount createdAt');

    res.json({
      data: {
        articles,
      },
    });
  } catch (error) {
    console.error('获取趋势文章失败:', error);
    res.status(500).json({
      message: '服务器内部错误',
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * GET /api/statistics/users/top
 * 获取热门作者（按粉丝数或文章数）
 */
router.get('/users/top', async (req, res) => {
  try {
    const { limit = 10, sortBy = 'followerCount' } = req.query;
    
    const users = await User.find({ 
      status: 'active',
      role: { $in: ['author', 'user'] }
    })
      .sort({ [sortBy]: -1 })
      .limit(parseInt(limit))
      .select('username nickname avatar articleCount followerCount bio');

    res.json({
      data: {
        users,
      },
    });
  } catch (error) {
    console.error('获取热门作者失败:', error);
    res.status(500).json({
      message: '服务器内部错误',
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * GET /api/statistics/user/:id
 * 获取用户个人统计
 */
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        message: '用户不存在',
        code: 'USER_NOT_FOUND',
      });
    }

    // 文章统计
    const articleCount = await Article.countDocuments({ 
      author: req.params.id,
      status: 'published' 
    });
    
    // 总阅读量
    const articles = await Article.find({ 
      author: req.params.id,
      status: 'published' 
    }).select('viewCount likeCount commentCount');
    
    const totalViews = articles.reduce((sum, a) => sum + a.viewCount, 0);
    const totalLikes = articles.reduce((sum, a) => sum + a.likeCount, 0);
    const totalComments = articles.reduce((sum, a) => sum + a.commentCount, 0);

    res.json({
      data: {
        user: {
          id: user._id,
          nickname: user.nickname,
          avatar: user.avatar,
        },
        stats: {
          articleCount,
          totalViews,
          totalLikes,
          totalComments,
          followerCount: user.followerCount,
          followingCount: user.followingCount,
        },
      },
    });
  } catch (error) {
    console.error('获取用户统计失败:', error);
    res.status(500).json({
      message: '服务器内部错误',
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * GET /api/statistics/article/:id
 * 获取文章详细统计
 */
router.get('/article/:id', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        message: '文章不存在',
        code: 'ARTICLE_NOT_FOUND',
      });
    }

    // 检查权限
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: '无权查看',
        code: 'FORBIDDEN',
      });
    }

    res.json({
      data: {
        article: {
          id: article._id,
          title: article.title,
        },
        stats: {
          viewCount: article.viewCount,
          likeCount: article.likeCount,
          commentCount: article.commentCount,
          bookmarkCount: article.bookmarkCount,
        },
      },
    });
  } catch (error) {
    console.error('获取文章统计失败:', error);
    res.status(500).json({
      message: '服务器内部错误',
      code: 'SERVER_ERROR',
    });
  }
});

module.exports = router;
