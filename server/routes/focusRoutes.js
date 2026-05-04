import { Router } from 'express'
import { createFocusSession, getFocusSessions } from '../controllers/focusController.js'
import { auth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { focusCreateSchema } from '../validation/schemas.js'

const router = Router()

router.post('/', auth, validate(focusCreateSchema), createFocusSession)
router.get('/', auth, getFocusSessions)

export default router
