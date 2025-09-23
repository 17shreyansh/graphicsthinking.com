// Image URL transformation middleware
const transformUrls = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(transformUrls)
  }

  const transformed = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      transformed[key] = value
    } else if (typeof value === 'string' && value.startsWith && value.startsWith('/uploads/')) {
      // Transform relative URLs to absolute URLs
      transformed[key] = `${process.env.SERVER_BASE_URL || 'http://localhost:5000'}${value}`
    } else if (typeof value === 'object') {
      transformed[key] = transformUrls(value)
    } else {
      transformed[key] = value
    }
  }
  
  return transformed
}

// Middleware to transform image URLs in responses
const imageTransformMiddleware = (req, res, next) => {
  const originalJson = res.json
  
  res.json = function(data) {
    const transformedData = transformUrls(data)
    return originalJson.call(this, transformedData)
  }
  
  next()
}

module.exports = {
  imageTransformMiddleware,
  transformUrls
}