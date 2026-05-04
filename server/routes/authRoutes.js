import { Router } from 'express'
import { login, register } from '../controllers/authController.js'
import { validate } from '../middleware/validate.js'
import { authRateLimiter } from '../middleware/security.js'
import { authLoginSchema, authRegisterSchema } from '../validation/schemas.js'

const router = Router()

router.post('/register', authRateLimiter, validate(authRegisterSchema), register)
router.post('/login', authRateLimiter, validate(authLoginSchema), login)

export default router
