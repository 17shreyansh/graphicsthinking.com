const mongoose = require('mongoose')
const Portfolio = require('../models/Portfolio')
const Service = require('../models/Service')
const Contact = require('../models/Contact')
require('dotenv').config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/graphicsthinking')
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

const addTestData = async () => {
  try {
    // Add portfolio items
    const portfolioItems = [
      {
        title: 'Modern Logo Design',
        description: 'Clean and modern logo design for tech startup',
        category: 'Logo Design',
        image: 'https://via.placeholder.com/400x300',
        client: 'Tech Corp',
        featured: true
      },
      {
        title: 'Social Media Campaign',
        description: 'Complete social media branding package',
        category: 'Social Media',
        image: 'https://via.placeholder.com/400x300',
        client: 'Fashion Brand',
        featured: false
      }
    ]

    await Portfolio.deleteMany({})
    await Portfolio.insertMany(portfolioItems)
    console.log('Portfolio items added')

    // Add services
    const services = [
      {
        name: 'Logo Design',
        description: 'Professional logo design service',
        price: 5000,
        category: 'Branding',
        deliveryTime: '3-5 days'
      },
      {
        name: 'Website Design',
        description: 'Complete website design and development',
        price: 25000,
        category: 'Digital Marketing',
        deliveryTime: '7-10 days'
      }
    ]

    await Service.deleteMany({})
    await Service.insertMany(services)
    console.log('Services added')

    // Add contact messages
    const messages = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Logo Design Inquiry',
        message: 'I need a logo for my new business',
        status: 'new'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Website Project',
        message: 'Looking for a complete website solution',
        status: 'read'
      }
    ]

    await Contact.deleteMany({})
    await Contact.insertMany(messages)
    console.log('Contact messages added')

    console.log('Test data added successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error adding test data:', error)
    process.exit(1)
  }
}

connectDB().then(addTestData)