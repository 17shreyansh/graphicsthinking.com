const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

// Image optimization utility
const optimizeImage = async (inputPath, outputPath, options = {}) => {
  try {
    const {
      width = null,
      height = null,
      quality = 80,
      format = 'jpeg'
    } = options

    let pipeline = sharp(inputPath)

    // Resize if dimensions provided
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
    }

    // Apply format and quality
    switch (format.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        pipeline = pipeline.jpeg({ quality, progressive: true })
        break
      case 'png':
        pipeline = pipeline.png({ quality, progressive: true })
        break
      case 'webp':
        pipeline = pipeline.webp({ quality })
        break
      default:
        pipeline = pipeline.jpeg({ quality, progressive: true })
    }

    await pipeline.toFile(outputPath)
    return true
  } catch (error) {
    console.error('Image optimization error:', error)
    return false
  }
}

// Generate thumbnail
const generateThumbnail = async (inputPath, outputPath, size = 300) => {
  try {
    await sharp(inputPath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 70, progressive: true })
      .toFile(outputPath)
    return true
  } catch (error) {
    console.error('Thumbnail generation error:', error)
    return false
  }
}

// Get image metadata
const getImageMetadata = async (imagePath) => {
  try {
    const metadata = await sharp(imagePath).metadata()
    const stats = fs.statSync(imagePath)
    
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: stats.size,
      density: metadata.density,
      hasAlpha: metadata.hasAlpha,
      channels: metadata.channels
    }
  } catch (error) {
    console.error('Metadata extraction error:', error)
    return null
  }
}

// Validate image file
const validateImage = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata()
    return {
      isValid: true,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format
    }
  } catch (error) {
    return {
      isValid: false,
      error: error.message
    }
  }
}

module.exports = {
  optimizeImage,
  generateThumbnail,
  getImageMetadata,
  validateImage
}