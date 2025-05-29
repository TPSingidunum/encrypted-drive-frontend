import { defineStore } from 'pinia'
import { uploadFile } from '@/services/StorageService'

export type UploadStatus = 'queued' | 'uploading' | 'processing' | 'success' | 'error'

export interface UploadEntry {
  id: number
  name: string
  progress: number
  status: UploadStatus
  file?: File
  workspaceId?: number
  folderId?: number
}

export const userStorageStore = defineStore('storage', {
  state: () => ({
    currentWorkspace: null as number | null,
    currentFolder: null as number | null,
    previousFolder: null as number | null,
    uploads: [] as UploadEntry[],
    counter: 0,
    isUploading: false,
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

    addToQueue(file: File) {
      const id = ++this.counter
      this.uploads.push({
        id,
        name: file.name,
        progress: 0,
        status: 'queued',
        file: file,
        workspaceId: this.currentWorkspace!,
        folderId: this.currentFolder!
      })

      // Start processing the queue if we're not already uploading
      if (!this.isUploading) {
        this.processQueue()
      }

      return id
    },

    async processQueue() {
      if (this.isUploading) return

      const nextUpload = this.uploads.find(u => u.status === 'queued')
      if (!nextUpload) return

      this.isUploading = true

      try {
        // Update status to uploading
        nextUpload.status = 'uploading'

        // Process the upload
        const _result = await uploadFile(
          nextUpload.workspaceId!,
          nextUpload.folderId!,
          nextUpload.file!,
          (progress) => {
            this.updateProgress(nextUpload.id, progress)
            if (progress >= 100) {
              this.setStatus(nextUpload.id, 'processing')
            }
          }
        )

        // Update status to success
        this.setStatus(nextUpload.id, 'success')

        // Clean up the file reference to free memory
        const index = this.uploads.findIndex(u => u.id === nextUpload.id)
        if (index !== -1) {
          delete this.uploads[index].file
        }
      } catch (error) {
        console.error('Upload failed:', error)
        this.setStatus(nextUpload.id, 'error')
      } finally {
        this.isUploading = false

        // Process next in queue
        this.processQueue()
      }
    },

    updateProgress(id: number, progress: number) {
      const entry = this.uploads.find((u) => u.id === id)
      if (entry) entry.progress = progress
    },

    setStatus(id: number, status: UploadStatus) {
      const entry = this.uploads.find((u) => u.id === id)
      if (entry) entry.status = status
    },

    updateUpload(index: number, updatedItem: UploadEntry) {
      if (index >= 0 && index < this.uploads.length) {
        this.uploads[index] = updatedItem
      }
    },

    clear() {
      // Only clear completed uploads
      this.uploads = this.uploads.filter(
        u => u.status === 'uploading' || u.status === 'queued' || u.status === 'processing'
      )
    },
  },

  getters: {
    getCurrentWorkspace: (state) => state.currentWorkspace,
    getCurrentFolder: (state) => state.currentFolder,
    getPreviousFolder: (state) => state.previousFolder,
  },
})
