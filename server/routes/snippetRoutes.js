import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { listSnippets, createSnippet, updateSnippet, deleteSnippet } from '../controllers/snippetController.js'
import { validate } from '../middleware/validate.js'
import { idParamSchema, snippetCreateSchema, snippetQuerySchema, snippetUpdateSchema } from '../validation/schemas.js'

const router = Router()

router.get('/', auth, validate(snippetQuerySchema, 'query'), listSnippets)
router.post('/', auth, validate(snippetCreateSchema), createSnippet)
router.put('/:id', auth, validate(idParamSchema, 'params'), validate(snippetUpdateSchema), updateSnippet)
router.delete('/:id', auth, validate(idParamSchema, 'params'), deleteSnippet)

export default router
