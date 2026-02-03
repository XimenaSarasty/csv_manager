<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black opacity-40" @click="onCancel"></div>
    <div class="bg-white rounded-lg shadow-lg p-6 z-10 max-w-md w-full">
      <h3 class="text-lg font-medium mb-2">{{ title }}</h3>
      <p class="text-sm text-gray-700 mb-4">{{ message }}</p>
      <div class="flex justify-end space-x-2">
        <button @click="onCancel" class="btn btn-secondary">{{ cancelText }}</button>
        <button @click="onConfirm" class="btn btn-primary">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { subscribe } from '../services/confirm.service'

export default {
  name: 'ConfirmDialog',
  data() {
    return {
      visible: false,
      message: '',
      title: 'Confirmar acción',
      confirmText: 'Sí',
      cancelText: 'Cancelar',
      _resolve: null
    }
  },
  mounted() {
    this.unsubscribe = subscribe(this.open)
  },
  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    open: function(options) {
      this.message = options.message || ''
      this.title = options.title || 'Confirmar acción'
      this.confirmText = options.confirmText || 'Sí'
      this.cancelText = options.cancelText || 'Cancelar'
      this._resolve = options._resolve || null
      this.visible = true
    },
    onConfirm() {
      if (this._resolve) this._resolve(true)
      this.visible = false
    },
    onCancel() {
      if (this._resolve) this._resolve(false)
      this.visible = false
    }
  }
}
</script>
