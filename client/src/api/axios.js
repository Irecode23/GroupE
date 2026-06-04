import axios from 'axios'

const API = axios.create({
  baseURL: 'https://rideshare-backend-c0y4.onrender.com/api'
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
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Wait 2 seconds for Render to wake up then retry
      await new Promise(resolve => setTimeout(resolve, 2000))

      const user = JSON.parse(localStorage.getItem('user'))
      if (user?.token) {
        originalRequest.headers.Authorization = `Bearer ${user.token}`
        return API(originalRequest)
      }

      localStorage.removeItem('user')
      const isAdmin = window.location.pathname.includes('admin')
      window.location.href = isAdmin ? '/admin/login' : '/login'
    }

    return Promise.reject(error)
  }
)

export default API