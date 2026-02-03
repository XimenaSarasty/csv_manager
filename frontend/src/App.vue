<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Navbar v-if="isAuthenticated" />
    <Notification />
    <ConfirmDialog />
    <main class="transition-all duration-300">
      <router-view />
    </main>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Notification from './components/Notification.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import { authState } from './services/authState'

export default {
  name: 'App',
  components: {
    Navbar,
    Notification,
    ConfirmDialog
  },
  computed: {
    isAuthenticated() {
      return !!authState.user
    }
  }
}
</script>
