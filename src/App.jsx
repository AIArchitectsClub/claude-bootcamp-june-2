import { useState, useEffect } from 'react'
import { useSession } from './lib/authClient.js'
import { authClient } from './lib/authClient.js'
import { useCourts } from './hooks/useCourts.js'
import { useBookings } from './hooks/useBookings.js'
import CourtCard from './components/CourtCard.jsx'
import DatePicker from './components/DatePicker.jsx'
import TimeSlotGrid from './components/TimeSlotGrid.jsx'
import BookingModal from './components/BookingModal.jsx'
import MyBookings from './components/MyBookings.jsx'
import AuthPage from './components/AuthPage.jsx'

function formatDate(d) {
  return d.toISOString().slice(0, 10)
}

export default function App() {
  const { data: session, isPending: sessionLoading } = useSession()

  // Show auth page while session is loading or user is not signed in
  if (sessionLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ color: '#6b7280' }}>Loading…</div>
      </div>
    )
  }

  if (!session) return <AuthPage />

  return <BookingApp session={session} />
}

function BookingApp({ session }) {
  const [tab, setTab] = useState('book')
  const [selectedCourt, setSelectedCourt] = useState(null)
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))
  const [pendingSlot, setPendingSlot] = useState(null)
  const [bookingError, setBookingError] = useState(null)

  const { courts, loading: courtsLoading, error: courtsError } = useCourts()
  const { myBookings, loading: bookingsLoading, error: bookingsError, addBooking, cancelBooking, isSlotBooked } = useBookings()

  useEffect(() => {
    if (courts.length && !selectedCourt) setSelectedCourt(courts[0])
  }, [courts, selectedCourt])

  async function handleConfirm(booking) {
    setBookingError(null)
    try {
      await addBooking(booking)
      setPendingSlot(null)
    } catch (err) {
      setBookingError(err.message)
    }
  }

  async function handleCancel(id) {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await cancelBooking(id)
    } catch (err) {
      alert('Could not cancel: ' + err.message)
    }
  }

  async function handleSignOut() {
    await authClient.signOut()
  }

  const loading = courtsLoading || bookingsLoading
  const apiError = courtsError || bookingsError

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28 }}>🎾</span>
            <span style={{ fontWeight: 800, fontSize: 20, color: '#111827' }}>TennisCourt</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', borderRadius: 10, padding: 4 }}>
              {['book', 'mybookings'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: '8px 18px', borderRadius: 8, border: 'none',
                    background: tab === t ? '#fff' : 'transparent',
                    fontWeight: 600, fontSize: 14, cursor: 'pointer',
                    color: tab === t ? '#111827' : '#6b7280',
                    boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {t === 'book' ? 'Book a Court' : `My Bookings${myBookings.length ? ` (${myBookings.length})` : ''}`}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 12, borderLeft: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{session.user.name}</span>
              <button
                onClick={handleSignOut}
                style={{
                  padding: '6px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb',
                  background: '#fff', fontSize: 13, fontWeight: 600, color: '#6b7280', cursor: 'pointer',
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {apiError && (
        <div style={{ background: '#fef3c7', borderBottom: '1px solid #fcd34d', padding: '10px 24px', textAlign: 'center', fontSize: 14, color: '#92400e' }}>
          Backend connection issue — some features may not work correctly.
        </div>
      )}

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>Loading…</div>
        ) : tab === 'book' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <section>
              <h2 style={{ margin: '0 0 16px', color: '#111827', fontSize: 18, fontWeight: 700 }}>Select a Court</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {courts.map((c) => (
                  <CourtCard key={c.id} court={c} selected={selectedCourt?.id === c.id} onClick={setSelectedCourt} />
                ))}
              </div>
            </section>

            <section>
              <h2 style={{ margin: '0 0 16px', color: '#111827', fontSize: 18, fontWeight: 700 }}>Pick a Date</h2>
              <DatePicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            </section>

            {selectedCourt && (
              <section>
                <h2 style={{ margin: '0 0 16px', color: '#111827', fontSize: 18, fontWeight: 700 }}>
                  Available Times — {selectedCourt.name}
                </h2>
                <TimeSlotGrid
                  courtId={selectedCourt.id}
                  date={selectedDate}
                  isSlotBooked={isSlotBooked}
                  onBook={(time) => { setBookingError(null); setPendingSlot({ time }) }}
                />
              </section>
            )}
          </div>
        ) : (
          <div>
            <h2 style={{ margin: '0 0 24px', color: '#111827', fontSize: 18, fontWeight: 700 }}>My Bookings</h2>
            <MyBookings bookings={myBookings} onCancel={handleCancel} />
          </div>
        )}
      </main>

      {pendingSlot && selectedCourt && (
        <BookingModal
          court={selectedCourt}
          date={selectedDate}
          time={pendingSlot.time}
          defaultName={session.user.name}
          error={bookingError}
          onConfirm={handleConfirm}
          onClose={() => { setPendingSlot(null); setBookingError(null) }}
        />
      )}
    </div>
  )
}
