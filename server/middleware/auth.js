import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/index.js'
import { unauthorized } from '../utils/errors.js'

export const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) return next(unauthorized('No token provided'))

    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    next(unauthorized('Invalid token'))
  }
}
