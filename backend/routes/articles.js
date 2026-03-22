/**
 * 文章路由
 */

const express = require('express');
const Joi = require('joi');
const Article = require('../models/Article');
const User = require('../models/User');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// 创建/更新文章验证 schema
const articleSchema = Joi.object({
  title: Joi.string().max(200).required(),
  summary: Joi.string().max(500).optional(),
  content: Joi.string().required(),
  coverImage: Joi.string().uri().optional(),
  categoryId: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  isFeatured: Joi.boolean().optional(),
  isPaid: Joi.boolean().optional(),
  price: Joi.number().min(0).optional()
});

/**
 * GET /api/articles
 * 获取文章列表（支持分页、分类筛选、搜索）
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      tag, 
      search,
      sort = '-createdAt'
    } = req.query;

    // 构建查询条件
    const query = { status: 'published' };
    
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    if (search) {
      // 文本搜索
      query.$text = { $search: search };
    }

    // 查询文章
    const articles = await Article.find(query)
      .populate('author', 'username nickname avatar')
      .populate('category', 'name slug icon')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    // 获取总数
    const count = await Article.countDocuments(query);

    res.json({
      data: {
        articles: articles.map(article => article.toPublicJSON()),
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取文章列表错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * GET /api/articles/:id
 * 获取文章详情
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'username nickname avatar bio articleCount followerCount')
      .populate('category', 'name slug icon');

    if (!article) {
      return res.status(404).json({ 
        message: '文章不存在',
        code: 'ARTICLE_NOT_FOUND'
      });
    }

    if (article.status !== 'published') {
      return res.status(403).json({ 
        message: '文章未发布或已归档',
        code: 'ARTICLE_NOT_AVAILABLE'
      });
    }

    // 增加阅读量
    article.viewCount += 1;
    await article.save();

    res.json({
      data: {
        article: article.toPublicJSON()
      }
    });
  } catch (error) {
    console.error('获取文章详情错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * POST /api/articles
 * 创建文章（需要认证）
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    // 验证输入
    const { error, value } = articleSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        message: '输入验证失败',
        errors: error.details.map(d => d.message)
      });
    }

    // 创建文章
    const article = new Article({
      ...value,
      category: value.categoryId,
      author: req.user._id
    });

    await article.save();

    // 更新作者文章数量
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { articleCount: 1 }
    });

    res.status(201).json({
      message: '文章创建成功',
      data: {
        article: article.toPublicJSON()
      }
    });
  } catch (error) {
    console.error('创建文章错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * PUT /api/articles/:id
 * 更新文章（需要认证，仅限作者）
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ 
        message: '文章不存在',
        code: 'ARTICLE_NOT_FOUND'
      });
    }

    // 检查权限：只有作者可以修改
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: '无权修改他人文章',
        code: 'FORBIDDEN'
      });
    }

    // 验证输入
    const { error, value } = articleSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        message: '输入验证失败',
        errors: error.details.map(d => d.message)
      });
    }

    // 更新文章
    Object.assign(article, {
      ...value,
      category: value.categoryId
    });

    await article.save();

    res.json({
      message: '文章更新成功',
      data: {
        article: article.toPublicJSON()
      }
    });
  } catch (error) {
    console.error('更新文章错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * DELETE /api/articles/:id
 * 删除文章（需要认证，仅限作者或管理员）
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ 
        message: '文章不存在',
        code: 'ARTICLE_NOT_FOUND'
      });
    }

    // 检查权限
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: '无权删除他人文章',
        code: 'FORBIDDEN'
      });
    }

    // 软删除：改为归档状态
    article.status = 'archived';
    await article.save();

    res.json({
      message: '文章已删除'
    });
  } catch (error) {
    console.error('删除文章错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * POST /api/articles/:id/like
 * 点赞文章
 */
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ 
        message: '文章不存在',
        code: 'ARTICLE_NOT_FOUND'
      });
    }

    article.likeCount += 1;
    await article.save();

    res.json({
      message: '点赞成功',
      data: {
        likeCount: article.likeCount
      }
    });
  } catch (error) {
    console.error('点赞错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * POST /api/articles/:id/bookmark
 * 收藏文章
 */
router.post('/:id/bookmark', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ 
        message: '文章不存在',
        code: 'ARTICLE_NOT_FOUND'
      });
    }

    article.bookmarkCount += 1;
    await article.save();

    res.json({
      message: '收藏成功',
      data: {
        bookmarkCount: article.bookmarkCount
      }
    });
  } catch (error) {
    console.error('收藏错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

module.exports = router;
