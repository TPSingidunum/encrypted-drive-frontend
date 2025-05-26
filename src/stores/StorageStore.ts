import { defineStore } from 'pinia'

export const userStorageStore = defineStore('storage', {
  state: () => ({
    currentWorkspace: null as number | null,
    currentFolder: null as number | null,
    previousFolder: null as number | null,
  }),

  actions: {
    setCurrentWorkspace(workspaceId: number) {
      this.currentWorkspace = workspaceId
    },
    setCurrentFolder(id: number) {
      this.currentFolder = id
    },
    setPrevFolder(id: number) {
      this.previousFolder = id;
    },
  },

  getters: {
    getCurrentWorkspace: (state) => state.currentWorkspace,
    getCurrentFolder: (state) => state.currentFolder,
    getPreviousFolder: (state) => state.previousFolder,
  },
})
