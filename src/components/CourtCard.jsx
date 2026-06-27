export default function CourtCard({ court, selected, onClick }) {
  const surfaceColors = {
    Hard: '#2563eb',
    Clay: '#b45309',
    Grass: '#16a34a',
  }
  const color = surfaceColors[court.surface] ?? '#6b7280'

  return (
    <button
      onClick={() => onClick(court)}
      style={{
        border: selected ? `2px solid ${color}` : '2px solid #e5e7eb',
        borderRadius: 12,
        padding: '16px 20px',
        background: selected ? `${color}10` : '#fff',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'all 0.15s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>{court.name}</div>
          <div style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>{court.description}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 12 }}>
          <span
            style={{
              background: `${color}20`,
              color,
              borderRadius: 20,
              padding: '2px 10px',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {court.surface}
          </span>
          {court.indoor && (
            <span
              style={{
                background: '#f3f4f6',
                color: '#374151',
                borderRadius: 20,
                padding: '2px 10px',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Indoor
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
