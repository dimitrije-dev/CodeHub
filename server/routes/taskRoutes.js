import express from 'express'
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js'
import { auth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { idParamSchema, taskCreateSchema, taskUpdateSchema } from '../validation/schemas.js'

const router = express.Router()

// All routes require authentication
router.use(auth)

router.get('/', getTasks)
router.post('/', validate(taskCreateSchema), createTask)
router.put('/:id', validate(idParamSchema, 'params'), validate(taskUpdateSchema), updateTask)
router.delete('/:id', validate(idParamSchema, 'params'), deleteTask)

export default router
