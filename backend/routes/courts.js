import { Router } from 'express'
import { sql } from '../db.js'

const router = Router()

router.get('/', async (_req, res) => {
  const rows = await sql`SELECT id, name, surface, indoor, description FROM courts ORDER BY id`
  res.json(rows)
})

export default router
