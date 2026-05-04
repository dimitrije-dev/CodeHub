import { AppError, isAppError } from '../utils/errors.js'

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Not found',
    path: req.originalUrl,
  })
}

export function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  const normalized = normalizeError(error)

  if (normalized.statusCode >= 500) {
    console.error('[API ERROR]', {
      method: req.method,
      path: req.originalUrl,
      statusCode: normalized.statusCode,
      message: normalized.message,
      stack: normalized.stack,
    })
  }

  res.status(normalized.statusCode).json({
    error: normalized.message,
    ...(normalized.details ? { details: normalized.details } : {}),
  })
}

function normalizeError(error) {
  if (isAppError(error)) return error

  if (error?.name === 'JsonWebTokenError') {
    return new AppError('Invalid token', 401)
  }

  if (error?.name === 'TokenExpiredError') {
    return new AppError('Token expired', 401)
  }

  if (error?.code === '23505') {
    return new AppError('Resource already exists', 409)
  }

  if (error?.code === '22P02') {
    return new AppError('Invalid identifier format', 400)
  }

  if (error?.message === 'Not allowed by CORS') {
    return new AppError('CORS origin is not allowed', 403)
  }

  return new AppError('Internal server error', 500)
}
