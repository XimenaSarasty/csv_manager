<template>
  <nav class="bg-white shadow-lg" role="navigation" aria-label="Main navigation">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <svg class="h-8 w-8 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
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
