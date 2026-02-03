import api from './api'
import { setAuthData, clearAuthData, getUser, isAuthenticated, isAdmin } from './authState'

export const authService = {
  async register(userData) {
    const response = await api.post('/api/auth/register', userData)
    // El token viene en httpOnly cookie, solo guardamos user
    if (response.data.user) {
      setAuthData(response.data.user)
    }
    return response.data
  },

  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials)
    // El token viene en httpOnly cookie, solo guardamos user
    if (response.data.user) {
      setAuthData(response.data.user)
    }
    return response.data
  },

  async logout() {
    try {
      // Llamar al backend para limpiar la cookie httpOnly
      await api.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Limpiar estado local siempre
      clearAuthData()
    }
  },

  getUser() {
    return getUser()
  },

  isAuthenticated() {
    return isAuthenticated()
  },

  isAdmin() {
    return isAdmin()
  }
}
