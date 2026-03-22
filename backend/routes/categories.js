/**
 * 分类路由
 */

const express = require('express');
const Category = require('../models/Category');

const router = express.Router();

/**
 * GET /api/categories
 * 获取全部分类
 */
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });

    res.json({
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('获取分类列表错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * GET /api/categories/:id
 * 获取分类详情
 */
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ 
        message: '分类不存在',
        code: 'CATEGORY_NOT_FOUND'
      });
    }

    res.json({
      data: {
        category
      }
    });
  } catch (error) {
    console.error('获取分类详情错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * GET /api/categories/:id/articles
 * 获取分类下的文章列表
 */
router.get('/:id/articles', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const Article = require('../models/Article');

    const articles = await Article.find({ 
      category: req.params.id,
      status: 'published'
    })
      .populate('author', 'username nickname avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Article.countDocuments({ 
      category: req.params.id,
      status: 'published'
    });

    res.json({
      data: {
        articles,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取分类文章列表错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误',
      code: 'SERVER_ERROR'
    });
  }
});

module.exports = router;
