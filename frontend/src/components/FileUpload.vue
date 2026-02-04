<template>
  <div>
    <!-- Zona de arrastrar y soltar -->
    <div
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      class="border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200"
      :class="isDragging 
        ? 'border-primary-500 bg-primary-50' 
        : 'border-gray-300 hover:border-gray-400'"
      role="button"
      tabindex="0"
      @keydown.enter="$refs.fileInput.click()"
      @keydown.space.prevent="$refs.fileInput.click()"
      aria-label="Zona de carga de archivos. Arrastra un archivo CSV o presiona Enter para seleccionar"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".csv"
        @change="handleFileSelect"
        class="hidden"
        aria-label="Selector de archivo CSV"
      />

      <div v-if="!uploading">
        <svg 
          class="mx-auto h-16 w-16 text-gray-400 mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="text-lg text-gray-700 mb-2">
          Arrastra y suelta tu archivo CSV aquí
        </p>
        <p class="text-sm text-gray-500 mb-4">o</p>
        <button
          type="button"
          @click="$refs.fileInput.click()"
          class="btn btn-primary"
        >
          Seleccionar Archivo
        </button>
        <p class="text-xs text-gray-500 mt-4">
          Formato CSV • Tamaño máximo: 5MB
        </p>
      </div>

      <!-- Progreso de carga -->
      <div v-else class="space-y-4">
        <svg class="animate-spin h-12 w-12 mx-auto text-primary-600" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-700">Procesando archivo...</p>
      </div>
    </div>

    <!-- Información del archivo -->
    <div v-if="selectedFile && !uploading" class="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <svg class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <div>
          <p class="font-medium text-gray-900">{{ selectedFile.name }}</p>
          <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
        </div>
      </div>
      <button
        @click="clearFile"
        class="text-gray-400 hover:text-red-500 transition-colors"
        aria-label="Eliminar archivo seleccionado"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Botón de subida -->
    <div v-if="selectedFile && !uploading" class="mt-4">
      <button
        @click="uploadFile"
        class="w-full btn btn-primary py-3"
      >
        Subir Documento
      </button>
    </div>
  </div>
</template>

<script>
import { documentService } from '../services/document.service'

export default {
  name: 'FileUpload',
  data() {
    return {
      selectedFile: null,
      isDragging: false,
      uploading: false
    }
  },
  methods: {
    handleDrop(e) {
      this.isDragging = false
      const files = e.dataTransfer.files
      if (files.length > 0) {
        this.processFile(files[0])
      }
    },

    handleFileSelect(e) {
      const files = e.target.files
      if (files.length > 0) {
        this.processFile(files[0])
      }
    },

    processFile(file) {
      // Validar el tipo de archivo
      if (!file.name.endsWith('.csv')) {
        window.showNotification('Solo se permiten archivos CSV', 'error')
        return
      }

      // Validar el tamaño del archivo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        window.showNotification('El archivo no puede superar los 5MB', 'error')
        return
      }

      this.selectedFile = file
    },

    async uploadFile() {
      if (!this.selectedFile) return

      this.uploading = true
      try {
        const response = await documentService.uploadCSV(this.selectedFile)
        window.showNotification(
          `Archivo cargado exitosamente: ${response.recordsProcessed} registros procesados`,
          'success'
        )
        this.clearFile()
        this.$emit('file-uploaded')
      } catch (error) {
        const errorData = error.response?.data
        if (errorData?.details && Array.isArray(errorData.details)) {
          // Mostrar errores de validación
          const errorList = errorData.details.slice(0, 5).join('\n')
          const moreErrors = errorData.details.length > 5 
            ? `\n... y ${errorData.details.length - 5} errores más` 
            : ''
          window.showNotification(
            'Errores de validación en el CSV',
            'error',
            errorList + moreErrors,
            10000
          )
        } else {
          const message = errorData?.error || 'Error al cargar el archivo'
          window.showNotification(message, 'error')
        }
      } finally {
        this.uploading = false
      }
    },

    clearFile() {
      this.selectedFile = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }
  }
}
</script>
