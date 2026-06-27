import 'dotenv/config'
import { getMigrations } from 'better-auth/db/migration'
import { auth } from '../auth.js'

async function main() {
  console.log('Checking Better Auth schema...')

  const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(auth.options)

  if (toBeCreated.length === 0 && toBeAdded.length === 0) {
    console.log('Nothing to migrate — database is already up to date.')
    return
  }

  if (toBeCreated.length) {
    console.log('Tables to create:', toBeCreated.map((t) => t.table).join(', '))
  }
  if (toBeAdded.length) {
    console.log('Columns to add:', toBeAdded.map((t) => t.table).join(', '))
  }

  await runMigrations()
  console.log('Better Auth migration complete.')
}

main().catch((err) => { console.error(err); process.exit(1) })
