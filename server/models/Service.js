const mongoose = require('mongoose')

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  features: [{ type: String, trim: true, maxlength: 200 }],
  deliveryTime: { type: String, required: true, trim: true },
  revisions: { type: Number, default: 3, min: 0, max: 10 },
  popular: { type: Boolean, default: false }
})

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true, maxlength: 500 },
  detailedDescription: { type: String, trim: true, maxlength: 3000 },
  category: { 
    type: String, 
    required: true, 
    enum: ['Branding', 'Digital Marketing', 'Print Design', 'Web Design', 'Other']
  },
  pricing: {
    basePrice: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    currency: { type: String, default: 'INR', enum: ['INR', 'USD', 'EUR'] },
    priceType: { type: String, enum: ['fixed', 'hourly', 'project'], default: 'fixed' }
  },
  delivery: {
    estimatedDays: { type: Number, required: true, min: 1, max: 365 },
    expressDelivery: { type: Boolean, default: false },
    revisions: { type: Number, default: 3, min: 0, max: 10 }
  },
  media: {
    primaryImage: { type: String },
    gallery: [{ type: String, validate: { validator: v => v.length <= 8, message: 'Max 8 images allowed' } }],
    videoUrl: { type: String }
  },
  packages: [packageSchema],
  features: [{ type: String, trim: true, maxlength: 200 }],
  requirements: [{ type: String, trim: true, maxlength: 300 }],
  status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'active' },
  visibility: { type: String, enum: ['public', 'private', 'featured'], default: 'public' },
  metrics: {
    totalOrders: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    views: { type: Number, default: 0, min: 0 }
  },
  seo: {
    slug: { type: String, unique: true, sparse: true },
    metaTitle: { type: String, maxlength: 60 },
    metaDescription: { type: String, maxlength: 160 },
    keywords: [{ type: String, trim: true, maxlength: 50 }]
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for popularity score (DSA: weighted ranking algorithm)
serviceSchema.virtual('popularityScore').get(function() {
  const weights = { orders: 10, rating: 5, views: 1, reviews: 3 }
  return (this.metrics.totalOrders * weights.orders) + 
         (this.metrics.rating * weights.rating) + 
         (this.metrics.views * weights.views) + 
         (this.metrics.reviewCount * weights.reviews)
})

// Virtual for discount percentage
serviceSchema.virtual('discountPercentage').get(function() {
  if (this.pricing.originalPrice && this.pricing.originalPrice > this.pricing.basePrice) {
    return Math.round(((this.pricing.originalPrice - this.pricing.basePrice) / this.pricing.originalPrice) * 100)
  }
  return 0
})

// Optimized compound indexes (DSA: Multi-dimensional indexing)
serviceSchema.index({ status: 1, category: 1, visibility: 1, 'metrics.rating': -1 })
serviceSchema.index({ createdAt: -1, visibility: 1 })
serviceSchema.index({ 'pricing.basePrice': 1, category: 1 })
serviceSchema.index({ 'metrics.totalOrders': -1, 'metrics.rating': -1 })
serviceSchema.index({ name: 'text', description: 'text', 'seo.keywords': 'text' })

// Auto-slugify function
function createSlug(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Pre-save middleware for slug generation
serviceSchema.pre('save', async function(next) {
  if (this.isModified('name')) {
    if (!this.seo) this.seo = {}
    
    let baseSlug = createSlug(this.name)
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

module.exports = mongoose.model('Service', serviceSchema)