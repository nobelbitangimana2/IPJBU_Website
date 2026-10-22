'use strict'

const express  = require('express')
const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const Admin    = require('../models/Admin')

const router = express.Router()

/**
 * POST /api/auth/login
 * Body: { username, password }
 * Returns: { token, user: { username } }
 */
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' })
    }

    const admin = await Admin.findOne({ username: username.toLowerCase().trim() })
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials.' })
    }

    const match = await bcrypt.compare(password, admin.passwordHash)
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials.' })
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({ token, user: { username: admin.username } })
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/auth/logout
 * JWT is stateless — client simply discards the token.
 * This endpoint exists so the frontend can call it consistently.
 */
router.post('/logout', (_req, res) => {
  res.json({ message: 'Logged out.' })
})

module.exports = router
