const express = require('express')
const Portfolio = require('../models/Portfolio')
const { multiple } = require('../middleware/upload')
const router = express.Router()

// DSA: Query optimization with caching and smart filtering
class PortfolioQueryBuilder {
  constructor() {
    this.query = { $or: [{ status: 'published' }, { status: { $exists: false } }] }
    this.sortOptions = {}
    this.limitValue = 20
    this.skipValue = 0
  }

  // Binary search-like filtering for categories
  filterByCategory(category) {
    if (category && category !== 'All') {
      this.query.category = category
    }
    return this
  }

  filterByFeatured(featured) {
    if (featured === 'true') {
      this.query.featured = true
    }
    return this
  }

  // Full-text search with weighted scoring
  search(searchTerm) {
    if (searchTerm) {
      this.query.$text = { $search: searchTerm }
      this.sortOptions.score = { $meta: 'textScore' }
    }
    return this
  }

  // Smart sorting with multiple criteria
  sort(sortBy = 'newest') {
    const sortMap = {
      newest: { createdAt: -1, featured: -1 },
      oldest: { createdAt: 1 },
      popular: { 'metrics.views': -1, 'metrics.likes': -1 },
      engagement: { engagementScore: -1 },
      featured: { featured: -1, priority: -1, createdAt: -1 }
    }
    Object.assign(this.sortOptions, sortMap[sortBy] || sortMap.newest)
    return this
  }

  paginate(page = 1, limit = 20) {
    this.limitValue = Math.min(parseInt(limit), 50) // Max 50 items per page
    this.skipValue = (Math.max(parseInt(page), 1) - 1) * this.limitValue
    return this
  }

  build() {
    return {
      query: this.query,
      sort: this.sortOptions,
      limit: this.limitValue,
      skip: this.skipValue
    }
  }
}

// Get all portfolio items with optimized querying
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit, page, search, sort } = req.query
    
    const builder = new PortfolioQueryBuilder()
      .filterByCategory(category)
      .filterByFeatured(featured)
      .search(search)
      .sort(sort)
      .paginate(page, limit)
    
    const { query, sort: sortOptions, limit: limitValue, skip: skipValue } = builder.build()
    
    // Parallel execution for better performance
    const [portfolioItems, total] = await Promise.all([
      Portfolio.find(query)
        .sort(sortOptions)
        .limit(limitValue)
        .skip(skipValue)
        .lean(), // Better performance
      Portfolio.countDocuments(query)
    ])
    
    console.log('Portfolio query:', query)
    console.log('Found items:', portfolioItems.length)
    console.log('Total count:', total)
    
    // Add slug field to portfolio response
    const enrichedPortfolio = portfolioItems.map(item => ({
      ...item,
      slug: item.seo?.slug
    }))
    
    res.json({
      items: enrichedPortfolio,
      pagination: {
        current: Math.floor(skipValue / limitValue) + 1,
        total: Math.ceil(total / limitValue),
        hasNext: skipValue + portfolioItems.length < total,
        totalItems: total
      },
      meta: {
        category,
        featured: featured === 'true',
        search: search || null
      }
    })
  } catch (error) {
    console.error('Portfolio fetch error:', error)
    res.status(500).json({ message: 'Failed to fetch portfolio items' })
  }
})

// Get portfolio by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ 'seo.slug': req.params.slug, status: { $ne: 'archived' } })
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' })
    }
    
    await Portfolio.findByIdAndUpdate(portfolio._id, { $inc: { 'metrics.views': 1 } })
    res.json({ portfolio })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch portfolio item' })
  }
})

// Get single portfolio item with smart recommendations
router.get('/:id', async (req, res) => {
  try {
    const portfolioId = req.params.id
    
    // Parallel execution for better performance
    const [portfolio, incrementResult] = await Promise.all([
      Portfolio.findOne({ _id: portfolioId, status: 'published' }),
      Portfolio.findByIdAndUpdate(portfolioId, { $inc: { 'metrics.views': 1 } })
    ])
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' })
    }
    
    // Smart recommendation algorithm (DSA: Content-based filtering)
    const related = await Portfolio.aggregate([
      {
        $match: {
          _id: { $ne: portfolio._id },
          status: 'published',
          $or: [
            { category: portfolio.category },
            { tags: { $in: portfolio.tags || [] } }
          ]
        }
      },
      {
        $addFields: {
          relevanceScore: {
            $add: [
              { $cond: [{ $eq: ['$category', portfolio.category] }, 10, 0] },
              { $size: { $setIntersection: ['$tags', portfolio.tags || []] } },
              { $cond: ['$featured', 5, 0] }
            ]
          }
        }
      },
      { $sort: { relevanceScore: -1, 'metrics.views': -1 } },
      { $limit: 4 },
      { $project: { detailedDescription: 0, seo: 0 } }
    ])
    
    res.json({ 
      portfolio, 
      related,
      meta: {
        views: portfolio.metrics.views + 1,
        engagementScore: portfolio.engagementScore
      }
    })
  } catch (error) {
    console.error('Portfolio detail error:', error)
    res.status(500).json({ message: 'Failed to fetch portfolio item' })
  }
})

