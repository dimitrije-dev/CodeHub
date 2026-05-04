import { pool } from '../config/database.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/index.js'
import { badRequest, conflict, unauthorized } from '../utils/errors.js'

export class AuthService {
  static async register(username, email, password) {
    if (!username || !email || !password) {
      throw badRequest('All fields are required')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const query = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at
    `
    
    try {
      const result = await pool.query(query, [username, email, hashedPassword])
      return result.rows[0]
    } catch (error) {
      if (error.code === '23505') {
        throw conflict('Email or username already exists')
      }
      throw error
    }
  }

  static async login(email, password) {
    if (!email || !password) {
      throw badRequest('Email and password are required')
    }

    const query = `
      SELECT id, username, email, password_hash
      FROM users
      WHERE email = $1
    `
    
    const result = await pool.query(query, [email])
    
    if (result.rows.length === 0) throw unauthorized('Invalid credentials')
    
    const user = result.rows[0]
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    
    if (!isValidPassword) throw unauthorized('Invalid credentials')
    
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    }
  }
}
