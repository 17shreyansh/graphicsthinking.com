const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  detailedDescription: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  features: [String],
  deliveryTime: { type: String },
  revisions: { type: Number, default: 3 },
  category: { type: String, required: true },
  image: { type: String },
  images: [String],
  packages: [{
    name: String,
    price: Number,
    features: [String],
    deliveryTime: String
  }],
  active: { type: Boolean, default: true },
  popular: { type: Boolean, default: false },
  rating: { type: Number, default: 5 },
  totalOrders: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model('Service', serviceSchema)