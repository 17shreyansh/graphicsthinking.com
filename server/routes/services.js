const express = require('express')
const Service = require('../models/Service')
const { multiple } = require('../middleware/upload')
const router = express.Router()

// DSA: Advanced service query builder with smart filtering
class ServiceQueryBuilder {
  constructor() {
    this.query = {}
    this.sortOptions = {}
    this.limitValue = 20
    this.skipValue = 0
  }

  filterByCategory(category) {
    if (category && category !== 'All') {
      this.query.category = category
    }
    return this
  }

  filterByVisibility(visibility = 'public') {
    this.query.visibility = { $in: ['public', 'featured'] }
    if (visibility === 'featured') {
      this.query.visibility = 'featured'
    }
    return this
  }

  filterByPriceRange(minPrice, maxPrice) {
    if (minPrice || maxPrice) {
      this.query['pricing.basePrice'] = {}
      if (minPrice) this.query['pricing.basePrice'].$gte = parseInt(minPrice)
      if (maxPrice) this.query['pricing.basePrice'].$lte = parseInt(maxPrice)
    }
    return this
  }

  search(searchTerm) {
    if (searchTerm) {
      this.query.$text = { $search: searchTerm }
      this.sortOptions.score = { $meta: 'textScore' }
    }
    return this
  }

  sort(sortBy = 'popular') {
    const sortMap = {
      popular: { visibility: -1, 'metrics.totalOrders': -1, 'metrics.rating': -1 },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_low: { 'pricing.basePrice': 1 },
      price_high: { 'pricing.basePrice': -1 },
      rating: { 'metrics.rating': -1, 'metrics.reviewCount': -1 }
    }
    Object.assign(this.sortOptions, sortMap[sortBy] || sortMap.popular)
    return this
  }

