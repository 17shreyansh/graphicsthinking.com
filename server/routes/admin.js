const express = require('express')
const Portfolio = require('../models/Portfolio')
const Service = require('../models/Service')
const Contact = require('../models/Contact')
const router = express.Router()

// Get comprehensive dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [portfolioCount, servicesCount, messagesCount, newMessagesCount, featuredPortfolio, popularServices] = await Promise.all([
      Portfolio.countDocuments(),
      Service.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Portfolio.countDocuments({ featured: true }),
      Service.countDocuments({ popular: true })
    ])

    // Get monthly stats for charts
    const monthlyStats = await getMonthlyStats()
    
    res.json({
      totalPortfolio: portfolioCount,
      totalServices: servicesCount,
      totalMessages: messagesCount,
      newMessages: newMessagesCount,
      featuredPortfolio,
      popularServices,
      monthlyStats
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get monthly statistics for charts
async function getMonthlyStats() {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  
  const pipeline = [
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]
  
  const [portfolioStats, serviceStats, messageStats] = await Promise.all([
    Portfolio.aggregate(pipeline),
    Service.aggregate(pipeline),
    Contact.aggregate(pipeline)
  ])
  
  return { portfolioStats, serviceStats, messageStats }
}

// Get recent activity with enhanced data
router.get('/recent', async (req, res) => {
  try {
    const [recentPortfolio, recentServices, recentMessages] = await Promise.all([
      Portfolio.find().sort({ createdAt: -1 }).limit(5).select('title category image createdAt featured views'),
      Service.find().sort({ createdAt: -1 }).limit(5).select('name category price createdAt popular'),
      Contact.find().sort({ createdAt: -1 }).limit(5).select('name subject status createdAt email')
    ])

    res.json({
      portfolio: recentPortfolio,
      services: recentServices,
      messages: recentMessages
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Analytics endpoint
router.get('/analytics', async (req, res) => {
  try {
    const [topPortfolio, topServices, categoryStats] = await Promise.all([
      Portfolio.find().sort({ views: -1 }).limit(10).select('title views likes category'),
      Service.find().sort({ totalOrders: -1 }).limit(10).select('name totalOrders rating category'),
      getCategoryStats()
    ])

    res.json({
      topPortfolio,
      topServices,
      categoryStats
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

async function getCategoryStats() {
  const [portfolioCategories, serviceCategories] = await Promise.all([
    Portfolio.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalViews: { $sum: '$views' } } },
      { $sort: { count: -1 } }
    ]),
    Service.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalOrders: { $sum: '$totalOrders' } } },
      { $sort: { count: -1 } }
    ])
  ])
  
  return { portfolioCategories, serviceCategories }
}

// Bulk operations with enhanced functionality
router.post('/bulk-action', async (req, res) => {
  try {
    const { type, action, ids, data } = req.body
    let Model

    switch (type) {
      case 'portfolio':
        Model = Portfolio
        break
      case 'services':
        Model = Service
        break
      case 'messages':
        Model = Contact
        break
      default:
        return res.status(400).json({ message: 'Invalid type' })
    }

    let result
    switch (action) {
      case 'delete':
        result = await Model.deleteMany({ _id: { $in: ids } })
        break
      case 'update':
        result = await Model.updateMany({ _id: { $in: ids } }, data)
        break
      case 'toggle-featured':
        const items = await Model.find({ _id: { $in: ids } })
        const updates = items.map(item => 
          Model.updateOne({ _id: item._id }, { featured: !item.featured })
        )
        result = await Promise.all(updates)
        break
      default:
        return res.status(400).json({ message: 'Invalid action' })
    }

    res.json({ message: `Bulk ${action} completed successfully`, result })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Enhanced export with filtering
router.get('/export/:type', async (req, res) => {
  try {
    const { type } = req.params
    const { format = 'json', filter = {} } = req.query
    let Model, data

    switch (type) {
      case 'portfolio':
        Model = Portfolio
        break
      case 'services':
        Model = Service
        break
      case 'messages':
        Model = Contact
        break
      default:
        return res.status(400).json({ message: 'Invalid type' })
    }

    data = await Model.find(filter)
    
    if (format === 'csv') {
      const csv = convertToCSV(data)
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', `attachment; filename=${type}-export.csv`)
      res.send(csv)
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Disposition', `attachment; filename=${type}-export.json`)
      res.json(data)
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Simple CSV converter
function convertToCSV(data) {
  if (!data.length) return ''
  
  const headers = Object.keys(data[0].toObject ? data[0].toObject() : data[0])
  const csvHeaders = headers.join(',')
  
  const csvRows = data.map(item => {
    const obj = item.toObject ? item.toObject() : item
    return headers.map(header => {
      const value = obj[header]
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
    }).join(',')
  })
  
  return [csvHeaders, ...csvRows].join('\n')
}

// Search functionality
router.get('/search', async (req, res) => {
  try {
    const { q, type, limit = 10 } = req.query
    const searchRegex = new RegExp(q, 'i')
    let results = {}

    if (!type || type === 'portfolio') {
      results.portfolio = await Portfolio.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { tags: { $in: [searchRegex] } }
        ]
      }).limit(parseInt(limit)).select('title category image createdAt')
    }

    if (!type || type === 'services') {
      results.services = await Service.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { category: searchRegex }
        ]
      }).limit(parseInt(limit)).select('name category price createdAt')
    }

    if (!type || type === 'messages') {
      results.messages = await Contact.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { subject: searchRegex },
          { message: searchRegex }
        ]
      }).limit(parseInt(limit)).select('name email subject status createdAt')
    }

    res.json(results)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router