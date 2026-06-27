import { useState, useEffect, useCallback } from 'react'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

async function apiFetch(path, options) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...options })
  const body = await res.json()
  if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`)
  return body
}

export function useBookings() {
  // allBookings: {id, courtId, date, time} — used for slot availability (public)
  const [allBookings, setAllBookings] = useState([])
  // myBookings: full booking objects for the current user
  const [myBookings, setMyBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  function fetchAll() {
    return fetch(`${API_BASE}/api/bookings`, { credentials: 'include' })
      .then((r) => { if (!r.ok) throw new Error(`Server error ${r.status}`); return r.json() })
      .then(setAllBookings)
  }

  function fetchMine() {
    return fetch(`${API_BASE}/api/bookings?mine=true`, { credentials: 'include' })
      .then((r) => { if (!r.ok) throw new Error(`Server error ${r.status}`); return r.json() })
      .then(setMyBookings)
  }

  useEffect(() => {
    Promise.all([fetchAll(), fetchMine()])
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const addBooking = useCallback(async (booking) => {
    // Optimistic: mark slot as taken immediately
    const tempId = '__temp__' + Date.now()
    const optimistic = { id: tempId, courtId: booking.courtId, date: booking.date, time: booking.time }
    setAllBookings((prev) => [...prev, optimistic])

    try {
      const created = await apiFetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      })
      setAllBookings((prev) => prev.map((b) => (b.id === tempId ? { id: created.id, courtId: created.courtId, date: created.date, time: created.time } : b)))
      setMyBookings((prev) => [...prev, created])
      return created
    } catch (err) {
      setAllBookings((prev) => prev.filter((b) => b.id !== tempId))
      throw err
    }
  }, [])

  const cancelBooking = useCallback(async (bookingId) => {
    const snapshot = myBookings.find((b) => b.id === bookingId)
    setAllBookings((prev) => prev.filter((b) => b.id !== bookingId))
    setMyBookings((prev) => prev.filter((b) => b.id !== bookingId))

    try {
      await apiFetch(`/api/bookings/${bookingId}`, { method: 'DELETE' })
    } catch (err) {
      if (snapshot) {
        setMyBookings((prev) => [...prev, snapshot])
        setAllBookings((prev) => [...prev, { id: snapshot.id, courtId: snapshot.courtId, date: snapshot.date, time: snapshot.time }])
      }
      throw err
    }
  }, [myBookings])

  const isSlotBooked = useCallback(
    (courtId, date, time) =>
      allBookings.some((b) => b.courtId === courtId && b.date === date && b.time === time),
    [allBookings],
  )

  return { myBookings, loading, error, addBooking, cancelBooking, isSlotBooked }
}
