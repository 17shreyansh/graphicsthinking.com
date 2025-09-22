const mongoose = require('mongoose')

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true, maxlength: 500 },
  detailedDescription: { type: String, trim: true, maxlength: 2000 },
  category: { 
    type: String, 
    required: true, 
    enum: ['Logo Design', 'Social Media', 'Print Design', 'Web Design', 'Branding', 'Other']
  },
  image: { type: String, required: true },
  images: [{ type: String, validate: { validator: v => v.length <= 10, message: 'Max 10 images allowed' } }],
  tags: [{ type: String, trim: true, maxlength: 50 }],
  client: { type: String, trim: true, maxlength: 100 },
  projectDate: { type: Date, default: Date.now },
  projectUrl: { type: String, trim: true },
  technologies: [{ type: String, trim: true, maxlength: 50 }],
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  priority: { type: Number, default: 0, min: 0, max: 100 },
  metrics: {
    views: { type: Number, default: 0, min: 0 },
    likes: { type: Number, default: 0, min: 0 },
    shares: { type: Number, default: 0, min: 0 }
  },
  seo: {
    slug: { type: String, unique: true, sparse: true },
    metaTitle: { type: String, maxlength: 60 },
    metaDescription: { type: String, maxlength: 160 }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for engagement score (DSA: weighted scoring algorithm)
portfolioSchema.virtual('engagementScore').get(function() {
  const weights = { views: 1, likes: 5, shares: 10 }
  return (this.metrics.views * weights.views) + 
         (this.metrics.likes * weights.likes) + 
         (this.metrics.shares * weights.shares)
})

// Optimized compound indexes (DSA: B-tree indexing strategy)
portfolioSchema.index({ status: 1, category: 1, featured: -1, priority: -1 })
portfolioSchema.index({ createdAt: -1, featured: -1 })
portfolioSchema.index({ 'metrics.views': -1, 'metrics.likes': -1 })
portfolioSchema.index({ tags: 1 })
portfolioSchema.index({ title: 'text', description: 'text', tags: 'text' })

// Auto-slugify function
function createSlug(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Pre-save middleware for slug generation
portfolioSchema.pre('save', async function(next) {
  if (this.isModified('title')) {
    if (!this.seo) this.seo = {}
    
    let baseSlug = createSlug(this.title)
    let slug = baseSlug
    let counter = 1
    
    // Make unique slug
    while (await this.constructor.findOne({ 'seo.slug': slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }
    
    this.seo.slug = slug
  }
  next()
})

module.exports = mongoose.model('Portfolio', portfolioSchema)