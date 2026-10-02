import api from './api'

// Every function here maps 1:1 to a route from the backend PRD's Auth Routes table.
const authService = {
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
  getCurrentUser: () => api.get('/auth/current-user').then((r) => r.data),
  changePassword: (payload) => api.post('/auth/change-password', payload).then((r) => r.data),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`).then((r) => r.data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then((r) => r.data),
  resetPassword: (token, payload) => api.post(`/auth/reset-password/${token}`, payload).then((r) => r.data),
  resendEmailVerification: () => api.post('/auth/resend-email-verification').then((r) => r.data),
}

export default authService
