import axios from 'axios'
import { useAuthStore } from '../stores/auth.store'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
})

/**
 * REQUEST INTERCEPTOR
 * Side effect: injects the JWT from AuthStore into the Authorization header.
 * If no token exists (unauthenticated user), the request proceeds without the header.
 * Protected endpoints will return 401, not a network error.
 */
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * RESPONSE INTERCEPTOR — ERROR
 * Side effect 1: On 401, clears AuthStore and redirects to /login.
 *   IMPORTANT: The backend must return 401 ONLY for invalid/expired tokens.
 *   Authorization failures (wrong role/ownership) must return 403 to avoid
 *   logging out users who are authenticated but lack resource access.
 * Side effect 2: On network error (no response), a generic error is returned.
 */
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
