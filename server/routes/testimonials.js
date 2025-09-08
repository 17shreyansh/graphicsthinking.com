const express = require('express')
const Testimonial = require('../models/Testimonial')
const router = express.Router()

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 })
    res.json(testimonials)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create testimonial
router.post('/', async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body)
    await testimonial.save()
    res.status(201).json(testimonial)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update testimonial
router.put('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(testimonial)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete testimonial
router.delete('/:id', async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id)
    res.json({ message: 'Testimonial deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router