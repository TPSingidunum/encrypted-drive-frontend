<script setup lang="ts">
import { uploadFile } from '@/services/StorageService'
import { ref } from 'vue'
import { z } from 'zod'
import { userStorageStore } from '@/stores/StorageStore'

const emit = defineEmits(['uploaded'])
const isOpen = ref(false)
const uploading = ref(false)
const selectedFile = ref<File | null>(null)
const fileError = ref('')
const schema = z.object({})
const state = ref({})
const storageStore = userStorageStore()

function closeModal() {
  isOpen.value = false
  resetForm()
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  fileError.value = ''

  if (input.files && input.files.length > 0) {
    const file = input.files[0]

    // Validate file size (20MB max)
    if (file.size > 2000 * 1024 * 1024) {
      fileError.value = 'File must be smaller than 2000MB'
      return
    }

    selectedFile.value = file
  } else {
    selectedFile.value = null
  }
}

function removeFile() {
  selectedFile.value = null
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

async function onSubmit() {
  if (!selectedFile.value) {
    fileError.value = 'Please select a file'
    return
  }

  try {
    uploading.value = true

    const id = storageStore.addUpload(selectedFile.value.name)

    const result = await uploadFile(
      storageStore.getCurrentWorkspace!,
      storageStore.getCurrentFolder!,
      selectedFile.value,
      (p) => {
        storageStore.updateProgress(id, p)
        if (p >= 100) {
          storageStore.setStatus(id, 'processing')
        }
      },
    )
    storageStore.setStatus(id, 'success')
    console.log(JSON.stringify(result, null, 2))

    closeModal()
    emit('uploaded')
  } catch (error) {
    console.error('Upload error:', error)
  } finally {
    uploading.value = false
  }
}

function resetForm() {
  selectedFile.value = null
  fileError.value = ''
}
</script>

<template>
  <UModal v-model:open="isOpen" title="Upload New File" :ui="{ content: 'w-[400px]' }"
    :close="{ class: 'cursor-pointer' }" description="Choose a file to upload">
    <!-- Button that opens the modal -->
    <UButton icon="i-lucide-upload" label="Upload File" color="success" class="cursor-pointer" @click="isOpen = true" />

    <!-- Modal content -->
    <template #body>
      <UForm :state="state" :schema="schema" class="p-4 flex flex-col items-center">
        <div class="space-y-2 w-full max-w-md">
          <label class="block text-sm font-medium text-gray-700">
            Select File <span class="text-red-500">*</span>
          </label>
          <UInput type="file" @change="handleFileChange" class="w-full cursor-pointer"
            :class="{ 'border-red-500': fileError }" />
          <p v-if="fileError" class="text-sm text-red-500">{{ fileError }}</p>
        </div>

        <div v-if="selectedFile" class="border rounded p-2 bg-gray-50 mt-4 w-full max-w-md">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <UIcon name="i-lucide-file" />
              <span class="text-sm truncate max-w-[200px]">
                {{ selectedFile.name }}
              </span>
            </div>
            <UButton color="warning" class="cursor-pointer" variant="ghost" icon="i-lucide-x" size="xs"
              @click="removeFile" />
          </div>
          <div class="text-xs text-gray-500 mt-1">
            Size: {{ formatFileSize(selectedFile.size) }}
          </div>
        </div>
      </UForm>
    </template>

    <!-- Modal footer -->
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="error" class="cursor-pointer" @click="closeModal">
          Cancel
        </UButton>
        <UButton color="primary" class="cursor-pointer" :loading="uploading" :disabled="!selectedFile"
          @click="onSubmit">
          Upload
        </UButton>
      </div>
    </template>
  </UModal>
</template>
