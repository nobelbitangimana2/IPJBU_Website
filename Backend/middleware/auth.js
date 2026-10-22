'use strict'

const jwt = require('jsonwebtoken')

/**
 * Express middleware — verifies JWT sent as Bearer token in Authorization header.
 * Attaches decoded payload to req.admin.
 * Protects all /api/admin/* routes.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' })
  }

  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }
}

module.exports = requireAuth
