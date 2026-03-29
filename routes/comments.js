const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Article = require('../models/Article');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// 获取文章评论列表
router.get('/article/:articleId', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const comments = await Comment.find({
      article: req.params.articleId,
      status: 'approved',
      parent: null
    })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Comment.countDocuments({
      article: req.params.articleId,
      status: 'approved',
      parent: null
    });
    
    res.json({
      data: comments,
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

// 创建评论（需要登录）
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { articleId, content, parentId } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ message: '评论内容不能为空' });
    }
    
    // 检查文章是否存在
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }
    
    const comment = new Comment({
      article: articleId,
      user: req.user._id,
      content,
      parent: parentId || null,
      status: article.commentAudit ? 'pending' : 'approved'
    });
    
    await comment.save();
    await comment.populate('user', 'username avatar');
    
    // 如果是回复，增加父评论的回复数
    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, {
        $inc: { replies: 1 }
      });
    }
    
    // 增加文章评论数
    await Article.findByIdAndUpdate(articleId, {
      $inc: { comments: 1 }
    });
    
    res.status(201).json({
      message: '评论成功',
      data: comment
    });
  } catch (error) {
    res.status(500).json({ message: '评论失败', error: error.message });
  }
});

// 点赞评论（需要登录）
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }
    
    comment.likes += 1;
    await comment.save();
    
    res.json({
      message: '点赞成功',
      likes: comment.likes
    });
  } catch (error) {
    res.status(500).json({ message: '点赞失败', error: error.message });
  }
});

// 删除评论（需要登录或管理员）
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }
    
    // 检查权限
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权限删除' });
    }
    
    await Comment.findByIdAndDelete(req.params.id);
    
    // 减少文章评论数
    await Article.findByIdAndUpdate(comment.article, {
      $inc: { comments: -1 }
    });
    
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '删除失败', error: error.message });
  }
});

// 审核评论（管理员）
router.put('/:id/audit', adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: '无效的状态' });
    }
    
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'username avatar');
    
    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }
    
    res.json({
      message: '审核成功',
      data: comment
    });
  } catch (error) {
    res.status(500).json({ message: '审核失败', error: error.message });
  }
});

// 获取待审核评论（管理员）
router.get('/audit/pending', adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const comments = await Comment.find({ status: 'pending' })
      .populate('user', 'username avatar')
      .populate('article', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Comment.countDocuments({ status: 'pending' });
    
    res.json({
      data: comments,
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

module.exports = router;
