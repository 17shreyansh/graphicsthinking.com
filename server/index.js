const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
require('dotenv').config()

const connectDB = require('./config/database')
const { generalLimiter, contactLimiter } = require('./middleware/rateLimiter')
const { cacheMiddleware } = require('./middleware/cache')

const app = express()
const PORT = process.env.PORT || 5000

// Connect Database
connectDB()

// Security & Performance Middleware
app.use(helmet())
app.use(compression())
app.use(morgan('combined'))
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173','https://www.thegraphicsthinking.com', 'https://thegraphicsthinking.com'],
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use('/uploads', express.static('uploads'))
app.use('/api/upload', require('./routes/upload'))

// Rate Limiting (disabled for development)
// app.use('/api/', generalLimiter)
// app.use('/api/contact', contactLimiter)

// Routes with Caching
app.use('/api/portfolio', require('./routes/portfolio'))
app.use('/api/services', cacheMiddleware(600), require('./routes/services'))
app.use('/api/testimonials', cacheMiddleware(600), require('./routes/testimonials'))
app.use('/api/contact', require('./routes/contact'))
app.use('/api/admin', require('./routes/admin'))

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Debug endpoint
app.get('/api/debug', async (req, res) => {
  try {
    const Portfolio = require('./models/Portfolio')
    const Service = require('./models/Service')
    const portfolioCount = await Portfolio.countDocuments()
    const serviceCount = await Service.countDocuments()
    const services = await Service.find({}).limit(5)
    res.json({ 
      portfolioCount, 
      serviceCount,
      sampleServices: services,
      dbConnected: true,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: error.message, dbConnected: false })
  }
})

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})