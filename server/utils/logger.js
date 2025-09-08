const fs = require('fs')
const path = require('path')

const logDir = path.join(__dirname, '../logs')
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const logger = {
  info: (message) => {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] INFO: ${message}\n`
    console.log(logMessage.trim())
    fs.appendFileSync(path.join(logDir, 'app.log'), logMessage)
  },
  error: (message, error = null) => {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] ERROR: ${message}${error ? ` - ${error.stack}` : ''}\n`
    console.error(logMessage.trim())
    fs.appendFileSync(path.join(logDir, 'error.log'), logMessage)
  }
}

module.exports = logger