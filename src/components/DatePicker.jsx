function formatDate(d) {
  return d.toISOString().slice(0, 10)
}

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function displayDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function DatePicker({ selectedDate, onSelectDate }) {
  const today = new Date()
  const days = Array.from({ length: 14 }, (_, i) => formatDate(addDays(today, i)))

  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
      {days.map((d) => {
        const isSelected = d === selectedDate
        const isToday = d === formatDate(today)
        return (
          <button
            key={d}
            onClick={() => onSelectDate(d)}
            style={{
              flexShrink: 0,
              padding: '10px 14px',
              borderRadius: 10,
              border: isSelected ? '2px solid #16a34a' : '2px solid #e5e7eb',
              background: isSelected ? '#16a34a' : '#fff',
              color: isSelected ? '#fff' : '#111827',
              cursor: 'pointer',
              fontWeight: isToday ? 700 : 400,
              fontSize: 13,
              transition: 'all 0.15s',
              minWidth: 72,
              textAlign: 'center',
            }}
          >
            {displayDate(d)}
          </button>
        )
      })}
    </div>
  )
}
