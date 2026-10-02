import axios from 'axios'

// One shared axios instance for the whole app.
// baseURL comes from .env (VITE_API_URL) so it's easy to change per environment.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // send cookies (backend uses httpOnly cookies for refresh token)
})

// --- REQUEST INTERCEPTOR ---
// Runs before every request. Attaches the access token (if we have one) as a Bearer header.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// --- RESPONSE INTERCEPTOR ---
// Runs after every response. If we get a 401 (token expired) we try ONE silent
// refresh using the backend's /refresh-token route, then retry the original request.
let isRefreshing = false
let queue = []

const processQueue = (error, token = null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
  queue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        )
        const newToken = data?.data?.accessToken
        localStorage.setItem('accessToken', newToken)
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// Turns any backend/network error into one clean, readable message string.
export function getErrorMessage(error) {
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.response?.status === 401) return 'Please log in to continue.'
  if (error?.response?.status === 403) return "You don't have permission to do that."
  if (error?.response?.status === 404) return 'Not found.'
  if (error?.response?.status === 409) return 'This already exists.'
  if (error?.response?.status === 422) return 'Please check the form for errors.'
  if (error?.response?.status >= 500) return 'Something went wrong on the server. Please try again.'
  if (error?.message === 'Network Error') return 'Cannot reach the server. Check your connection.'
  return 'Something went wrong. Please try again.'
}

export default api
