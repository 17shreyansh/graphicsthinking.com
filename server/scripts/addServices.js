const mongoose = require('mongoose')
require('dotenv').config()

const Service = require('../models/Service')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/graphicsthinking')
    console.log('MongoDB Connected')
  } catch (error) {
    console.error('Database connection error:', error)
    process.exit(1)
  }
}

const testServices = [
  {
    name: "Logo Design",
    description: "Professional logo design that captures your brand's essence and makes a lasting impression.",
    detailedDescription: "Our logo design process involves deep research into your industry, target audience, and brand values. We create multiple concepts, refine based on your feedback, and deliver a logo that truly represents your business.",
    pricing: {
      basePrice: 12500,
      originalPrice: 16500,
      currency: "INR",
      priceType: "fixed"
    },
    delivery: {
      estimatedDays: 7,
      expressDelivery: false,
      revisions: 5
    },
    features: [
      "3 Initial concepts",
      "Unlimited revisions", 
      "Vector files (AI, EPS, SVG)",
      "High-resolution PNG/JPG",
      "Brand guidelines document"
    ],
    category: "Branding",
    media: {
      primaryImage: "https://picsum.photos/600/400?random=1"
    },
    status: "active",
    visibility: "featured",
    metrics: {
      rating: 4.9,
      totalOrders: 127,
      reviewCount: 45,
      views: 0
    }
  },
  {
    name: "Social Media Design",
    description: "Engaging social media graphics that boost your online presence and drive engagement.",
    detailedDescription: "Stand out on social media with professionally designed graphics tailored to each platform's requirements. We create cohesive visual content that aligns with your brand.",
    pricing: {
      basePrice: 6200,
      currency: "INR", 
      priceType: "fixed"
    },
    delivery: {
      estimatedDays: 3,
      expressDelivery: true,
      revisions: 3
    },
    features: [
      "Platform-optimized designs",
      "Brand-consistent styling",
      "High-quality graphics",
      "Multiple format options"
    ],
    category: "Digital Marketing",
    media: {
      primaryImage: "https://picsum.photos/600/400?random=2"
    },
    status: "active",
    visibility: "public",
    metrics: {
      rating: 4.8,
      totalOrders: 89,
      reviewCount: 32,
      views: 0
    }
  },
  {
    name: "Business Card Design",
    description: "Professional business card designs that make a memorable first impression.",
    detailedDescription: "Create a lasting impression with professionally designed business cards. We focus on clean, modern designs that reflect your brand personality.",
    pricing: {
      basePrice: 4500,
      originalPrice: 6000,
      currency: "INR",
      priceType: "fixed"
    },
    delivery: {
      estimatedDays: 3,
      expressDelivery: true,
      revisions: 3
    },
    features: [
      "Double-sided design",
      "Print-ready files",
      "Multiple concepts",
      "Premium finishes options"
    ],
    category: "Print Design",
    media: {
      primaryImage: "https://picsum.photos/600/400?random=3"
    },
    status: "active",
    visibility: "public",
    metrics: {
      rating: 4.7,
      totalOrders: 156,
      reviewCount: 67,
      views: 0
    }
  }
]

const addServices = async () => {
  try {
    await connectDB()
    
    // Clear existing services
    await Service.deleteMany({})
    console.log('Cleared existing services')
    
    // Add new services
    const services = await Service.insertMany(testServices)
    console.log(`Added ${services.length} services:`)
    
    services.forEach(service => {
      console.log(`- ${service.name} (slug: ${service.seo?.slug})`)
    })
    
    process.exit(0)
  } catch (error) {
    console.error('Error adding services:', error)
    process.exit(1)
  }
}

addServices()