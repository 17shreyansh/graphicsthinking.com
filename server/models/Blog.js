const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  excerpt: { type: String, required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  images: [String],
  tags: [String],
  author: { type: String, default: 'Graphics Thinking' },
  readTime: { type: Number, default: 5 },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: false },
  publishedAt: { type: Date },
  seoTitle: { type: String },
  seoDescription: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('Blog', blogSchema)