import api from './api'

const projectService = {
  list: () => api.get('/projects').then((r) => r.data),
  create: (payload) => api.post('/projects', payload).then((r) => r.data),
  getById: (projectId) => api.get(`/projects/${projectId}`).then((r) => r.data),
  update: (projectId, payload) => api.put(`/projects/${projectId}`, payload).then((r) => r.data),
  remove: (projectId) => api.delete(`/projects/${projectId}`).then((r) => r.data),

  listMembers: (projectId) => api.get(`/projects/${projectId}/members`).then((r) => r.data),
  addMember: (projectId, payload) => api.post(`/projects/${projectId}/members`, payload).then((r) => r.data),
  updateMemberRole: (projectId, userId, payload) =>
    api.put(`/projects/${projectId}/members/${userId}`, payload).then((r) => r.data),
  removeMember: (projectId, userId) =>
    api.delete(`/projects/${projectId}/members/${userId}`).then((r) => r.data),
}

export default projectService
