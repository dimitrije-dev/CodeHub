import { AchievementService } from '../services/achievementService.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const getUserAchievements = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id
  const achievements = await AchievementService.getUserAchievements(userId)
  res.json(achievements)
})

export const checkAchievements = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id
  const result = await AchievementService.checkAchievements(userId)
  res.json(result)
})
