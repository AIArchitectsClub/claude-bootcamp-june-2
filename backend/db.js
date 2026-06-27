import pg from 'pg'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set. Copy backend/.env.example to backend/.env and fill in your Neon connection string.')
}

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// Tagged-template helper: sql`SELECT * FROM foo WHERE id = ${id}`
export async function sql(strings, ...values) {
  let text = ''
  strings.forEach((s, i) => { text += s; if (i < values.length) text += `$${i + 1}` })
  const { rows } = await pool.query(text, values)
  return rows
}
