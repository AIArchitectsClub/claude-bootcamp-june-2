import { useState } from 'react'

function formatDateDisplay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(t) {
  const [h] = t.split(':')
  const hour = parseInt(h)
  const ampm = hour < 12 ? 'am' : 'pm'
  const display = hour % 12 === 0 ? 12 : hour % 12
  return `${display}:00 ${ampm} – ${(display % 12) + 1}:00 ${hour + 1 >= 12 ? 'pm' : ampm}`
}

export default function BookingModal({ court, date, time, error, defaultName = '', onConfirm, onClose }) {
  const [name, setName] = useState(defaultName)
  const [players, setPlayers] = useState('2')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await onConfirm({ courtId: court.id, courtName: court.name, date, time, playerName: name.trim(), players: parseInt(players) })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 440, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 4px', color: '#111827', fontSize: 20 }}>Confirm Booking</h2>
        <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>Fill in your details to complete the reservation.</div>

        <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '14px 16px', marginBottom: 24, border: '1px solid #bbf7d0' }}>
          <div style={{ fontWeight: 700, color: '#111827' }}>{court.name}</div>
          <div style={{ color: '#374151', fontSize: 14, marginTop: 4 }}>{formatDateDisplay(date)}</div>
          <div style={{ color: '#374151', fontSize: 14 }}>{formatTime(time)}</div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#dc2626', fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>Your Name *</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Smith"
              required
              style={{
                padding: '10px 14px', borderRadius: 8, border: '1.5px solid #d1d5db',
                fontSize: 15, outline: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#16a34a')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>Number of Players</span>
            <select
              value={players}
              onChange={(e) => setPlayers(e.target.value)}
              style={{
                padding: '10px 14px', borderRadius: 8, border: '1.5px solid #d1d5db',
                fontSize: 15, background: '#fff',
              }}
            >
              <option value="1">1 player (Singles practice)</option>
              <option value="2">2 players (Singles)</option>
              <option value="3">3 players (Rotating)</option>
              <option value="4">4 players (Doubles)</option>
            </select>
          </label>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '12px', borderRadius: 8, border: '1.5px solid #d1d5db',
                background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 15, color: '#374151',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 2, padding: '12px', borderRadius: 8, border: 'none',
                background: submitting ? '#86efac' : '#16a34a', color: '#fff', fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 15,
              }}
            >
              {submitting ? 'Booking…' : 'Book Court'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
