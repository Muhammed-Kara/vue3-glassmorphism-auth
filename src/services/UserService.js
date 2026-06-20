import apiClient from './apiClient'

export const UserService = {
  // Giriş yapmış kullanıcının kendi bilgilerini getirmesi
  getProfile() {
    return apiClient.get('/users/me')
  },

  // Admin paneli için tüm kullanıcıları listeleme
  getAllUsers() {
    return apiClient.get('/users')
  },

  // Kullanıcı silme (Sadece yetkili hesaplar)
  deleteUser(userId) {
    return apiClient.delete(`/users/${userId}`)
  },
}
