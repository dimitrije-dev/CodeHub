import { TaskService } from '../services/taskService.js'
import { AchievementService } from '../services/achievementService.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const getTasks = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const tasks = await TaskService.getTasks(userId)
  res.json(tasks)
})

export const createTask = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const payload = normalizeTaskPayload(req.body)
  const task = await TaskService.createTask(userId, payload)
  const achievementResult = await AchievementService.checkAchievements(userId)

  res.status(201).json({
    task,
    newAchievements: achievementResult.newAchievements,
  })
})

export const updateTask = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const taskId = req.params.id
  const payload = normalizeTaskPayload(req.body)
  const task = await TaskService.updateTask(userId, taskId, payload)
  res.json(task)
})

export const deleteTask = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const taskId = req.params.id
  const task = await TaskService.deleteTask(userId, taskId)
  res.json(task)
})

function normalizeTaskPayload(payload) {
  if (!payload || typeof payload !== 'object') return {}

  const normalized = { ...payload }
  if (Object.prototype.hasOwnProperty.call(normalized, 'dueDate')) {
    normalized.due_date = normalized.dueDate || null
    delete normalized.dueDate
  }

  return normalized
}
