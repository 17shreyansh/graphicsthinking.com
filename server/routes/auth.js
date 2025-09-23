const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check credentials against environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
        return res.status(500).json({ message: 'Admin credentials not configured' });
    }

    if (username !== adminUsername) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // For a real application, you should use a securely hashed password.
    // For this implementation, we'll compare plain text passwords from .env
    // Note: This is not recommended for production environments.
    const isMatch = (password === adminPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: 'admin' // Static ID for the admin user
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.json({ message: "Login successful" });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/auth/logout
// @desc    Logout user
// @access  Private
router.get('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

// @route   GET /api/auth/check
// @desc    Check if user is authenticated
// @access  Private
router.get('/check', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        res.json({ authenticated: true });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;
