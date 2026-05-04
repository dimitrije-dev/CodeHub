import * as FocusService from '../services/focusService.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const createFocusSession = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { minutes, date } = req.body
  const focusSession = await FocusService.createFocusSession(userId, minutes, date)
  res.status(201).json(focusSession)
})

export const getFocusSessions = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const focusSessions = await FocusService.getFocusSessions(userId)
  res.json(focusSessions)
})
