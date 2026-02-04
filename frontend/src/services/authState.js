import { reactive } from 'vue'

const USER_KEY = 'auth_user'

// Estado reactivo compartido (token viene en httpOnly cookie)
export const authState = reactive({
  user: (() => {
    try {
      const userStr = localStorage.getItem(USER_KEY)
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  })()
})

// Helpers para actualizar estado y localStorage
export function setAuthData(user) {
  authState.user = user
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export function clearAuthData() {
  authState.user = null
  localStorage.removeItem(USER_KEY)
}

export function getUser() {
  return authState.user
}

export function isAuthenticated() {
  // Verificar si hay usuario en estado (cookie httpOnly maneja el token)
  return !!authState.user
}

export function isAdmin() {
  return authState.user?.rol === 'admin'
}
