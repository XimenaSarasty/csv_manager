<template>
  <nav class="bg-white shadow-lg" role="navigation" aria-label="Main navigation">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <img src="/csv.png" alt="CSV Manager Logo" class="h-8 w-8 mr-3" />
          <h1 class="text-xl font-bold text-gray-900">CSV Manager</h1>
        </div>

        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">{{ user?.nombre }}</span>
            <span 
              class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
            >
              {{ user?.rol }}
            </span>
          </div>
          <button
            @click="handleLogout"
            class="btn btn-secondary text-sm"
            aria-label="Cerrar sesión"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { authService } from '../services/auth.service'
import { authState } from '../services/authState'

export default {
  name: 'Navbar',
  computed: {
    user() {
      return authState.user
    },
    isAdmin() {
      return authState.user?.rol === 'admin'
    }
  },
  methods: {
    async handleLogout() {
      await authService.logout()
      this.$router.push('/login')
    }
  }
}
</script>
