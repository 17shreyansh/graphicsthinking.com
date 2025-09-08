const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 600 }) // 10 minutes default

const cacheMiddleware = (duration = 600) => {
  return (req, res, next) => {
    const key = req.originalUrl
    const cachedResponse = cache.get(key)
    
    if (cachedResponse) {
      return res.json(cachedResponse)
    }
    
    res.sendResponse = res.json
    res.json = (body) => {
      cache.set(key, body, duration)
      res.sendResponse(body)
    }
    
    next()
  }
}

module.exports = { cacheMiddleware, cache }