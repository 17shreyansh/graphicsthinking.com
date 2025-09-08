const express = require('express')
const nodemailer = require('nodemailer')
const router = express.Router()

// Contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    // Create transporter (configure with your email service)
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    // Email options
    const mailOptions = {
      from: email,
      to: process.env.CONTACT_EMAIL || 'hello@graphicsthinking.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    }

    // Send email
    await transporter.sendMail(mailOptions)
    res.json({ message: 'Message sent successfully' })
  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ message: 'Failed to send message' })
  }
})

module.exports = router