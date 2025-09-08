const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/'
    
    // Determine upload path based on route
    if (req.route.path.includes('portfolio')) {
      uploadPath += 'portfolio/'
    } else if (req.route.path.includes('service')) {
      uploadPath += 'services/'
    } else if (req.route.path.includes('blog')) {
      uploadPath += 'blogs/'
    } else {
      uploadPath += 'general/'
    }
    
    ensureDir(uploadPath)
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)
  
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Only image files are allowed!'))
  }
}

// Upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
})

module.exports = {
  single: (fieldName) => upload.single(fieldName),
  multiple: (fieldName, maxCount = 10) => upload.array(fieldName, maxCount),
  fields: (fields) => upload.fields(fields)
}