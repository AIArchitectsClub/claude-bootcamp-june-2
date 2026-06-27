import { betterAuth } from 'better-auth'
import pg from 'pg'

const { Pool } = pg

const trustedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
]
if (process.env.FRONTEND_URL) trustedOrigins.push(process.env.FRONTEND_URL)

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  emailAndPassword: { enabled: true },
  trustedOrigins,
})
