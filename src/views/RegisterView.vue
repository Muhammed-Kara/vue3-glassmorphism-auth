<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '@/services/AuthService'

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const isDarkMode = ref(false)
const registerStatus = ref('idle') // 'idle', 'error', 'angry'

const router = useRouter()

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const togglePasswordConfirm = () => {
  showPasswordConfirm.value = !showPasswordConfirm.value
}

watch([name, email, password, passwordConfirm], () => {
  if (registerStatus.value === 'error' || registerStatus.value === 'angry') {
    registerStatus.value = 'idle'
    errorMessage.value = ''
  }
})

const handleRegister = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    registerStatus.value = 'idle'

    // 1. Boş Alan Kontrolü (Eğer boş alan varsa sinirlenirler!)
    if (!name.value || !email.value || !password.value || !passwordConfirm.value) {
      errorMessage.value = 'Lütfen tüm zorunlu alanları doldurun!'
      registerStatus.value = 'angry'
      isLoading.value = false
      return
    }

    // 2. Şifre Eşleşme Kontrolü
    if (password.value !== passwordConfirm.value) {
      errorMessage.value = 'Şifreler birbiriyle uyuşmuyor!'
      registerStatus.value = 'error'
      isLoading.value = false
      return
    }

    // 3. Servis Üzerinden Kayıt İsteği
    await AuthService.register({
      name: name.value,
      email: email.value,
      password: password.value,
    })

    successMessage.value = 'Kayıt başarıyla tamamlandı! Giriş sayfasına yönlendiriliyorsunuz...'

    // 4. Başarılı kayıt sonrası 2 saniye bekleyip Giriş sayfasına yönlendir
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    registerStatus.value = 'error'
    errorMessage.value = error.response?.data?.message || 'Kayıt sırasında bir hata oluştu.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="register-page" :class="{ dark: isDarkMode }">
    <button
      class="theme-toggle"
      @click="toggleTheme"
      :aria-label="isDarkMode ? 'Aydınlık temaya geç' : 'Karanlık temaya geç'"
    >
      <svg
        v-if="isDarkMode"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>

    <div class="register-container">
      <div class="register-left">
        <div class="register-card">
          <div class="register-header">
            <h2>Kayıt Ol</h2>
            <p class="subtitle">Yeni bir hesap oluşturun</p>
          </div>

          <div v-if="errorMessage" class="alert error-alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="alert success-alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            {{ successMessage }}
          </div>

          <form @submit.prevent="handleRegister" novalidate>
            <div class="form-group">
              <label for="name">Ad Soyad</label>
              <div class="input-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input type="text" id="name" v-model="name" />
              </div>
            </div>

            <div class="form-group">
              <label for="email">E-posta</label>
              <div class="input-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input type="email" id="email" v-model="email" />
              </div>
            </div>

            <div class="form-group">
              <label for="password">Şifre</label>
              <div class="input-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="password"
                />
                <button type="button" class="toggle-password" @click="togglePassword">
                  <svg
                    v-if="!showPassword"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                    ></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="passwordConfirm">Şifreyi Tekrarla</label>
              <div class="input-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  :type="showPasswordConfirm ? 'text' : 'password'"
                  id="passwordConfirm"
                  v-model="passwordConfirm"
                />
                <button type="button" class="toggle-password" @click="togglePasswordConfirm">
                  <svg
                    v-if="!showPasswordConfirm"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                    ></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" class="submit-btn" :disabled="isLoading">
              <span v-if="isLoading" class="spinner"></span>
              {{ isLoading ? 'Kaydediliyor...' : 'Kayıt Ol' }}
            </button>

            <div class="auth-redirect">
              Zaten hesabın var mı? <router-link to="/login">Giriş Yap</router-link>
            </div>
          </form>
        </div>
      </div>

      <div class="register-right">
        <div class="characters-container">
          <div class="flat-character character-large" :class="registerStatus">
            <div class="char-eyes">
              <div class="char-eye">
                <div
                  class="char-pupil"
                  :class="{ looking: showPassword || showPasswordConfirm }"
                ></div>
              </div>
              <div class="char-eye">
                <div
                  class="char-pupil"
                  :class="{ looking: showPassword || showPasswordConfirm }"
                ></div>
              </div>
            </div>
            <div class="char-mouth"></div>
          </div>

          <div class="flat-character character-medium" :class="registerStatus">
            <div class="char-eyes">
              <div class="char-eye">
                <div
                  class="char-pupil"
                  :class="{ looking: showPassword || showPasswordConfirm }"
                ></div>
              </div>
              <div class="char-eye">
                <div
                  class="char-pupil"
                  :class="{ looking: showPassword || showPasswordConfirm }"
                ></div>
              </div>
            </div>
            <div class="char-mouth"></div>
          </div>

          <div class="flat-character character-small" :class="registerStatus">
            <div class="char-eyes">
              <div class="char-eye">
                <div
                  class="char-pupil"
                  :class="{ looking: showPassword || showPasswordConfirm }"
                ></div>
              </div>
              <div class="char-eye">
                <div
                  class="char-pupil"
                  :class="{ looking: showPassword || showPasswordConfirm }"
                ></div>
              </div>
            </div>
            <div class="char-mouth"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* GENEL SAYFA VE TAM EKRAN AYARLARI */
