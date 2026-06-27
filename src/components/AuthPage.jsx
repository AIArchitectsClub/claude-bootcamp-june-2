import { useState } from 'react'
import { authClient } from '../lib/authClient.js'

export default function AuthPage() {
  const [mode, setMode] = useState('signin')   // 'signin' | 'signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'signup') {
        await authClient.signUp.email(
          { name: name.trim(), email: email.trim(), password },
          { onError: (ctx) => { throw new Error(ctx.error.message) } },
        )
      } else {
        await authClient.signIn.email(
          { email: email.trim(), password },
          { onError: (ctx) => { throw new Error(ctx.error.message) } },
        )
      }
    } catch (err) {
      setError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#f8fafc',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif', padding: 16,
    }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>🎾</div>
        <div style={{ fontWeight: 800, fontSize: 24, color: '#111827', marginTop: 8 }}>TennisCourt</div>
        <div style={{ color: '#6b7280', marginTop: 4 }}>Book your court in seconds</div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        {/* Mode toggle */}
        <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 10, padding: 4, marginBottom: 28 }}>
          {['signin', 'signup'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(null) }}
              style={{
                flex: 1, padding: '8px', borderRadius: 8, border: 'none',
                background: mode === m ? '#fff' : 'transparent',
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
                color: mode === m ? '#111827' : '#6b7280',
                boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#dc2626', fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'signup' && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>Full Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Smith"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#16a34a')}
                onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
              />
            </label>
          )}

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#16a34a')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'At least 8 characters' : ''}
              required
              minLength={mode === 'signup' ? 8 : undefined}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#16a34a')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8, padding: '13px', borderRadius: 10, border: 'none',
              background: loading ? '#86efac' : '#16a34a',
              color: '#fff', fontWeight: 700, fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {loading ? (mode === 'signup' ? 'Creating account…' : 'Signing in…') : (mode === 'signup' ? 'Create Account' : 'Sign In')}
          </button>
        </form>
      </div>
    </div>
  )
}

const inputStyle = {
  padding: '10px 14px', borderRadius: 8,
  border: '1.5px solid #d1d5db', fontSize: 15, outline: 'none', width: '100%',
}
