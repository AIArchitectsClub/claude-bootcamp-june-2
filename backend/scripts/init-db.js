import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// Thin helper so we keep the tagged-template style from the rest of the codebase
async function sql(strings, ...values) {
  let text = ''
  strings.forEach((s, i) => { text += s; if (i < values.length) text += `$${i + 1}` })
  const { rows } = await pool.query(text, values)
  return rows
}

const COURTS = [
  { id: 'court-1', name: 'Court 1 - Main',   surface: 'Hard',  indoor: false, description: 'Our flagship outdoor hard court with stadium seating.' },
  { id: 'court-2', name: 'Court 2 - Clay',   surface: 'Clay',  indoor: false, description: 'Classic red clay court, ideal for baseline play.' },
  { id: 'court-3', name: 'Court 3 - Indoor', surface: 'Hard',  indoor: true,  description: 'Covered hard court, playable in all weather conditions.' },
  { id: 'court-4', name: 'Court 4 - Grass',  surface: 'Grass', indoor: false, description: 'Premium grass court. Available May–September.' },
]

async function main() {
  console.log('Creating tables...')

  await pool.query(`
    CREATE TABLE IF NOT EXISTS courts (
      id          VARCHAR(50)  PRIMARY KEY,
      name        VARCHAR(255) NOT NULL,
      surface     VARCHAR(50)  NOT NULL,
      indoor      BOOLEAN      NOT NULL DEFAULT FALSE,
      description TEXT
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
      court_id    VARCHAR(50)  NOT NULL REFERENCES courts(id),
      date        DATE         NOT NULL,
      time        VARCHAR(5)   NOT NULL,
      player_name VARCHAR(255) NOT NULL,
      players     INTEGER      NOT NULL DEFAULT 2,
      user_id     TEXT,
      created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      UNIQUE (court_id, date, time)
    )
  `)

  // Add user_id if the table already existed without it
  await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_id TEXT`)

  console.log('Seeding courts...')
  for (const c of COURTS) {
    await pool.query(
      `INSERT INTO courts (id, name, surface, indoor, description)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE
         SET name = EXCLUDED.name,
             surface = EXCLUDED.surface,
             indoor = EXCLUDED.indoor,
             description = EXCLUDED.description`,
      [c.id, c.name, c.surface, c.indoor, c.description]
    )
  }

  console.log('Done. Courts and bookings tables are ready.')
  await pool.end()
}

main().catch((err) => { console.error(err); process.exit(1) })
