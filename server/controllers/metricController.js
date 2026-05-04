import { MetricService } from '../services/metricService.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const velocity = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const days = req.query.days || 7
  const data = await MetricService.velocity(userId, days)
  res.json(data)
})

export const focus = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const data = await MetricService.focus(userId)
  res.json(data)
})