  paginate(page = 1, limit = 20) {
    this.limitValue = Math.min(parseInt(limit), 50)
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

// Get all services with advanced filtering
router.get('/', async (req, res) => {
  try {
    const { category, visibility, minPrice, maxPrice, search, sort, page, limit } = req.query
    
    const builder = new ServiceQueryBuilder()
      .filterByCategory(category)
      .filterByVisibility(visibility)
      .filterByPriceRange(minPrice, maxPrice)
      .search(search)
      .sort(sort)
      .paginate(page, limit)
    
    const { query, sort: sortOptions, limit: limitValue, skip: skipValue } = builder.build()
    
    // Parallel execution for performance
    const [services, total] = await Promise.all([
      Service.find(query)
        .sort(sortOptions)
        .limit(limitValue)
        .skip(skipValue)
        .lean(),
      Service.countDocuments(query)
    ])
    
    console.log('Services query:', query)
    console.log('Found services:', services.length)
    console.log('Sample service:', services[0])
    console.log('Total services count:', total)
    
    // Add computed fields and expose slug
    const enrichedServices = services.map(service => ({
      ...service,
      slug: service.seo?.slug || service._id,
      discountPercentage: service.pricing?.originalPrice && service.pricing.originalPrice > service.pricing.basePrice
        ? Math.round(((service.pricing.originalPrice - service.pricing.basePrice) / service.pricing.originalPrice) * 100)
        : 0
    }))
    
    res.json({
      services: enrichedServices,
      pagination: {
        current: Math.floor(skipValue / limitValue) + 1,
        total: Math.ceil(total / limitValue),
        hasNext: skipValue + services.length < total,
        totalItems: total
      },
      filters: {
        category,
        priceRange: { min: minPrice, max: maxPrice },
        search: search || null
      }
    })
  } catch (error) {
    console.error('Services fetch error:', error)
    res.status(500).json({ message: 'Failed to fetch services' })
  }
})

// Get single service - handles both ID and slug
router.get('/:identifier', async (req, res) => {
  try {
    const identifier = req.params.identifier
    
    // Try to find by slug first, then by ID
    let service
    
    // First try to find by slug
    service = await Service.findOne({ 'seo.slug': identifier, status: 'active' })
    
    // If not found by slug, try by ID (for backward compatibility)
    if (!service) {
      try {
        service = await Service.findOne({ _id: identifier, status: 'active' })
      } catch (error) {
        // Invalid ObjectId format, service remains null
      }
    }
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }
    
    // Increment views
    await Service.findByIdAndUpdate(service._id, { $inc: { 'metrics.views': 1 } })
    
    // Smart recommendation algorithm
    const related = await Service.aggregate([
      {
        $match: {
          _id: { $ne: service._id },
          status: 'active',
          $or: [
            { category: service.category },
            { 'pricing.basePrice': { 
              $gte: service.pricing?.basePrice ? service.pricing.basePrice * 0.7 : 0, 
              $lte: service.pricing?.basePrice ? service.pricing.basePrice * 1.3 : 999999 
            }}
          ]
        }
      },
      {
        $addFields: {
          relevanceScore: {
            $add: [
              { $cond: [{ $eq: ['$category', service.category] }, 15, 0] },
              { $cond: [{ $eq: ['$visibility', 'featured'] }, 10, 0] },
              {
                $multiply: [
                  { $divide: [{ $ifNull: ['$metrics.rating', 5] }, 5] },
                  5
                ]
              }
            ]
          }
        }
      },
      { $sort: { relevanceScore: -1, 'metrics.totalOrders': -1 } },
      { $limit: 4 },
      { $project: { detailedDescription: 0, requirements: 0 } }
    ])
    
    // Ensure slug is exposed in response
    const enrichedService = {
      ...service.toObject(),
      slug: service.seo?.slug || service._id
    }
    
    const enrichedRelated = related.map(item => ({
      ...item,
      slug: item.seo?.slug || item._id
    }))
    
    res.json({ service: enrichedService, related: enrichedRelated })
  } catch (error) {
    console.error('Service detail error:', error)
    res.status(500).json({ message: 'Failed to fetch service details' })
  }
})

// Create service with advanced validation
router.post('/', async (req, res) => {
  try {
    const serviceData = { ...req.body }
    
    // Simple data processing
    if (serviceData.features && typeof serviceData.features === 'string') {
      serviceData.features = serviceData.features.split(',').map(f => f.trim()).filter(f => f)
    }
    if (serviceData.requirements && typeof serviceData.requirements === 'string') {
      serviceData.requirements = serviceData.requirements.split(',').map(r => r.trim()).filter(r => r)
    }
    
    // Handle legacy price field
    if (serviceData.price && !serviceData.pricing) {
      serviceData.pricing = {
        basePrice: serviceData.price,
        originalPrice: serviceData.originalPrice || null,
        currency: 'INR',
        priceType: 'fixed'
      }
    }
    
    // Handle legacy delivery field
    if (serviceData.deliveryTime && !serviceData.delivery) {
      const days = parseInt(serviceData.deliveryTime.match(/\d+/)?.[0]) || 7
      serviceData.delivery = {
        estimatedDays: days,
        expressDelivery: false,
        revisions: serviceData.revisions || 3
      }
    }
    
    serviceData.status = serviceData.status || 'active'
    serviceData.visibility = serviceData.visibility || 'public'
    
    const service = new Service(serviceData)
    const savedService = await service.save()
    
    console.log('Created service:', savedService)
    res.status(201).json(savedService.toObject())
  } catch (error) {
    console.error('Service creation error:', error)
    res.status(500).json({ message: error.message || 'Failed to create service' })
  }
})

// Update service with smart data handling
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body }
    
    // Simple data processing for update
    if (updateData.features && typeof updateData.features === 'string') {
      updateData.features = updateData.features.split(',').map(f => f.trim()).filter(f => f)
    }
    if (updateData.requirements && typeof updateData.requirements === 'string') {
      updateData.requirements = updateData.requirements.split(',').map(r => r.trim()).filter(r => r)
    }
    
    // Handle legacy fields
    if (updateData.price !== undefined) {
      updateData['pricing.basePrice'] = updateData.price
      delete updateData.price
    }
    if (updateData.originalPrice !== undefined) {
      updateData['pricing.originalPrice'] = updateData.originalPrice
      delete updateData.originalPrice
    }
    
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }
    
    res.json(service.toObject())
  } catch (error) {
    console.error('Service update error:', error)
    res.status(500).json({ message: error.message || 'Failed to update service' })
  }
})

