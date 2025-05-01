import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()
console.log('ENV:', process.env.PGUSER)

export const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432'),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
})
pool.query('SELECT version()', (err, res) => {
  if (err) {
    console.error('Erreur lors de la récupération de la version :', err)
  } else {
    console.log('Version PostgreSQL:', res.rows[0].version)
  }
})
