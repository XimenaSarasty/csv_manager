<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-gray-600">Gestión de documentos CSV</p>
    </div>

    <!-- Upload Section -->
    <div class="card mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Cargar Documento CSV</h2>
      <FileUpload @file-uploaded="handleFileUploaded" />
    </div>

    <!-- Documents Table -->
    <div class="card">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Documentos Cargados</h2>
        <button
          @click="loadDocuments"
          class="btn btn-secondary text-sm"
          :disabled="loading"
          aria-label="Actualizar lista de documentos"
        >
          <svg class="h-5 w-5" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <DocumentsTable
        :documents="documents"
        :loading="loading"
        :is-admin="isAdmin"
        @download="handleDownload"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script>
import FileUpload from '../components/FileUpload.vue'
import DocumentsTable from '../components/DocumentsTable.vue'
import { documentService } from '../services/document.service'
import { authService } from '../services/auth.service'
import { confirm } from '../services/confirm.service'

export default {
  name: 'Dashboard',
  components: {
    FileUpload,
    DocumentsTable
  },
  data() {
    return {
      documents: [],
      loading: false,
      isAdmin: false
    }
  },
  mounted() {
    this.isAdmin = authService.isAdmin()
    this.loadDocuments()
  },
  methods: {
    async loadDocuments() {
      this.loading = true
      try {
        const response = await documentService.getDocuments()
        this.documents = response.documents
      } catch (error) {
        window.showNotification('Error al cargar documentos', 'error')
      } finally {
        this.loading = false
      }
    },

    handleFileUploaded() {
      this.loadDocuments()
    },

    async handleDownload(document) {
      try {
        await documentService.downloadDocument(document.id, document.nombre)
        window.showNotification(`Descargando ${document.nombre}`, 'success')
      } catch (error) {
        window.showNotification('Error al descargar el documento', 'error')
      }
    },

    async handleDelete(document) {
      try {
        const ok = await confirm(`¿Estás seguro de eliminar "${document.nombre}"?`)
        if (!ok) return

        await documentService.deleteDocument(document.id)
        window.showNotification('Documento eliminado correctamente', 'success')
        this.loadDocuments()
      } catch (error) {
        const message = error.response?.data?.error || 'Error al eliminar el documento'
        window.showNotification(message, 'error')
      }
    }
  }
}
</script>