// Get service metadata with analytics
router.get('/meta/analytics', async (req, res) => {
  try {
    const [categoryStats, priceStats, generalStats] = await Promise.all([
      // Category distribution with performance metrics
      Service.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            avgPrice: { $avg: '$pricing.basePrice' },
            avgRating: { $avg: '$metrics.rating' },
            totalOrders: { $sum: '$metrics.totalOrders' },
            featured: { $sum: { $cond: [{ $eq: ['$visibility', 'featured'] }, 1, 0] } }
          }
        },
        { $sort: { count: -1 } }
      ]),
      
      // Price distribution analysis
      Service.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$pricing.basePrice' },
            maxPrice: { $max: '$pricing.basePrice' },
            avgPrice: { $avg: '$pricing.basePrice' },
            priceRanges: {
              $push: {
                $switch: {
                  branches: [
                    { case: { $lt: ['$pricing.basePrice', 5000] }, then: 'budget' },
                    { case: { $lt: ['$pricing.basePrice', 15000] }, then: 'standard' },
                    { case: { $lt: ['$pricing.basePrice', 50000] }, then: 'premium' }
                  ],
                  default: 'enterprise'
                }
              }
            }
          }
        }
      ]),
      
      // General statistics
      Service.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            featured: { $sum: { $cond: [{ $eq: ['$visibility', 'featured'] }, 1, 0] } },
            totalOrders: { $sum: '$metrics.totalOrders' },
            avgRating: { $avg: '$metrics.rating' }
          }
        }
      ])
    ])
    
    // Process price ranges
    const priceRangeCount = priceStats[0]?.priceRanges.reduce((acc, range) => {
      acc[range] = (acc[range] || 0) + 1
      return acc
    }, {}) || {}
    
    res.json({
      categories: categoryStats.map(cat => ({
        name: cat._id,
        count: cat.count,
        avgPrice: Math.round(cat.avgPrice || 0),
        avgRating: Math.round((cat.avgRating || 0) * 10) / 10,
        totalOrders: cat.totalOrders,
        featured: cat.featured
      })),
      pricing: {
        min: priceStats[0]?.minPrice || 0,
        max: priceStats[0]?.maxPrice || 0,
        average: Math.round(priceStats[0]?.avgPrice || 0),
        distribution: priceRangeCount
      },
      overview: generalStats[0] || {
        total: 0,
        featured: 0,
        totalOrders: 0,
        avgRating: 0
      }
    })
  } catch (error) {
    console.error('Service analytics error:', error)
    res.status(500).json({ message: 'Failed to fetch service analytics' })
  }
})

// Soft delete service
router.delete('/:id', async (req, res) => {
  try {
    const { permanent } = req.query
    
    if (permanent === 'true') {
      const service = await Service.findByIdAndDelete(req.params.id)
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' })
      }
    } else {
      const service = await Service.findByIdAndUpdate(
        req.params.id,
        { status: 'inactive' },
        { new: true }
      )
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' })
      }
    }
    
    res.json({
      success: true,
      message: `Service ${permanent === 'true' ? 'permanently deleted' : 'deactivated'} successfully`
    })
  } catch (error) {
    console.error('Service delete error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete service' })
  }
})

// Bulk operations for services
router.post('/bulk', async (req, res) => {
  try {
    const { action, ids } = req.body
    const validActions = ['delete', 'deactivate', 'activate', 'feature', 'unfeature']
    
    if (!validActions.includes(action) || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: 'Invalid bulk operation' })
    }
    
    let result
    switch (action) {
      case 'delete':
        result = await Service.deleteMany({ _id: { $in: ids } })
        break
      case 'deactivate':
        result = await Service.updateMany({ _id: { $in: ids } }, { status: 'inactive' })
        break
      case 'activate':
        result = await Service.updateMany({ _id: { $in: ids } }, { status: 'active' })
        break
      case 'feature':
        result = await Service.updateMany({ _id: { $in: ids } }, { visibility: 'featured' })
        break
      case 'unfeature':
        result = await Service.updateMany({ _id: { $in: ids } }, { visibility: 'public' })
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