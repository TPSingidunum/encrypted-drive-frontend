import { defineStore } from 'pinia'

export type UploadStatus = 'uploading' | 'processing' | 'success' | 'error'

export interface UploadEntry {
  id: number
  name: string
  progress: number
  status: UploadStatus
}

export const userStorageStore = defineStore('storage', {
  state: () => ({
    currentWorkspace: null as number | null,
    currentFolder: null as number | null,
    previousFolder: null as number | null,
    uploads: [] as UploadEntry[],
    counter: 0,
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
    addUpload(name: string) {
      const id = ++this.counter
      this.uploads.push({ id, name, progress: 0, status: 'uploading' })
      return id
    },
    updateProgress(id: number, progress: number) {
      const entry = this.uploads.find((u) => u.id === id)
      if (entry) entry.progress = progress
    },
    setStatus(id: number, status: UploadStatus) {
      const entry = this.uploads.find((u) => u.id === id)
      if (entry) entry.status = status
    },
    clear() {
      this.uploads = []
    },
  },

  getters: {
    getCurrentWorkspace: (state) => state.currentWorkspace,
    getCurrentFolder: (state) => state.currentFolder,
    getPreviousFolder: (state) => state.previousFolder,
  },
})
