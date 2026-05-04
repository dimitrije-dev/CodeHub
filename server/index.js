import 'dotenv/config'
import express from 'express'
import { pool } from './config/database.js'
import { corsMiddleware, helmetMiddleware } from './middleware/security.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

// Routes
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import snippetRoutes from './routes/snippetRoutes.js'
import metricRoutes from './routes/metricRoutes.js'
import focusRoutes from './routes/focusRoutes.js'
import achievementRoutes from './routes/achievementRoutes.js'

const app = express()

// Middleware
app.use(helmetMiddleware)
app.use(corsMiddleware)
app.use(express.json({ limit: '1mb' }))

// Health check
app.get('/health', async (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() })
})

app.get('/health/db', async (req, res, next) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true, db: 'up', timestamp: new Date().toISOString() })
  } catch (error) {
    next(error)
  }
})

// API Routes
app.use('/api', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/snippets', snippetRoutes)
app.use('/api/metrics', metricRoutes)
app.use('/api/focus-sessions', focusRoutes)
app.use('/api/achievements', achievementRoutes)

// 404 handler
app.use(notFoundHandler)
app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`🚀 API listening on http://localhost:${port}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
})
