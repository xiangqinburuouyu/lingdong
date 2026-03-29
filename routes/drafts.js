const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { authMiddleware } = require('../middleware/auth');

// 获取我的草稿
router.get('/my-drafts', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const articles = await Article.find({
      author: req.user._id,
      status: 'draft'
    })
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Article.countDocuments({
      author: req.user._id,
      status: 'draft'
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

// 自动保存草稿
router.post('/auto-save', authMiddleware, async (req, res) => {
  try {
    const { id, title, summary, content, cover } = req.body;
    
    if (id) {
      // 更新现有草稿
      const article = await Article.findOneAndUpdate(
        { _id: id, author: req.user._id },
        {
          title,
          summary,
          content,
          cover,
          status: 'draft'
        },
        { new: true }
      );
      
      if (!article) {
        return res.status(404).json({ message: '草稿不存在' });
      }
      
      res.json({ 
        message: '草稿已保存', 
        data: article,
        autoSaved: true
      });
    } else {
      // 创建新草稿
      const article = new Article({
        title: title || '无标题草稿',
        summary,
        content,
        cover,
        author: req.user._id,
        status: 'draft'
      });
      
      await article.save();
      await article.populate('author', 'username avatar');
      
      res.status(201).json({ 
        message: '草稿已创建', 
        data: article,
        autoSaved: false
      });
    }
  } catch (error) {
    res.status(500).json({ message: '保存失败', error: error.message });
  }
});

// 发布草稿
router.put('/:id/publish', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findOne({
      _id: req.params.id,
      author: req.user._id
    });
    
    if (!article) {
      return res.status(404).json({ message: '草稿不存在' });
    }
    
    if (!article.title || !article.content) {
      return res.status(400).json({ message: '标题和内容不能为空' });
    }
    
    article.status = 'published';
    article.publishedAt = new Date();
    await article.save();
    
    res.json({ 
      message: '发布成功', 
      data: article 
    });
  } catch (error) {
    res.status(500).json({ message: '发布失败', error: error.message });
  }
});

module.exports = router;
