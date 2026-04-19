import axios from 'axios'

// In production (Vercel), VITE_API_URL points to the Railway backend.
// In development, requests go through the Vite proxy at /api.
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : '/api/v1'

const api = axios.create({
  baseURL,
  headers: { Accept: 'application/json' },
  withCredentials: true,
})

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('trvy_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('trvy_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
