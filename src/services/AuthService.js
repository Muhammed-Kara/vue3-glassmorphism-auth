// src/services/AuthService.js
import apiClient from './apiClient'

export const AuthService = {
  async login(credentials) {
    // axios.post yerine apiClient.post kullanıyoruz
    const response = await apiClient.post('/login', credentials)
    return response.data
  },

  async register(userData) {
    const response = await apiClient.post('/register', userData)
    return response.data
  },
}
