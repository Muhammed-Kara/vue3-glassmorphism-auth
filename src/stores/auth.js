// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AuthService } from '@/services/AuthService'

export const useAuthStore = defineStore('auth', () => {
  // --- 1. STATE (Veriler) ---
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null) // Kullanıcı bilgilerini (isim, email vb.) tutacağımız yer

  // --- 2. GETTERS (Hesaplanmış Değerler) ---
  // Token varsa kullanıcı giriş yapmıştır (true/false döner)
  const isAuthenticated = computed(() => !!token.value)

  // --- 3. ACTIONS (Eylemler) ---
  async function login(credentials) {
    try {
      // Servisi çağırıp backend'e isteği atıyoruz
      const data = await AuthService.login(credentials)

      // Başarılı olursa token'ı hem state'e hem localStorage'a yazıyoruz
      token.value = data.token
      localStorage.setItem('token', data.token)

      // Varsa kullanıcı bilgisini state'e alıyoruz
      user.value = data.user

      return true // Component tarafında başarılı olduğunu anlamak için
    } catch (error) {
      console.error('Store: Giriş başarısız', error)
      throw error // Hatayı UI'da (Login sayfasında) göstermek için fırlatıyoruz
    }
  }

  function logout() {
    // Çıkış yaparken her şeyi temizliyoruz
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { token, user, isAuthenticated, login, logout }
})
