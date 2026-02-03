<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Navbar v-if="isAuthenticated" />
    <Notification />
    <main class="transition-all duration-300">
      <router-view />
    </main>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Notification from './components/Notification.vue'
import { authService } from './services/auth.service'

export default {
  name: 'App',
  components: {
    Navbar,
    Notification
  },
  computed: {
    isAuthenticated() {
      return authService.isAuthenticated()
    }
  }
}
</script>
