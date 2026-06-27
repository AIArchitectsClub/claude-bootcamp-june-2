import { Router } from 'express'
import { sql } from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

// GET /api/bookings — public, returns all bookings for slot availability checks
// GET /api/bookings?mine=true — auth required, returns only the caller's bookings
router.get('/', async (req, res) => {
  const { mine } = req.query

  if (mine === 'true') {
    // Reuse requireAuth inline for this optional-auth case
    const { fromNodeHeaders } = await import('better-auth/node')
    const { auth } = await import('../auth.js')
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
    if (!session) return res.status(401).json({ error: 'You must be signed in to see your bookings.' })

    const rows = await sql`
      SELECT b.id,
             b.court_id    AS "courtId",
             c.name        AS "courtName",
             TO_CHAR(b.date, 'YYYY-MM-DD') AS date,
             b.time,
             b.player_name AS "playerName",
             b.players,
             b.user_id     AS "userId",
             b.created_at  AS "createdAt"
        FROM bookings b
        JOIN courts   c ON c.id = b.court_id
       WHERE b.user_id = ${session.user.id}
       ORDER BY b.date, b.time
    `
    return res.json(rows)
  }

  // Public: return just the fields needed for availability checking
  const rows = await sql`
    SELECT b.id,
           b.court_id    AS "courtId",
           TO_CHAR(b.date, 'YYYY-MM-DD') AS date,
           b.time
      FROM bookings b
     ORDER BY b.date, b.time
  `
  res.json(rows)
})

// POST /api/bookings — auth required
router.post('/', requireAuth, async (req, res) => {
  const { courtId, date, time, playerName, players } = req.body

  if (!courtId || !date || !time || !playerName || !players) {
    return res.status(400).json({ error: 'Missing required fields: courtId, date, time, playerName, players' })
  }

  try {
    const [booking] = await sql`
      INSERT INTO bookings (court_id, date, time, player_name, players, user_id)
      VALUES (${courtId}, ${date}::date, ${time}, ${playerName}, ${players}, ${req.user.id})
      RETURNING id,
                court_id    AS "courtId",
                TO_CHAR(date, 'YYYY-MM-DD') AS date,
                time,
                player_name AS "playerName",
                players,
                user_id     AS "userId",
                created_at  AS "createdAt"
    `
    const [court] = await sql`SELECT name FROM courts WHERE id = ${courtId}`
    res.status(201).json({ ...booking, courtName: court.name })
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'This time slot is already booked.' })
    }
    throw err
  }
})

// DELETE /api/bookings/:id — auth required, only owner can cancel
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params

  const [booking] = await sql`SELECT user_id FROM bookings WHERE id = ${id}::uuid`
  if (!booking) return res.status(404).json({ error: 'Booking not found.' })
  if (booking.user_id !== req.user.id) return res.status(403).json({ error: 'You can only cancel your own bookings.' })

  await sql`DELETE FROM bookings WHERE id = ${id}::uuid`
  res.json({ deleted: id })
})

export default router
