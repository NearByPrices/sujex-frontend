import { create } from 'zustand'

interface UserInfo {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  isPlatformAdmin: boolean
  tenantId?: string
}

interface AuthState {
  user: UserInfo | null
  isAuthenticated: boolean
  setUser: (user: UserInfo, accessToken: string, refreshToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user, accessToken, refreshToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)
    }
    set({ user, isAuthenticated: true })
  },
  logout: () => {
    if (typeof window !== 'undefined') localStorage.clear()
    set({ user: null, isAuthenticated: false })
  },
}))
