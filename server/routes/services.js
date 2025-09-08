const express = require('express')
const Service = require('../models/Service')
const { multiple } = require('../middleware/upload')
const router = express.Router()

// Get all services
router.get('/', async (req, res) => {
  try {
    const { category, popular, limit = 20, page = 1, search } = req.query
    const query = { active: true }
    
    if (category) {
      query.category = category
    }
    
    if (popular === 'true') {
      query.popular = true
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    const skip = (page - 1) * limit
    const services = await Service.find(query)
      .sort({ popular: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
    
    const total = await Service.countDocuments(query)
    
    res.json({
      services,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + services.length < total
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }
    
    // Get related services
    const related = await Service.find({
      _id: { $ne: req.params.id },
      category: service.category,
      active: true
    }).limit(3)
    
    res.json({ service, related })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create service
router.post('/', multiple('images'), async (req, res) => {
  try {
    const serviceData = { ...req.body }
    
    if (req.files && req.files.length > 0) {
      serviceData.image = req.files[0].path
      serviceData.images = req.files.map(file => file.path)
    }
    
    if (serviceData.features && typeof serviceData.features === 'string') {
      serviceData.features = serviceData.features.split(',')
    }
    
    if (serviceData.packages && typeof serviceData.packages === 'string') {
      serviceData.packages = JSON.parse(serviceData.packages)
    }
    
    const service = new Service(serviceData)
    await service.save()
    res.status(201).json(service)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update service
router.put('/:id', multiple('images'), async (req, res) => {
  try {
    const updateData = { ...req.body }
    
    if (req.files && req.files.length > 0) {
      updateData.image = req.files[0].path
      updateData.images = req.files.map(file => file.path)
    }
    
    if (updateData.features && typeof updateData.features === 'string') {
      updateData.features = updateData.features.split(',')
    }
    
    if (updateData.packages && typeof updateData.packages === 'string') {
      updateData.packages = JSON.parse(updateData.packages)
    }
    
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }
    
    res.json(service)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Get service categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Service.distinct('category')
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete service
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id)
    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }
    res.json({ message: 'Service deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router