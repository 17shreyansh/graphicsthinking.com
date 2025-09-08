const express = require('express')
const Portfolio = require('../models/Portfolio')
const { multiple } = require('../middleware/upload')
const router = express.Router()

// Get all portfolio items
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit = 20, page = 1, search } = req.query
    const query = {}
    
    if (category && category !== 'All') {
      query.category = category
    }
    
    if (featured === 'true') {
      query.featured = true
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }
    
    const skip = (page - 1) * limit
    const portfolioItems = await Portfolio.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
    
    const total = await Portfolio.countDocuments(query)
    
    res.json({
      items: portfolioItems,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + portfolioItems.length < total
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single portfolio item
router.get('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id)
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' })
    }
    
    // Increment views
    await Portfolio.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })
    
    // Get related items
    const related = await Portfolio.find({
      _id: { $ne: req.params.id },
      category: portfolio.category
    }).limit(3)
    
    res.json({ portfolio, related })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create portfolio item
router.post('/', multiple('images'), async (req, res) => {
  try {
    const portfolioData = { ...req.body }
    
    if (req.files && req.files.length > 0) {
      portfolioData.image = req.files[0].path
      portfolioData.images = req.files.map(file => file.path)
    }
    
    if (portfolioData.tags && typeof portfolioData.tags === 'string') {
      portfolioData.tags = portfolioData.tags.split(',')
    }
    
    const portfolio = new Portfolio(portfolioData)
    await portfolio.save()
    res.status(201).json(portfolio)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update portfolio item
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
    
    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' })
    }
    
    res.json(portfolio)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Like portfolio item
router.post('/:id/like', async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    )
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' })
    }
    
    res.json({ likes: portfolio.likes })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get portfolio categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Portfolio.distinct('category')
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete portfolio item
router.delete('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id)
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' })
    }
    res.json({ message: 'Portfolio item deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router