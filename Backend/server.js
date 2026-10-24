'use strict'

require('dotenv').config()
const express    = require('express')
const mongoose   = require('mongoose')
const cors       = require('cors')
const path       = require('path')

const authRoutes     = require('./routes/auth')
const mediaRoutes    = require('./routes/media')
const updatesRoutes  = require('./routes/updates')
const contentRoutes  = require('./routes/content')
const contactRoutes  = require('./routes/contact')
const productsRoutes = require('./routes/products')
const teamRoutes     = require('./routes/team')
const categoriesRoutes = require('./routes/categories')
const Category       = require('./models/Category')
const Update         = require('./models/Update')

const DEFAULT_CATEGORIES = [
  'agriculture', 'formation', 'partenariats', 'communauté', 'infrastructure', 'général',
]

function categorySlug(value) {
  return value.toLowerCase().trim()
    .replace(/[^a-z0-9\u00c0-\u024f]+/g, '-').replace(/^-|-$/g, '')
}

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true)

    const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
    if (process.env.NODE_ENV !== 'production') {
      allowedOrigins.push('http://localhost:5173', 'http://localhost:4173')
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`))
    }
  },
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files as static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/auth',    authRoutes)
app.use('/api',         mediaRoutes)    // GET /api/media (public) + /api/admin/media
app.use('/api',         updatesRoutes)  // GET /api/updates + /api/admin/updates
app.use('/api',         contentRoutes)  // GET /api/content + /api/admin/content
app.use('/api',         contactRoutes)  // GET /api/contact + /api/admin/contact
app.use('/api',         productsRoutes) // GET /api/products + /api/admin/products
app.use('/api',         teamRoutes)     // GET /api/team + /api/admin/team
app.use('/api',         categoriesRoutes) // GET /api/categories + /api/admin/categories

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// ── 404 handler ────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }))

// ── Global error handler ───────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

// ── Connect to MongoDB then start ──────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✓ MongoDB connected')
    try {
      const initialized = await Promise.all([
        ...DEFAULT_CATEGORIES.map((name) => Category.updateOne(
          { slug: categorySlug(name) }, { $setOnInsert: { name, slug: categorySlug(name) } }, { upsert: true }
        )),
        Update.distinct('category'),
      ])
      const legacyCategories = initialized[initialized.length - 1]
      const defaults = new Set(DEFAULT_CATEGORIES.map(categorySlug))
      for (const value of legacyCategories.filter((item) => typeof item === 'string' && item.trim())) {
        const slug = categorySlug(value)
        if (slug && !defaults.has(slug)) {
          await Category.updateOne({ slug }, { $setOnInsert: { name: value, slug } }, { upsert: true })
        }
      }
    } catch (err) {
      console.error('✗ Category initialization failed:', err.message)
      process.exit(1)
    }
    app.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('✗ MongoDB connection failed:', err.message)
    process.exit(1)
  })
