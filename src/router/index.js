// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    // Dashboard olmadığı için ana dizine gelen kullanıcıyı direkt Login'e yönlendiriyoruz
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { requiresGuest: true },
  },
  {
    // Modülü kullanacak kişi eğer kendi dashboard/home sayfasını eklemek isterse:
    path: '/dashboard',
    name: 'Dashboard',

    component: () => import('@/views/LoginView.vue'), // Geçici olarak hata vermemesi için LoginView'a bağladık
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Eğer kullanıcı zaten giriş yapmışsa ve yine login/register'a gitmeye çalışırsa
    // buradaki yönlendirmeyi `/dashboard` yerine `/` (yani login'e, o da otomatik ana mantığa) bırakabiliriz
    next()
  } else {
    next()
  }
})

export default router