.register-page {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  position: relative;
  overflow: hidden;
  transition: background 0.4s ease;
}

.register-page.dark {
  background: #0f0f23;
}

.theme-toggle {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 100;
}

.register-page.dark .theme-toggle {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.theme-toggle:hover {
  transform: rotate(180deg) scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.register-container {
  display: flex;
  width: 100%;
  height: 100%;
  margin: 0;
}

.register-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: white;
}

.register-page.dark .register-left {
  background: #0f0f23;
}

.register-right {
  flex: 1.2;
  background: linear-gradient(135deg, #47669a 0%, #6b5b95 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.register-page.dark .register-right {
  background: linear-gradient(135deg, #243552 0%, #352a4f 100%);
}

.register-card {
  width: 100%;
  max-width: 420px;
}

.register-header {
  margin-bottom: 2rem;
}

h2 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.register-page.dark h2 {
  color: #fff;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

.register-page.dark .subtitle {
  color: #94a3b8;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
}

.register-page.dark label {
  color: #e2e8f0;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper > svg:first-child {
  position: absolute;
  left: 1rem;
  color: #94a3b8;
  transition: color 0.3s ease;
}

.register-page.dark .input-wrapper > svg:first-child {
  color: #64748b;
}

.input-wrapper input {
  width: 100%;
  padding: 0.85rem 3rem 0.85rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: #f8fafc;
  transition: all 0.3s ease;
  color: #1a1a2e;
}

.register-page.dark .input-wrapper input {
  background: #1a1a2e;
  border-color: #334155;
  color: #f1f5f9;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #47669a;
  background: white;
  box-shadow: 0 0 0 4px rgba(71, 102, 154, 0.1);
}

.register-page.dark .input-wrapper input:focus {
  background: #1e293b;
  border-color: #6b5b95;
  box-shadow: 0 0 0 4px rgba(107, 91, 149, 0.15);
}

.input-wrapper input:focus + svg,
.input-wrapper:focus-within > svg:first-child {
  color: #47669a;
}

.register-page.dark .input-wrapper input:focus + svg,
.register-page.dark .input-wrapper:focus-within > svg:first-child {
  color: #6b5b95;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #64748b;
}

.register-page.dark .toggle-password {
  color: #64748b;
}

.register-page.dark .toggle-password:hover {
  color: #94a3b8;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #47669a 0%, #6b5b95 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.submit-btn:hover:not(:disabled)::before {
  left: 100%;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(71, 102, 154, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  margin-right: 0.5rem;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.auth-redirect {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.register-page.dark .auth-redirect {
  color: #94a3b8;
}

.auth-redirect a {
  color: #47669a;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.register-page.dark .auth-redirect a {
  color: #8c7ab8;
}

.auth-redirect a:hover {
  color: #6b5b95;
  text-decoration: underline;
}

.alert {
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.error-alert {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
  animation: shake 0.4s ease;
}

.register-page.dark .error-alert {
  background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
  color: #fca5a5;
}

.success-alert {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #059669;
}

.register-page.dark .success-alert {
  background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
  color: #6ee7b7;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20%,
  60% {
    transform: translateX(-5px);
  }
  40%,
  80% {
    transform: translateX(5px);
  }
}

/* ŞEKİLLER VE ÖZEL FORMLARI */
.characters-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3.5rem;
  height: 100%;
  width: 100%;
}

.flat-character {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(12px);
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.1),
    inset 0 0 20px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.register-page.dark .flat-character {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-color: rgba(255, 255, 255, 0.1);
}

.character-large {
  width: 260px;
  height: 160px;
  animation: blob-float-1 6s ease-in-out infinite;
}

.character-medium {
  width: 140px;
  height: 190px;
  animation: blob-float-2 5s ease-in-out infinite reverse;
}

.character-small {
  width: 130px;
  height: 110px;
  animation: blob-float-3 4.5s ease-in-out infinite;
}

.char-eyes {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}
.character-medium .char-eyes {
  gap: 16px;
  margin-top: 20px;
}
.character-small .char-eyes {
  gap: 12px;
  margin-top: 10px;
}

.char-eye {
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.register-page.dark .char-eye {
  background: #f1f5f9;
}

.character-large .char-eye {
  width: 44px;
  height: 44px;
}
.character-medium .char-eye {
  width: 34px;
  height: 34px;
}
.character-small .char-eye {
  width: 22px;
  height: 22px;
}

.char-pupil {
  background: #1a1a2e;
  border-radius: 50%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate(6px, -6px);
}

.character-large .char-pupil {
  width: 18px;
  height: 18px;
}
.character-medium .char-pupil {
  width: 14px;
  height: 14px;
}
.character-small .char-pupil {
  width: 10px;
  height: 10px;
}

.char-pupil.looking {
  transform: translate(-14px, 6px);
}
.character-medium .char-pupil.looking {
  transform: translate(-12px, 5px);
}
.character-small .char-pupil.looking {
  transform: translate(-8px, 3px);
}

.char-mouth {
  width: 20px;
  height: 5px;
  background: #1a1a2e;
  border-radius: 10px;
  margin-top: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.character-medium .char-mouth {
  width: 16px;
  height: 4px;
  margin-top: 25px;
}
.character-small .char-mouth {
  width: 10px;
  height: 3px;
  margin-top: 15px;
}

/* --- DURUM: ŞİFRELER UYUŞMUYOR VEYA HATA (ÜZGÜN) --- */
.flat-character.error {
  background: linear-gradient(135deg, rgba(254, 202, 202, 0.4) 0%, rgba(254, 202, 202, 0.1) 100%);
  border-color: rgba(239, 68, 68, 0.3);
}
.register-page.dark .flat-character.error {
  background: linear-gradient(135deg, rgba(153, 27, 27, 0.4) 0%, rgba(153, 27, 27, 0.1) 100%);
  border-color: rgba(220, 38, 38, 0.3);
}
.flat-character.error .char-pupil {
  transform: translate(0, 8px);
}
.flat-character.error .char-mouth {
  width: 16px;
  height: 20px;
  background: #1a1a2e;
  border-radius: 50%;
  margin-top: 15px;
  border: none;
}
.character-medium.error .char-mouth {
  width: 12px;
  height: 16px;
  margin-top: 18px;
}
.character-small.error .char-mouth {
  width: 8px;
  height: 10px;
  margin-top: 12px;
}

/* --- DURUM: BOŞ ALAN VAR (SİNİRLİ) --- */
.flat-character.angry {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.6) 0%, rgba(239, 68, 68, 0.2) 100%);
  border-color: rgba(185, 28, 28, 0.5);
  animation-duration: 2s;
}
.register-page.dark .flat-character.angry {
  background: linear-gradient(135deg, rgba(185, 28, 28, 0.5) 0%, rgba(153, 27, 27, 0.2) 100%);
  border-color: rgba(220, 38, 38, 0.4);
}
.flat-character.angry .char-eye {
  border-radius: 10px 10px 50px 50px;
  height: 60%;
  margin-top: 10px;
}
.flat-character.angry .char-pupil {
  transform: translate(0, 0) scale(0.7);
}
.flat-character.angry .char-mouth {
  width: 22px;
  height: 6px;
  background: transparent;
  border-top: 4px solid #1a1a2e;
  border-radius: 50% 50% 0 0;
  margin-top: 10px;
  transform: rotate(5deg);
}
.character-medium.angry .char-mouth {
  width: 18px;
  border-top-width: 3px;
  margin-top: 12px;
}
.character-small.angry .char-mouth {
  width: 14px;
  border-top-width: 2px;
  margin-top: 8px;
}

/* Karanlık mod ağız renkleri */
.register-page.dark .char-mouth,
.register-page.dark .flat-character.error .char-mouth {
  background: #f1f5f9;
}
.register-page.dark .flat-character.angry .char-mouth {
  background: transparent;
  border-top-color: #f1f5f9;
}

/* Daha Akıcı Blob Şekilleri Yüzme Animasyonları */
@keyframes blob-float-1 {
  0%,
  100% {
    transform: translateY(0);
    border-radius: 40% 60% 50% 50% / 50% 40% 60% 50%;
  }
  33% {
    transform: translateY(-8px);
    border-radius: 60% 40% 60% 40% / 40% 60% 40% 60%;
  }
  66% {
    transform: translateY(-15px);
    border-radius: 50% 50% 40% 60% / 60% 50% 50% 40%;
  }
}
@keyframes blob-float-2 {
  0%,
  100% {
    transform: translateY(0);
    border-radius: 60% 40% 50% 50% / 40% 50% 50% 60%;
  }
  33% {
    transform: translateY(-12px);
    border-radius: 50% 50% 40% 60% / 50% 40% 60% 50%;
  }
  66% {
    transform: translateY(-20px);
    border-radius: 40% 60% 60% 40% / 60% 50% 40% 50%;
  }
}
@keyframes blob-float-3 {
  0%,
  100% {
    transform: translateY(0);
    border-radius: 50% 50% 60% 40% / 60% 40% 50% 50%;
  }
  33% {
    transform: translateY(-5px);
    border-radius: 40% 60% 50% 50% / 50% 60% 40% 50%;
  }
  66% {
    transform: translateY(-10px);
    border-radius: 60% 40% 40% 60% / 40% 50% 60% 40%;
  }
}

@media (max-width: 900px) {
  .register-right {
    display: none;
  }
}
</style>
