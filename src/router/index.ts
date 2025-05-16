import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { requiredAuth: true } },
    { path: '/login', name: 'login', component: LoginView },
  ],
})

router.beforeEach((to, _from, next) => {
  if (to.meta.requiredAuth) {
    const token = localStorage.getItem('access_token')
    if (!token) {
      return next({ name: 'login' })
    } else {
      return next()
    }
  }

  return next()
})

export default router
