import api from './api'

const taskService = {
  list: (projectId) => api.get(`/tasks/${projectId}`).then((r) => r.data),
  create: (projectId, payload) => {
    // Supports file attachments -> send as multipart/form-data when files are present
    const isFormData = payload instanceof FormData
    return api
      .post(`/tasks/${projectId}`, payload, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {})
      .then((r) => r.data)
  },
  getById: (projectId, taskId) => api.get(`/tasks/${projectId}/t/${taskId}`).then((r) => r.data),
  update: (projectId, taskId, payload) => {
    const isFormData = payload instanceof FormData
    return api
      .put(`/tasks/${projectId}/t/${taskId}`, payload, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {})
      .then((r) => r.data)
  },
  remove: (projectId, taskId) => api.delete(`/tasks/${projectId}/t/${taskId}`).then((r) => r.data),

  createSubtask: (projectId, taskId, payload) =>
    api.post(`/tasks/${projectId}/t/${taskId}/subtasks`, payload).then((r) => r.data),
  updateSubtask: (projectId, subTaskId, payload) =>
    api.put(`/tasks/${projectId}/st/${subTaskId}`, payload).then((r) => r.data),
  removeSubtask: (projectId, subTaskId) =>
    api.delete(`/tasks/${projectId}/st/${subTaskId}`).then((r) => r.data),
}

export default taskService
