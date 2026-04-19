import { create } from 'zustand'

const TOKEN_KEY = 'trvy_token'

export const useAuthStore = create((set) => ({
  user:  JSON.parse(localStorage.getItem('trvy_user') || 'null'),
  token: localStorage.getItem(TOKEN_KEY) || null,

  setAuth: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem('trvy_user', JSON.stringify(user))
    set({ token, user })
  },

  setUser: (user) => {
    localStorage.setItem('trvy_user', JSON.stringify(user))
    set({ user })
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('trvy_user')
    set({ token: null, user: null })
  },

  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
}))
