const express = require('express')
const Portfolio = require('../models/Portfolio')
const Service = require('../models/Service')
const Blog = require('../models/Blog')
const Contact = require('../models/Contact')
const router = express.Router()

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [portfolioCount, servicesCount, blogCount, messagesCount, newMessagesCount] = await Promise.all([
      Portfolio.countDocuments(),
      Service.countDocuments(),
      Blog.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' })
    ])

    res.json({
      totalPortfolio: portfolioCount,
      totalServices: servicesCount,
      totalBlogs: blogCount,
      totalMessages: messagesCount,
      newMessages: newMessagesCount
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get recent activity
router.get('/recent', async (req, res) => {
  try {
    const [recentPortfolio, recentMessages, recentBlogs] = await Promise.all([
      Portfolio.find().sort({ createdAt: -1 }).limit(5).select('title category image createdAt'),
      Contact.find().sort({ createdAt: -1 }).limit(5).select('name subject status createdAt'),
      Blog.find().sort({ createdAt: -1 }).limit(5).select('title category published createdAt')
    ])

    res.json({
      portfolio: recentPortfolio,
      messages: recentMessages,
      blogs: recentBlogs
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Bulk operations
router.post('/bulk-delete', async (req, res) => {
  try {
    const { type, ids } = req.body
    let Model

    switch (type) {
      case 'portfolio':
        Model = Portfolio
        break
      case 'services':
        Model = Service
        break
      case 'blog':
        Model = Blog
        break
      case 'messages':
        Model = Contact
        break
      default:
        return res.status(400).json({ message: 'Invalid type' })
    }

    await Model.deleteMany({ _id: { $in: ids } })
    res.json({ message: `${ids.length} items deleted successfully` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Export data
router.get('/export/:type', async (req, res) => {
  try {
    const { type } = req.params
    let Model, data

    switch (type) {
      case 'portfolio':
        Model = Portfolio
        break
      case 'services':
        Model = Service
        break
      case 'blog':
        Model = Blog
        break
      case 'messages':
        Model = Contact
        break
      default:
        return res.status(400).json({ message: 'Invalid type' })
    }

    data = await Model.find()
    
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename=${type}-export.json`)
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router