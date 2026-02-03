<template>
  <div 
    v-if="notification.show" 
    class="fixed top-4 right-4 z-50 max-w-md animate-slide-up"
    role="alert"
    :aria-live="notification.type === 'error' ? 'assertive' : 'polite'"
  >
    <div 
      class="rounded-lg shadow-lg p-4 flex items-start space-x-3"
      :class="notificationClasses"
    >
      <div class="flex-shrink-0">
        <svg 
          v-if="notification.type === 'success'" 
          class="h-6 w-6 text-green-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg 
          v-else-if="notification.type === 'error'" 
          class="h-6 w-6 text-red-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg 
          v-else 
          class="h-6 w-6 text-blue-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium">{{ notification.message }}</p>
        <p v-if="notification.details" class="text-xs mt-1 opacity-90">
          {{ notification.details }}
        </p>
      </div>
      <button
        @click="closeNotification"
        class="flex-shrink-0 ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        aria-label="Cerrar notificación"
      >
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  data() {
    return {
      notification: {
        show: false,
        type: 'info',
        message: '',
        details: ''
      },
      timer: null
    }
  },
  computed: {
    notificationClasses() {
      const baseClasses = {
        'success': 'bg-green-50 border-l-4 border-green-400 text-green-800',
        'error': 'bg-red-50 border-l-4 border-red-400 text-red-800',
        'info': 'bg-blue-50 border-l-4 border-blue-400 text-blue-800'
      }
      return baseClasses[this.notification.type] || baseClasses.info
    }
  },
  mounted() {
    window.showNotification = this.show
  },
  methods: {
    show(message, type = 'info', details = '', duration = 5000) {
      this.notification = {
        show: true,
        type,
        message,
        details
      }

      if (this.timer) {
        clearTimeout(this.timer)
      }

      if (duration > 0) {
        this.timer = setTimeout(() => {
          this.closeNotification()
        }, duration)
      }
    },
    closeNotification() {
      this.notification.show = false
      if (this.timer) {
        clearTimeout(this.timer)
      }
    }
  }
}
</script>
