import api from './api'

const noteService = {
  list: (projectId) => api.get(`/notes/${projectId}`).then((r) => r.data),
  create: (projectId, payload) => api.post(`/notes/${projectId}`, payload).then((r) => r.data),
  getById: (projectId, noteId) => api.get(`/notes/${projectId}/n/${noteId}`).then((r) => r.data),
  update: (projectId, noteId, payload) => api.put(`/notes/${projectId}/n/${noteId}`, payload).then((r) => r.data),
  remove: (projectId, noteId) => api.delete(`/notes/${projectId}/n/${noteId}`).then((r) => r.data),
}

export default noteService
