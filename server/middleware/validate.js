import { badRequest } from '../utils/errors.js'

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const payload = req[source] ?? {}
    const parsed = schema.safeParse(payload)

    if (!parsed.success) {
      const details = parsed.error.issues.map((issue) => ({
        path: issue.path.join('.') || source,
        message: issue.message,
      }))
      return next(badRequest('Validation failed', details))
    }

    req[source] = parsed.data
    return next()
  }
}
