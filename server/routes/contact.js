const express = require('express')
const nodemailer = require('nodemailer')
const Contact = require('../models/Contact')
const router = express.Router()

// Get all contact messages (admin)
router.get('/', async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query
    const query = {}
    
    if (status) {
      query.status = status
    }
    
    const skip = (page - 1) * limit
    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
    
    const total = await Contact.countDocuments(query)
    
    res.json({
      messages,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + messages.length < total
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    // Save to database
    const contactMessage = new Contact({ name, email, subject, message })
    await contactMessage.save()

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
      to: process.env.CONTACT_EMAIL || 'devsaxena285@gmail.com',
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

// Update contact message status
router.put('/:id', async (req, res) => {
  try {
    const { status, replyMessage } = req.body
    const updateData = { status }
    
    if (replyMessage) {
      updateData.replyMessage = replyMessage
      updateData.replied = true
      updateData.repliedAt = new Date()
    }
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' })
    }
    
    res.json(contact)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete contact message
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' })
    }
    res.json({ message: 'Contact message deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router