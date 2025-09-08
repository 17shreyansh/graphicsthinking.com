const mongoose = require('mongoose')

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  detailedDescription: { type: String },
  category: { type: String, required: true, index: true },
  image: { type: String, required: true },
  images: [String],
  tags: [String],
  client: { type: String },
  projectDate: { type: Date },
  projectUrl: { type: String },
  technologies: [String],
  featured: { type: Boolean, default: false, index: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 }
}, { timestamps: true })

// Compound indexes for better query performance
portfolioSchema.index({ category: 1, featured: -1 })
portfolioSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Portfolio', portfolioSchema)