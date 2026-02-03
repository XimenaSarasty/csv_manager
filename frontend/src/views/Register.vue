<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="flex justify-center">
          <svg class="h-16 w-16 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Crear Cuenta
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          ¿Ya tienes cuenta?
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            Inicia sesión aquí
          </router-link>
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6" novalidate>
        <div class="space-y-4">
          <div>
            <label for="nombre" class="label">
              Nombre Completo
            </label>
            <input
              id="nombre"
              v-model="form.nombre"
              type="text"
              autocomplete="name"
              required
              class="input"
              :class="{ 'border-red-500': errors.nombre }"
              placeholder="Juan Pérez"
              @input="errors.nombre = ''"
            />
            <p v-if="errors.nombre" class="error-text">{{ errors.nombre }}</p>
          </div>

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
              autocomplete="new-password"
              required
              class="input"
              :class="{ 'border-red-500': errors.password }"
              placeholder="••••••••"
              @input="errors.password = ''"
            />
            <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
          </div>

          <div>
            <label for="confirmarPassword" class="label">
              Confirmar Contraseña
            </label>
            <input
              id="confirmarPassword"
              v-model="form.confirmarPassword"
              type="password"
              autocomplete="new-password"
              required
              class="input"
              :class="{ 'border-red-500': errors.confirmarPassword }"
              placeholder="••••••••"
              @input="errors.confirmarPassword = ''"
            />
            <p v-if="errors.confirmarPassword" class="error-text">{{ errors.confirmarPassword }}</p>
          </div>

          <div>
            <label for="rol" class="label">
              Rol de Usuario
            </label>
            <select
              id="rol"
              v-model="form.rol"
              class="input"
              :class="{ 'border-red-500': errors.rol }"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">
              <strong>Usuario:</strong> Puede cargar y descargar documentos. 
              <strong>Admin:</strong> Puede eliminar documentos.
            </p>
            <p v-if="errors.rol" class="error-text">{{ errors.rol }}</p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn btn-primary py-3 text-base"
          >
            <span v-if="!loading">Registrarse</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registrando...
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
  name: 'Register',
  data() {
    return {
      form: {
        nombre: '',
        email: '',
        password: '',
        confirmarPassword: '',
        rol: 'user'
      },
      errors: {},
      loading: false
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      let isValid = true

      if (!this.form.nombre || this.form.nombre.length < 3) {
        this.errors.nombre = 'El nombre debe tener al menos 3 caracteres'
        isValid = false
      }

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
      } else if (this.form.password.length < 6) {
        this.errors.password = 'La contraseña debe tener al menos 6 caracteres'
        isValid = false
      }

      if (this.form.password !== this.form.confirmarPassword) {
        this.errors.confirmarPassword = 'Las contraseñas no coinciden'
        isValid = false
      }

      return isValid
    },

    async handleSubmit() {
      if (!this.validateForm()) return

      this.loading = true
      try {
        await authService.register(this.form)
        window.showNotification('¡Cuenta creada exitosamente!', 'success')
        this.$router.push('/dashboard')
      } catch (error) {
        const message = error.response?.data?.error || 'Error al registrarse'
        window.showNotification(message, 'error')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
