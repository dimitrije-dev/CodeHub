import { SnippetService } from '../services/snippetService.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const listSnippets = asyncHandler(async (req, res) => {
  const { q } = req.query
  const rows = await SnippetService.getAll(req.user.id, q || null)
  res.json(rows)
})

export const createSnippet = asyncHandler(async (req, res) => {
  const row = await SnippetService.create(req.user.id, req.body || {})
  res.status(201).json(row)
})

export const updateSnippet = asyncHandler(async (req, res) => {
  const row = await SnippetService.update(req.user.id, req.params.id, req.body || {})
  res.json(row)
})

export const deleteSnippet = asyncHandler(async (req, res) => {
  await SnippetService.delete(req.user.id, req.params.id)
  res.status(204).end()
})
