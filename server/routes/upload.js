const express = require('express')
const { single, multiple, handleUploadError } = require('../middleware/upload')
const { protect } = require('../middleware/auth')
const path = require('path')
const fs = require('fs')
const router = express.Router()

// Apply protection to all upload routes
router.use(protect)

// Single file upload
router.post('/single', (req, res, next) => {
  single(req, res, (err) => {
    if (err) {
      return handleUploadError(err, req, res, next)
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          message: 'No file uploaded' 
        })
      }
      
      const relativePath = req.file.path.replace(/\\/g, '/').replace('uploads/', '')
      const fileUrl = `/uploads/${relativePath}`
      
      res.json({ 
        success: true,
        message: 'File uploaded successfully',
        file: {
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          url: fileUrl,
          fullPath: req.file.path.replace(/\\/g, '/')
        }
      })
    } catch (error) {
      console.error('Upload error:', error)
      res.status(500).json({ 
        success: false,
        message: error.message 
      })
    }
  })
})

// Multiple files upload
router.post('/multiple', (req, res, next) => {
  multiple(req, res, (err) => {
    if (err) {
      return handleUploadError(err, req, res, next)
    }
    
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: 'No files uploaded' 
        })
      }
      
      const files = req.files.map(file => {
        const relativePath = file.path.replace(/\\/g, '/').replace('uploads/', '')
        return {
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: `/uploads/${relativePath}`,
          fullPath: file.path.replace(/\\/g, '/')
        }
      })
      
      res.json({ 
        success: true,
        message: `${files.length} files uploaded successfully`,
        files: files
      })
    } catch (error) {
      console.error('Upload error:', error)
      res.status(500).json({ 
        success: false,
        message: error.message 
      })
    }
  })
})

// Delete uploaded file
router.delete('/delete', (req, res) => {
  try {
    const { filePath } = req.body
    
    if (!filePath) {
      return res.status(400).json({ 
        success: false,
        message: 'File path is required' 
      })
    }
    
    const fullPath = path.join(__dirname, '..', filePath.replace('/uploads/', 'uploads/'))
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
      res.json({ 
        success: true,
        message: 'File deleted successfully' 
      })
    } else {
      res.status(404).json({ 
        success: false,
        message: 'File not found' 
      })
    }
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ 
      success: false,
      message: error.message 
    })
  }
})

// Get uploaded files list
router.get('/list', (req, res) => {
  try {
    const { category = 'general' } = req.query
    const uploadDir = path.join(__dirname, '..', 'uploads', category)
    
    if (!fs.existsSync(uploadDir)) {
      return res.json({ 
        success: true,
        files: [] 
      })
    }
    
    const files = fs.readdirSync(uploadDir)
      .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file))
      .map(file => {
        const filePath = path.join(uploadDir, file)
        const stats = fs.statSync(filePath)
        return {
          filename: file,
          url: `/uploads/${category}/${file}`,
          size: stats.size,
          created: stats.birthtime
        }
      })
      .sort((a, b) => new Date(b.created) - new Date(a.created))
    
    res.json({ 
      success: true,
      files: files 
    })
  } catch (error) {
    console.error('List files error:', error)
    res.status(500).json({ 
      success: false,
      message: error.message 
    })
  }
})

module.exports = router