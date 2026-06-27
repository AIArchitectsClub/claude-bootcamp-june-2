import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.js'
import courtsRouter from './routes/courts.js'
import bookingsRouter from './routes/bookings.js'

const app = express()
const PORT = process.env.PORT ?? 3001

// Accept localhost (dev) + the deployed frontend URL (prod)
const allowedOrigins = [/^http:\/\/localhost(:\d+)?$/]
if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL)

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))

// Better Auth handler MUST come before express.json()
app.all('/api/auth/*', toNodeHandler(auth))

app.use(express.json())

app.use('/api/courts', courtsRouter)
app.use('/api/bookings', bookingsRouter)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
