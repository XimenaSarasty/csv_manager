import api from './api'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export const authService = {
  async register(userData) {
    const response = await api.post('/api/auth/register', userData)
    if (response.data.token) {
      this.setToken(response.data.token)
      this.setUser(response.data.user)
    }
    return response.data
  },

  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials)
    if (response.data.token) {
      this.setToken(response.data.token)
      this.setUser(response.data.user)
    }
    return response.data
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  getUser() {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  },

  isAuthenticated() {
    return !!this.getToken()
  },

  isAdmin() {
    const user = this.getUser()
    return user?.rol === 'admin'
  }
}
