<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Loading state -->
      <div v-if="loading" class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-gray-600">Verificando tu correo electrónico...</p>
      </div>

      <!-- Success state -->
      <div v-else-if="verified" class="text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <svg class="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">¡Correo Verificado!</h2>
        <p class="mt-2 text-sm text-gray-600">
          Tu cuenta ha sido activada exitosamente.
        </p>
        <div class="mt-6">
          <router-link to="/login" class="btn btn-primary">
            Iniciar Sesión
          </router-link>
        </div>
      </div>

      <!-- Error state -->
      <div v-else class="text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
          <svg class="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Error de Verificación</h2>
        <p class="mt-2 text-sm text-gray-600">{{ errorMessage }}</p>
        <div class="mt-6 space-y-2">
          <router-link to="/register" class="btn btn-secondary block">
            Registrarse Nuevamente
          </router-link>
          <router-link to="/login" class="btn btn-outline block">
            Ir al Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default {
  name: 'VerifyEmail',
  data() {
    return {
      loading: true,
      verified: false,
      errorMessage: ''
    }
  },
  async mounted() {
    const token = this.$route.params.token
    
    if (!token) {
      this.loading = false
      this.errorMessage = 'Token de verificación no proporcionado'
      return
    }

    try {
      const response = await axios.get(`${API_URL}/api/auth/verify-email/${token}`)
      
      if (response.data.success) {
        this.verified = true
        window.showNotification('¡Cuenta activada! Ya puedes iniciar sesión', 'success')
      }
    } catch (error) {
      this.errorMessage = error.response?.data?.error || 'Error al verificar el correo electrónico'
      window.showNotification(this.errorMessage, 'error')
    } finally {
      this.loading = false
    }
  }
}
</script>
