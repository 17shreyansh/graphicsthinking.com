const fs = require('fs')
const path = require('path')

// Test script to verify upload directories and permissions
const testUploadSystem = () => {
  console.log('🔍 Testing Upload System...\n')

  const uploadDir = path.join(__dirname, '..', 'uploads')
  const categories = ['general', 'portfolio', 'services']

  // Check main upload directory
  if (!fs.existsSync(uploadDir)) {
    console.log('❌ Main upload directory does not exist')
    console.log('Creating upload directory...')
    fs.mkdirSync(uploadDir, { recursive: true })
    console.log('✅ Upload directory created')
  } else {
    console.log('✅ Main upload directory exists')
  }

  // Check category directories
  categories.forEach(category => {
    const categoryDir = path.join(uploadDir, category)
    if (!fs.existsSync(categoryDir)) {
      console.log(`❌ ${category} directory does not exist`)
      console.log(`Creating ${category} directory...`)
      fs.mkdirSync(categoryDir, { recursive: true })
      console.log(`✅ ${category} directory created`)
    } else {
      console.log(`✅ ${category} directory exists`)
    }

    // Test write permissions
    const testFile = path.join(categoryDir, 'test.txt')
    try {
      fs.writeFileSync(testFile, 'test')
      fs.unlinkSync(testFile)
      console.log(`✅ ${category} directory is writable`)
    } catch (error) {
      console.log(`❌ ${category} directory is not writable:`, error.message)
    }
  })

  // Check existing files
  console.log('\n📁 Existing Files:')
  categories.forEach(category => {
    const categoryDir = path.join(uploadDir, category)
    try {
      const files = fs.readdirSync(categoryDir)
      console.log(`${category}: ${files.length} files`)
      if (files.length > 0) {
        files.slice(0, 3).forEach(file => {
          const filePath = path.join(categoryDir, file)
          const stats = fs.statSync(filePath)
          console.log(`  - ${file} (${(stats.size / 1024).toFixed(1)} KB)`)
        })
        if (files.length > 3) {
          console.log(`  ... and ${files.length - 3} more`)
        }
      }
    } catch (error) {
      console.log(`${category}: Error reading directory`)
    }
  })

  console.log('\n🎉 Upload system test completed!')
}

// Run the test
if (require.main === module) {
  testUploadSystem()
}

module.exports = testUploadSystem