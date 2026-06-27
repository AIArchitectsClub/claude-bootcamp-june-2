function formatDateDisplay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function formatTime(t) {
  const [h] = t.split(':')
  const hour = parseInt(h)
  const ampm = hour < 12 ? 'am' : 'pm'
  const display = hour % 12 === 0 ? 12 : hour % 12
  return `${display}:00 ${ampm}`
}

function isPast(dateStr, time) {
  const slotDate = new Date(`${dateStr}T${time}:00`)
  return slotDate < new Date()
}

export default function MyBookings({ bookings, onCancel }) {
  const sorted = [...bookings].sort((a, b) => {
    const da = new Date(`${a.date}T${a.time}:00`)
    const db = new Date(`${b.date}T${b.time}:00`)
    return da - db
  })

  const upcoming = sorted.filter((b) => !isPast(b.date, b.time))
  const past = sorted.filter((b) => isPast(b.date, b.time))

  if (bookings.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#6b7280', padding: '48px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎾</div>
        <div style={{ fontWeight: 600, fontSize: 16 }}>No bookings yet</div>
        <div style={{ fontSize: 14, marginTop: 4 }}>Select a court and time slot to get started.</div>
      </div>
    )
  }

  function BookingCard({ booking, past }) {
    return (
      <div
        style={{
          border: '1.5px solid #e5e7eb',
          borderRadius: 12,
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: past ? '#f9fafb' : '#fff',
          opacity: past ? 0.7 : 1,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, color: '#111827' }}>{booking.courtName}</div>
          <div style={{ color: '#374151', fontSize: 14, marginTop: 2 }}>
            {formatDateDisplay(booking.date)} · {formatTime(booking.time)}–{formatTime(booking.time.replace(/^\d+/, (h) => String(parseInt(h) + 1).padStart(2, '0')))}
          </div>
          <div style={{ color: '#6b7280', fontSize: 13, marginTop: 2 }}>
            {booking.playerName} · {booking.players} player{booking.players > 1 ? 's' : ''}
          </div>
        </div>
        {!past && (
          <button
            onClick={() => onCancel(booking.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1.5px solid #fca5a5',
              background: '#fff',
              color: '#dc2626',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 13,
              flexShrink: 0,
              marginLeft: 16,
            }}
          >
            Cancel
          </button>
        )}
        {past && (
          <span style={{ color: '#9ca3af', fontSize: 12, fontWeight: 600, flexShrink: 0, marginLeft: 16 }}>
            Completed
          </span>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {upcoming.length > 0 && (
        <div>
          <h3 style={{ margin: '0 0 12px', color: '#111827', fontSize: 16 }}>Upcoming ({upcoming.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcoming.map((b) => <BookingCard key={b.id} booking={b} past={false} />)}
          </div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <h3 style={{ margin: '0 0 12px', color: '#6b7280', fontSize: 16 }}>Past</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {past.map((b) => <BookingCard key={b.id} booking={b} past={true} />)}
          </div>
        </div>
      )}
    </div>
  )
}
