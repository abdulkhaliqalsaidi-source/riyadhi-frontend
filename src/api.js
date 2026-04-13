import axios from 'axios'
import router from './router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})

// Auto logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      delete api.defaults.headers.common['Authorization']
      router.push('/login')
    }
    return Promise.reject(err)
  }
)

export default api
