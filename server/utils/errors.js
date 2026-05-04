export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.details = details
  }
}

export function isAppError(error) {
  return error instanceof AppError
}

export function badRequest(message, details = null) {
  return new AppError(message, 400, details)
}

export function unauthorized(message = 'Unauthorized') {
  return new AppError(message, 401)
}

export function notFound(message = 'Resource not found') {
  return new AppError(message, 404)
}

export function conflict(message, details = null) {
  return new AppError(message, 409, details)
}
