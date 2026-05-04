import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { velocity, focus } from '../controllers/metricController.js'
import { validate } from '../middleware/validate.js'
import { velocityQuerySchema } from '../validation/schemas.js'

const router = Router()
router.get('/velocity', auth, validate(velocityQuerySchema, 'query'), velocity)
router.get('/focus', auth, focus)
export default router
