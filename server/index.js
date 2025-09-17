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
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use('/uploads', express.static('uploads'))

// Rate Limiting (disabled for development)
// app.use('/api/', generalLimiter)
// app.use('/api/contact', contactLimiter)

// Routes with Caching
app.use('/api/portfolio', cacheMiddleware(300), require('./routes/portfolio'))
app.use('/api/services', cacheMiddleware(600), require('./routes/services'))
app.use('/api/blog', cacheMiddleware(300), require('./routes/blog'))
app.use('/api/testimonials', cacheMiddleware(600), require('./routes/testimonials'))
app.use('/api/contact', require('./routes/contact'))
app.use('/api/upload', require('./routes/upload'))
app.use('/api/admin', require('./routes/admin'))

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})