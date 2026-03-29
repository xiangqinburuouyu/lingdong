const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// 获取文章列表
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, status = 'published' } = req.query;
    
    const query = { status };
    if (category) query.category = category;
    
    const articles = await Article.find(query)
      .populate('author', 'username avatar')
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Article.countDocuments(query);
    
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

// 获取文章详情
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'username avatar email')
      .populate('category', 'name slug');
    
    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }
    
    // 增加阅读量
    article.views += 1;
    await article.save();
    
    res.json({ data: article });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 创建文章（需要登录）
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, summary, content, cover, category, tags, status } = req.body;
    
    const article = new Article({
      title,
      summary,
      content,
      cover,
      category,
      tags,
      status: status || 'draft',
      author: req.user._id,
      publishedAt: status === 'published' ? new Date() : null
    });
    
    await article.save();
    await article.populate('author', 'username avatar');
    await article.populate('category', 'name slug');
    
    res.status(201).json({ 
      message: '文章创建成功', 
      data: article 
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 更新文章（需要登录）
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }
    
    // 检查权限
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权限修改' });
    }
    
    const { title, summary, content, cover, category, tags, status } = req.body;
    
    article.title = title || article.title;
    article.summary = summary || article.summary;
    article.content = content || article.content;
    article.cover = cover || article.cover;
    article.category = category || article.category;
    article.tags = tags || article.tags;
    article.status = status || article.status;
    
    if (status === 'published' && !article.publishedAt) {
      article.publishedAt = new Date();
    }
    
    await article.save();
    await article.populate('author', 'username avatar');
    await article.populate('category', 'name slug');
    
    res.json({ 
      message: '文章更新成功', 
      data: article 
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 删除文章（需要登录）
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }
    
    // 检查权限
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权限删除' });
    }
    
    await Article.findByIdAndDelete(req.params.id);
    
    res.json({ message: '文章删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

module.exports = router;
