const express = require('express')
const { single, multiple } = require('../middleware/upload')
const router = express.Router()

// Single file upload
router.post('/single', single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }
    
    const fileUrl = `/uploads/${req.file.filename}`
    res.json({ 
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Multiple files upload
router.post('/multiple', multiple('images'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' })
    }
    
    const fileUrls = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename
    }))
    
    res.json({ 
      message: 'Files uploaded successfully',
      files: fileUrls
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router