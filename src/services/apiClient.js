// src/services/apiClient.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth' // Pinia store'umuzu daha sonra bağlayacağız

const apiClient = axios.create({
  baseURL: '-', // Kendi backend URL'in ile değiştir
  headers: {
    'Content-Type': 'application/json',
  },
})

// İSTEK (REQUEST) INTERCEPTOR: Her istekten önce çalışır
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// YANIT (RESPONSE) INTERCEPTOR: Backend'den cevap geldiğinde çalışır
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Eğer backend'den 401 (Yetkisiz) hatası dönerse token geçersiz demektir
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      authStore.logout() // Kullanıcıyı çıkış yaptır
      window.location.href = '/login' // Login sayfasına yönlendir
    }
    return Promise.reject(error)
  },
)

export default apiClient
