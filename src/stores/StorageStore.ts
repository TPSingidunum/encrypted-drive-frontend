import { defineStore } from 'pinia'

export const userStorageStore = defineStore('storage', {
  state: () => ({
    currentWorkspace: null as number | null,
  }),

  actions: {
    setCurrentWorkspace(workspaceId: number) {
      this.currentWorkspace = workspaceId
    },
  },

  getters: {
    getCurrentWorkspace: (state) => state.currentWorkspace,
  },
})
