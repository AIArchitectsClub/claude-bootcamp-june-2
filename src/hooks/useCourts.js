import { useState, useEffect } from 'react'
import { COURTS as FALLBACK_COURTS } from '../data/courts.js'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

export function useCourts() {
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/courts`, { credentials: 'include' })
      .then((r) => {
        if (!r.ok) throw new Error(`Server error ${r.status}`)
        return r.json()
      })
      .then((data) => {
        setCourts(data)
        setLoading(false)
      })
      .catch((err) => {
        console.warn('Could not fetch courts from API, using fallback data.', err.message)
        setCourts(FALLBACK_COURTS)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { courts, loading, error }
}
