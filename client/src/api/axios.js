import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const user = JSON.parse(localStorage.getItem('user'))
      // Only redirect if user is actually logged in
      if (user) {
        localStorage.removeItem('user')
        // Redirect based on role
        if (user.role === 'admin') {
          window.location.href = '/admin/login'
        } else {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default API