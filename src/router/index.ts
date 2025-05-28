import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import { verifyToken } from '@/services/AuthService'
import ProfileView from '@/views/pages/profile/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { requiredAuth: true } },
    { path: '/profile', name: 'profile', component: ProfileView, meta: { requiredAuth: true } },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
  ],
})

router.beforeEach(async (to, _from, next) => {
  if (to.meta.requiredAuth) {
    const isValid = await verifyToken();
    if (!isValid) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      return next({ name: 'login' })
    }
  }

  return next()
})

export default router
