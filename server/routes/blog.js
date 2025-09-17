const express = require('express')
const Blog = require('../models/Blog')
const { multiple } = require('../middleware/upload')
const router = express.Router()

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit = 10, page = 1, search, admin } = req.query
    const query = admin === 'true' ? {} : { published: true }
    
    if (category) {
      query.category = category
    }
    
    if (featured === 'true') {
      query.featured = true
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }
    
    const skip = (page - 1) * limit
    const posts = await Blog.find(query)
      .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select(admin === 'true' ? '' : '-content')
    
    const total = await Blog.countDocuments(query)
    
    res.json({
      posts,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + posts.length < total
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single blog post
router.get('/:slug', async (req, res) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug, published: true })
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' })
    }
    
    // Increment views
    await Blog.findByIdAndUpdate(post._id, { $inc: { views: 1 } })
    
    // Get related posts
    const related = await Blog.find({
      _id: { $ne: post._id },
      category: post.category,
      published: true
    }).limit(3).select('-content')
    
    res.json({ post, related })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create blog post
router.post('/', multiple('images'), async (req, res) => {
  try {
    const postData = { ...req.body }
    
    if (req.files && req.files.length > 0) {
      postData.image = req.files[0].path
      postData.images = req.files.map(file => file.path)
    }
    
    if (postData.tags && typeof postData.tags === 'string') {
      postData.tags = postData.tags.split(',')
    }
    
    // Generate slug from title
    if (!postData.slug) {
      postData.slug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }
    
    // Set published date if publishing
    if (postData.published && !postData.publishedAt) {
      postData.publishedAt = new Date()
    }
    
    const post = new Blog(postData)
    await post.save()
    res.status(201).json(post)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update blog post
router.put('/:id', multiple('images'), async (req, res) => {
  try {
    const updateData = { ...req.body }
    
    if (req.files && req.files.length > 0) {
      updateData.image = req.files[0].path
      updateData.images = req.files.map(file => file.path)
    }
    
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',')
    }
    
    // Set published date if publishing for first time
    if (updateData.published && !updateData.publishedAt) {
      const existingPost = await Blog.findById(req.params.id)
      if (!existingPost.published) {
        updateData.publishedAt = new Date()
      }
    }
    
    const post = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' })
    }
    
    res.json(post)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Like blog post
router.post('/:id/like', async (req, res) => {
  try {
    const post = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    )
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' })
    }
    
    res.json({ likes: post.likes })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get blog categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Blog.distinct('category')
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete blog post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Blog.findByIdAndDelete(req.params.id)
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' })
    }
    res.json({ message: 'Blog post deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router