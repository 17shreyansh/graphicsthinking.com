import { API_BASE_URL } from './api'

class UploadService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // Upload single image
  async uploadSingle(file, category = 'general', onProgress = null) {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('category', category)

    try {
      const response = await fetch(`${this.baseURL}/upload/single?category=${category}`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Upload failed')
      }

      return {
        success: true,
        url: `${window.location.protocol}//${window.location.hostname}:5000${result.file.url}`,
        file: result.file
      }
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  // Upload multiple images
  async uploadMultiple(files, category = 'general', onProgress = null) {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('images', file)
    })
    formData.append('category', category)

    try {
      const response = await fetch(`${this.baseURL}/upload/multiple?category=${category}`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Upload failed')
      }

      return {
        success: true,
        files: result.files.map(file => ({
          ...file,
          url: `${window.location.protocol}//${window.location.hostname}:5000${file.url}`
        }))
      }
    } catch (error) {
      console.error('Multiple upload error:', error)
      throw error
    }
  }

  // Delete uploaded file
  async deleteFile(filePath) {
    try {
      const response = await fetch(`${this.baseURL}/upload/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ filePath })
      })

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Delete failed')
      }

      return result
    } catch (error) {
      console.error('Delete error:', error)
      throw error
    }
  }

  // Get list of uploaded files
  async getFileList(category = 'general') {
    try {
      const response = await fetch(`${this.baseURL}/upload/list?category=${category}`, {
        credentials: 'include'
      })

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch files')
      }

      return {
        success: true,
        files: result.files.map(file => ({
          ...file,
          fullUrl: `${window.location.protocol}//${window.location.hostname}:5000${file.url}`
        }))
      }
    } catch (error) {
      console.error('File list error:', error)
      throw error
    }
  }

  // Validate file before upload
  validateFile(file, options = {}) {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    } = options

    const errors = []

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`)
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1)
      errors.push(`File too large. Maximum size: ${maxSizeMB}MB`)
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Get file URL with proper domain
  getFileUrl(relativePath) {
    if (!relativePath) return ''
    
    // If already a full URL, return as is
    if (relativePath.startsWith('http')) {
      return relativePath
    }
    
    // If starts with /uploads, add domain
    if (relativePath.startsWith('/uploads')) {
      return `${window.location.protocol}//${window.location.hostname}:5000${relativePath}`
    }
    
    // Otherwise, assume it's a relative path and add /uploads prefix
    return `${window.location.protocol}//${window.location.hostname}:5000/uploads/${relativePath}`
  }

  // Format file size for display
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

export const uploadService = new UploadService()
export default uploadService