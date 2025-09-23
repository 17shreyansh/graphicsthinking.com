const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Initialize upload directories
const initUploadDirs = () => {
  const dirs = ['uploads/general', 'uploads/portfolio', 'uploads/services']
  dirs.forEach(dir => ensureDir(dir))
}

initUploadDirs()

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/general/'
    
    // Determine upload path based on route or query parameter
    const category = req.query.category || req.body.category || 'general'
    
    switch (category) {
      case 'portfolio':
        uploadPath = 'uploads/portfolio/'
        break
      case 'services':
        uploadPath = 'uploads/services/'
        break
      default:
        uploadPath = 'uploads/general/'
    }
    
    ensureDir(uploadPath)
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    // Clean filename and add timestamp
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(cleanName)
    const name = path.basename(cleanName, ext)
    cb(null, `${name}-${uniqueSuffix}${ext}`)
  }
})

// File filter with enhanced validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedMimes.includes(file.mimetype)
  
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error(`Invalid file type. Only ${allowedMimes.join(', ')} are allowed.`))
  }
}

// Upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: fileFilter
})

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' })
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({ message: 'Too many files. Maximum is 10 files.' })
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({ message: 'Unexpected field name.' })
      default:
        return res.status(400).json({ message: err.message })
    }
  }
  if (err) {
    return res.status(400).json({ message: err.message })
  }
  next()
}

module.exports = {
  single: upload.single('image'),
  multiple: upload.array('images', 10),
  fields: (fields) => upload.fields(fields),
  handleUploadError
}