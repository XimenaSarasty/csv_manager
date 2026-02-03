<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="flex justify-center">
          <svg class="h-16 w-16 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          ¿No tienes cuenta?
          <router-link to="/register" class="font-medium text-primary-600 hover:text-primary-500">
            Regístrate aquí
          </router-link>
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6" novalidate>
        <div class="space-y-4">
          <div>
            <label for="email" class="label">
              Correo Electrónico
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              required
              class="input"
              :class="{ 'border-red-500': errors.email }"
              placeholder="tu@email.com"
              @input="errors.email = ''"
            />
            <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="label">
              Contraseña
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              required
              class="input"
              :class="{ 'border-red-500': errors.password }"
              placeholder="••••••••"
              @input="errors.password = ''"
            />
            <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn btn-primary py-3 text-base"
          >
            <span v-if="!loading">Iniciar Sesión</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { authService } from '../services/auth.service'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      errors: {},
      loading: false
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      let isValid = true

      if (!this.form.email) {
        this.errors.email = 'El correo es requerido'
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(this.form.email)) {
        this.errors.email = 'El correo no es válido'
        isValid = false
      }

      if (!this.form.password) {
        this.errors.password = 'La contraseña es requerida'
        isValid = false
      }

      return isValid
    },

    async handleSubmit() {
      if (!this.validateForm()) return

      this.loading = true
      try {
        await authService.login(this.form)
        window.showNotification('¡Bienvenido! Sesión iniciada correctamente', 'success')
        this.$router.push('/dashboard')
      } catch (error) {
        const message = error.response?.data?.error || 'Error al iniciar sesión'
        const requiresVerification = error.response?.data?.requiresVerification
        
        if (requiresVerification) {
          window.showNotification(
            'Tu cuenta aún no ha sido verificada. Por favor revisa tu correo electrónico.',
            'error',
            '',
            7000
          )
        } else {
          window.showNotification(message, 'error')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
