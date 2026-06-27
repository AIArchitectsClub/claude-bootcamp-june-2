import { TIME_SLOTS } from '../data/courts.js'

function formatTime(t) {
  const [h] = t.split(':')
  const hour = parseInt(h)
  const ampm = hour < 12 ? 'am' : 'pm'
  const display = hour % 12 === 0 ? 12 : hour % 12
  return `${display}:00 ${ampm}`
}

export default function TimeSlotGrid({ courtId, date, isSlotBooked, onBook }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
        gap: 10,
      }}
    >
      {TIME_SLOTS.map((time) => {
        const booked = isSlotBooked(courtId, date, time)
        return (
          <button
            key={time}
            disabled={booked}
            onClick={() => !booked && onBook(time)}
            style={{
              padding: '12px 8px',
              borderRadius: 8,
              border: booked ? '1.5px solid #e5e7eb' : '1.5px solid #16a34a',
              background: booked ? '#f9fafb' : '#f0fdf4',
              color: booked ? '#9ca3af' : '#15803d',
              fontWeight: 600,
              fontSize: 14,
              cursor: booked ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!booked) e.currentTarget.style.background = '#16a34a'
              if (!booked) e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              if (!booked) e.currentTarget.style.background = '#f0fdf4'
              if (!booked) e.currentTarget.style.color = '#15803d'
            }}
          >
            {booked ? (
              <>
                <div>{formatTime(time)}</div>
                <div style={{ fontSize: 11, marginTop: 2 }}>Booked</div>
              </>
            ) : (
              formatTime(time)
            )}
          </button>
        )
      })}
    </div>
  )
}
