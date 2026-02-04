import api from './api'

export const documentService = {
  async uploadCSV(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  async getDocuments() {
    const response = await api.get('/api/documents')
    return response.data
  },

  async downloadDocument(id, nombre) {
    const response = await api.get(`/api/documents/${id}/download`, {
      responseType: 'blob'
    })
    
    // Crear enlace de descarga
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', nombre)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  async deleteDocument(id) {
    const response = await api.delete(`/api/documents/${id}`)
    return response.data
  }
}
