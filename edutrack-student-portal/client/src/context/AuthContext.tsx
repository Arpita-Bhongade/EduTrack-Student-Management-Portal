import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { authApi } from '../services/api'

type User = { name: string; email: string; role: string }

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('edutrack_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = async (email: string, password: string) => {
    const result = await authApi.login(email, password)
    localStorage.setItem('edutrack_token', result.token)
    localStorage.setItem('edutrack_user', JSON.stringify(result.user))
    setUser(result.user)
  }

  const logout = () => {
    localStorage.removeItem('edutrack_token')
    localStorage.removeItem('edutrack_user')
    setUser(null)
  }

  const value = useMemo(() => ({ user, isAuthenticated: !!user, login, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
