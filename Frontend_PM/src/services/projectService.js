import api from './api'

const projectService = {
  // Backend returns [{ role, project: { _id, name, ... } }] — flatten that
  // into plain project objects (with role/memberCount attached) so every
  // page can read project.name / project._id directly.
  list: () =>
    api.get('/projects').then((r) => {
      const items = r.data.data || []
      const projects = items.map((item) => ({
        ...item.project,
        role: item.role,
        memberCount: item.project?.members,
      }))
      return { ...r.data, data: projects }
    }),
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
