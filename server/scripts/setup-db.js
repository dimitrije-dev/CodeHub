import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Pool } from 'pg'
import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const initSqlPath = path.join(__dirname, '..', 'db', 'init.sql')

const pool = new Pool({
  user: process.env.PGUSER || 'codehub',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'codehub_db',
  password: process.env.PGPASSWORD || 'codehub_pass',
  port: Number(process.env.PGPORT || 5432),
})

async function setupDatabase() {
  try {
    console.log('Setting up database schema...')
    const initSql = await readFile(initSqlPath, 'utf-8')
    await pool.query(initSql)

    // Create demo user if it doesn't exist
    const demoUserResult = await pool.query(
      `SELECT id FROM users WHERE username = $1 OR email = $2 LIMIT 1`,
      ['demo', 'demo@example.com']
    )

    let demoUserId
    if (demoUserResult.rows.length === 0) {
      const bcrypt = await import('bcryptjs')
      const { hash } = bcrypt.default || bcrypt
      const hashedPassword = await hash('demo123', 10)
      
      const newUserResult = await pool.query(
        `INSERT INTO users (username, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id`,
        ['demo', 'demo@example.com', hashedPassword]
      )
      
      demoUserId = newUserResult.rows[0].id
      console.log('Created demo user')
    } else {
      demoUserId = demoUserResult.rows[0].id
    }

    // Backfill user_id for existing data
    await pool.query(`
      UPDATE snippets SET user_id = $1 WHERE user_id IS NULL
    `, [demoUserId])

    await pool.query(`
      UPDATE tasks SET user_id = $1 WHERE user_id IS NULL
    `, [demoUserId])

    await pool.query(`
      UPDATE focus_sessions SET user_id = $1 WHERE user_id IS NULL
    `, [demoUserId])

    console.log('Database setup completed successfully!')
    console.log('Demo user credentials:')
    console.log('Username: demo')
    console.log('Password: demo123')

  } catch (error) {
    console.error('Error setting up database:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

setupDatabase()