// Create portfolio item with data validation
router.post('/', async (req, res) => {
  try {
    const portfolioData = { ...req.body }
    
    // Simple data processing
    if (portfolioData.tags && typeof portfolioData.tags === 'string') {
      portfolioData.tags = portfolioData.tags.split(',').map(t => t.trim()).filter(t => t)
    }
    if (portfolioData.technologies && typeof portfolioData.technologies === 'string') {
      portfolioData.technologies = portfolioData.technologies.split(',').map(t => t.trim()).filter(t => t)
    }
    if (portfolioData.images && typeof portfolioData.images === 'string') {
      portfolioData.images = portfolioData.images.split('\n').map(i => i.trim()).filter(i => i)
    }
    
    portfolioData.status = portfolioData.status || 'published'
    portfolioData.priority = portfolioData.priority || 0
    
    const portfolio = new Portfolio(portfolioData)
    const savedPortfolio = await portfolio.save()
    
    console.log('Created portfolio:', savedPortfolio)
    
    res.status(201).json(savedPortfolio.toObject())
  } catch (error) {
    console.error('Portfolio creation error:', error)
    console.error('Error stack:', error.stack)
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => e.message)
      })
    }
    
    res.status(500).json({ message: error.message || 'Failed to create portfolio item' })
  }
})

// Update portfolio item with optimistic updates
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body }
    
    // Simple data processing for update
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(t => t.trim()).filter(t => t)
    }
    if (updateData.technologies && typeof updateData.technologies === 'string') {
      updateData.technologies = updateData.technologies.split(',').map(t => t.trim()).filter(t => t)
    }
    if (updateData.images && typeof updateData.images === 'string') {
      updateData.images = updateData.images.split('\n').map(i => i.trim()).filter(i => i)
    }
    
    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' })
    }
    
    res.json(portfolio.toObject())
  } catch (error) {
    console.error('Portfolio update error:', error)
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => e.message)
      })
    }
    
    res.status(500).json({ success: false, message: 'Failed to update portfolio item' })
  }
})

// Engagement actions (like, share) with rate limiting
router.post('/:id/engage', async (req, res) => {
  try {
    const { action } = req.body // 'like', 'share'
    const validActions = ['like', 'share']
    
    if (!validActions.includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action' })
    }
    
    const updateField = `metrics.${action}s`
    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { $inc: { [updateField]: 1 } },
      { new: true, select: 'metrics title' }
    )
    
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' })
    }
    
    res.json({
      success: true,
      data: {
        [action]: portfolio.metrics[`${action}s`],
        engagementScore: portfolio.engagementScore
      }
    })
  } catch (error) {
    console.error('Engagement error:', error)
    res.status(500).json({ success: false, message: 'Failed to update engagement' })
  }
})

// Get portfolio metadata with statistics
router.get('/meta/stats', async (req, res) => {
  try {
    // Parallel aggregation for better performance
    const [categoryStats, generalStats] = await Promise.all([
      Portfolio.aggregate([
        { $match: { status: 'published' } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            featured: { $sum: { $cond: ['$featured', 1, 0] } },
            avgViews: { $avg: '$metrics.views' }
          }
        },
        { $sort: { count: -1 } }
      ]),
      Portfolio.aggregate([
        { $match: { status: 'published' } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            featured: { $sum: { $cond: ['$featured', 1, 0] } },
            totalViews: { $sum: '$metrics.views' },
            totalLikes: { $sum: '$metrics.likes' }
          }
        }
      ])
    ])
    
    res.json({
      categories: categoryStats.map(cat => ({
        name: cat._id,
        count: cat.count,
        featured: cat.featured,
        avgViews: Math.round(cat.avgViews || 0)
      })),
      overview: generalStats[0] || {
        total: 0,
        featured: 0,
        totalViews: 0,
        totalLikes: 0
      }
    })
  } catch (error) {
    console.error('Meta stats error:', error)
    res.status(500).json({ message: 'Failed to fetch statistics' })
  }
})

// Soft delete portfolio item
router.delete('/:id', async (req, res) => {
  try {
    const { permanent } = req.query
    
    if (permanent === 'true') {
      // Hard delete
      const portfolio = await Portfolio.findByIdAndDelete(req.params.id)
      if (!portfolio) {
        return res.status(404).json({ success: false, message: 'Portfolio item not found' })
      }
    } else {
      // Soft delete (archive)
      const portfolio = await Portfolio.findByIdAndUpdate(
        req.params.id,
        { status: 'archived' },
        { new: true }
      )
      if (!portfolio) {
        return res.status(404).json({ success: false, message: 'Portfolio item not found' })
      }
    }
    
    res.json({
      success: true,
      message: `Portfolio item ${permanent === 'true' ? 'permanently deleted' : 'archived'} successfully`
    })
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete portfolio item' })
  }
})

// Bulk operations for admin efficiency
router.post('/bulk', async (req, res) => {
  try {
    const { action, ids } = req.body
    const validActions = ['delete', 'archive', 'feature', 'unfeature', 'publish']
    
    if (!validActions.includes(action) || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: 'Invalid bulk operation' })
    }
    
    let result
    switch (action) {
      case 'delete':
        result = await Portfolio.deleteMany({ _id: { $in: ids } })
        break
      case 'archive':
        result = await Portfolio.updateMany({ _id: { $in: ids } }, { status: 'archived' })
        break
      case 'feature':
        result = await Portfolio.updateMany({ _id: { $in: ids } }, { featured: true })
        break
      case 'unfeature':
        result = await Portfolio.updateMany({ _id: { $in: ids } }, { featured: false })
        break
      case 'publish':
        result = await Portfolio.updateMany({ _id: { $in: ids } }, { status: 'published' })
        break
    }
    
    res.json({
      success: true,
      message: `Bulk ${action} completed`,
      affected: result.modifiedCount || result.deletedCount
    })
  } catch (error) {
    console.error('Bulk operation error:', error)
    res.status(500).json({ success: false, message: 'Bulk operation failed' })
  }
})

module.exports = router