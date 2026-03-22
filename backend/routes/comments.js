/**
 * 评论路由
 */

const express = require('express');
const Joi = require('joi');
const Comment = require('../models/Comment');
const Article = require('../models/Article');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 评论验证 schema
const commentSchema = Joi.object({
  content: Joi.string().required().max(1000),
  articleId: Joi.string().required(),
  parentId: Joi.string().optional()
});

/**
 * GET /api/comments
 * 获取评论列表（按文章筛选）
 */
router.get('/', async (req, res) => {
  try {
    const { article, page = 1, limit = 20 } = req.query;

    if (!article) {
      return res.status(400).json({ 
        message: '请提供文章 ID',
        code: 'MISSING_ARTICLE_ID'
      });
    }

    const comments = await Comment.find({ 
      article,
      status: 'approved',
      parent: null // 只获取一级评论
    })
      .populate('user', 'username nickname avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Comment.countDocuments({ 
      article,
      status: 'approved',
      parent: null
    });

    res.json({
      data: {
        comments,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取评论列表错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * GET /api/comments/:id/replies
 * 获取评论的回复列表
 */
router.get('/:id/replies', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const replies = await Comment.find({ 
      parent: req.params.id,
      status: 'approved'
    })
      .populate('user', 'username nickname avatar')
      .sort({ createdAt: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      data: {
        replies
      }
    });
  } catch (error) {
    console.error('获取回复列表错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * POST /api/comments
 * 发表评论（需要认证）
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    // 验证输入
    const { error, value } = commentSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        message: '输入验证失败',
        errors: error.details.map(d => d.message)
      });
    }

    // 检查文章是否存在
    const article = await Article.findById(value.articleId);
    if (!article) {
      return res.status(404).json({ 
        message: '文章不存在',
        code: 'ARTICLE_NOT_FOUND'
      });
    }

    // 如果是回复评论，检查父评论是否存在
    if (value.parentId) {
      const parentComment = await Comment.findById(value.parentId);
      if (!parentComment) {
        return res.status(404).json({ 
          message: '父评论不存在',
          code: 'PARENT_COMMENT_NOT_FOUND'
        });
      }
    }

    // 创建评论
    const comment = new Comment({
      content: value.content,
      article: value.articleId,
      user: req.user._id,
      parent: value.parentId || null
    });

    await comment.save();

    // 更新文章评论数
    article.commentCount += 1;
    await article.save();

    // 填充用户信息后返回
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username nickname avatar');

    res.status(201).json({
      message: '评论成功',
      data: {
        comment: populatedComment
      }
    });
  } catch (error) {
    console.error('发表评论错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * DELETE /api/comments/:id
 * 删除评论（需要认证）
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ 
        message: '评论不存在',
        code: 'COMMENT_NOT_FOUND'
      });
    }

    // 检查权限：只有评论作者或管理员可以删除
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: '无权删除他人评论',
        code: 'FORBIDDEN'
      });
    }

    // 软删除
    comment.status = 'deleted';
    await comment.save();

    // 更新文章评论数
    const article = await Article.findById(comment.article);
    if (article) {
      article.commentCount = Math.max(0, article.commentCount - 1);
      await article.save();
    }

    res.json({
      message: '评论已删除'
    });
  } catch (error) {
    console.error('删除评论错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * POST /api/comments/:id/like
 * 点赞评论
 */
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ 
        message: '评论不存在',
        code: 'COMMENT_NOT_FOUND'
      });
    }

    comment.likeCount += 1;
    await comment.save();

    res.json({
      message: '点赞成功',
      data: {
        likeCount: comment.likeCount
      }
    });
  } catch (error) {
    console.error('点赞评论错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

module.exports = router;
