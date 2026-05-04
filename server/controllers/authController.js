import { AuthService } from '../services/authService.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body
  const user = await AuthService.register(username, email, password)
  res.status(201).json({ message: 'User created successfully', user })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const result = await AuthService.login(email, password)
  res.json(result)
})
