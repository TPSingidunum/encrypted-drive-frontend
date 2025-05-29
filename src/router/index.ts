import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import { verifyToken, getUserInformation } from '@/services/AuthService'
import ProfileView from '@/views/pages/profile/ProfileView.vue'
import { useUserStore } from '@/stores/UserStore'

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

    // Check if user store has data
    const userStore = useUserStore()
    if (!userStore.getUsername) {
      try {
        // Fetch user information and update store
        const userData = await getUserInformation()
        userStore.setUser(userData)
      } catch (error) {
        console.error('Failed to load user data:', error)
        // Continue navigation even if user data fetch fails
      }
    }
  }

  return next()
})

export default router
