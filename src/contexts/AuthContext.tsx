'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { AuthUser } from '@/types'

const ADMIN_USER: AuthUser = {
  id: 'admin',
  name: 'Admin',
  email: 'admin@am-infra.com',
  level: 'managing_director',
  practiceArea: 'restructuring',
  office: 'São Paulo',
  avatarInitials: 'AD',
}

const GUEST_USER: AuthUser = {
  id: 'guest',
  name: 'Visitante',
  email: '',
  level: 'analyst',
  practiceArea: 'restructuring',
  office: '',
  avatarInitials: 'VI',
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isGuest: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  loginAsGuest: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('am_infra_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('am_infra_user') }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 600))

    const validEmail = email === 'admin@am-infra.com' || email === 'admin'
    const validPassword = password === 'admin123'

    if (!validEmail || !validPassword) {
      setIsLoading(false)
      return { success: false, error: 'E-mail ou senha inválidos.' }
    }

    setUser(ADMIN_USER)
    localStorage.setItem('am_infra_user', JSON.stringify(ADMIN_USER))
    setIsLoading(false)
    return { success: true }
  }

  const loginAsGuest = () => {
    setUser(GUEST_USER)
    localStorage.setItem('am_infra_user', JSON.stringify(GUEST_USER))
    router.push('/dashboard')
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('am_infra_user')
    router.push('/login')
  }

  const isGuest = user?.id === 'guest'

  return (
    <AuthContext.Provider value={{ user, isLoading, isGuest, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
