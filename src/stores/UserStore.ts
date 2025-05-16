import type { User } from '@/types/User'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {} as User,
  }),

  actions: {
    setUser(newUser: User) {
      this.user = newUser
    },
  },

  getters: {
    getUsername: (state) => state.user.username,
    getEmail: (state) => state.user.email,
    getRole: (state) => state.user.role,
    getUser: (state) => state.user,
  },
})
