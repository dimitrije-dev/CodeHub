import { z } from 'zod'

const uuidParam = z.object({
  id: z.string().uuid('Invalid id format'),
})

const taskStatus = z.enum(['todo', 'doing', 'done'])
const taskPriority = z.enum(['low', 'medium', 'high'])
const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD')

export const authRegisterSchema = z.object({
  username: z.string().trim().min(3).max(50),
  email: z.string().trim().email().max(100),
  password: z.string().min(6).max(72),
}).strict()

export const authLoginSchema = z.object({
  email: z.string().trim().email().max(100),
  password: z.string().min(1).max(72),
}).strict()

export const taskCreateSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(5000).optional().default(''),
  status: taskStatus.optional().default('todo'),
  priority: taskPriority.optional().default('medium'),
  due_date: dateOnly.nullable().optional(),
  dueDate: dateOnly.optional(),
}).strict()

export const taskUpdateSchema = z.object({
  title: z.string().trim().min(1).max(255).optional(),
  description: z.string().trim().max(5000).optional(),
  status: taskStatus.optional(),
  priority: taskPriority.optional(),
  due_date: dateOnly.nullable().optional(),
  dueDate: dateOnly.nullable().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field is required for update',
})

export const snippetCreateSchema = z.object({
  title: z.string().trim().min(1).max(255).optional().default('Snippet'),
  code: z.string().max(20000).optional().default(''),
  language: z.string().trim().min(1).max(50).optional().default('javascript'),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).optional().default([]),
}).strict()

export const snippetUpdateSchema = z.object({
  title: z.string().trim().min(1).max(255).optional(),
  code: z.string().max(20000).optional(),
  language: z.string().trim().min(1).max(50).optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
}).strict().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field is required for update',
})

export const snippetQuerySchema = z.object({
  q: z.string().trim().max(150).optional(),
})

export const focusCreateSchema = z.object({
  minutes: z.coerce.number().int().min(1).max(300),
  date: z.string().datetime().optional(),
}).strict()

export const velocityQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(90).optional().default(7),
})

export const idParamSchema = uuidParam
