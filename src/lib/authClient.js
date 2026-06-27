import { createAuthClient } from 'better-auth/react'

// In dev, VITE_API_URL is empty so the Vite proxy handles /api/auth/*.
// In production it points to the deployed backend (e.g. https://tennis-booking-backend.onrender.com).
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || undefined,
})

export const { useSession, signIn, signOut, signUp } = authClient
