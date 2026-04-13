import { ref, computed } from 'vue'
import api from '../api'

const token = ref(localStorage.getItem('admin_token') || '')
const user  = ref(JSON.parse(localStorage.getItem('admin_user') || 'null'))

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value)

  // Attach token to all requests
  function setToken(t) {
    token.value = t
    if (t) {
      localStorage.setItem('admin_token', t)
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`
    } else {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      delete api.defaults.headers.common['Authorization']
    }
  }

  // Restore token on page load
  function init() {
    if (token.value) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    }
  }

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    setToken(data.token)
    user.value = data.user
    localStorage.setItem('admin_user', JSON.stringify(data.user))
    return data
  }

  async function logout() {
    try { await api.post('/auth/logout') } catch {}
    setToken('')
    user.value = null
  }

  return { isLoggedIn, user, login, logout, init, token }
}
