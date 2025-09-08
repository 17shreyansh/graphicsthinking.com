const rateLimit = require('express-rate-limit')

const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  })
}

module.exports = {
  generalLimiter: createRateLimiter(),
  contactLimiter: createRateLimiter(15 * 60 * 1000, 5),
  adminLimiter: createRateLimiter(15 * 60 * 1000, 50)
}