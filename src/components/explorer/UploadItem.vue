<script setup lang="ts">
import type { UploadEntry } from '@/stores/StorageStore';
import { computed } from 'vue'
import { userStorageStore } from '@/stores/StorageStore'

const props = defineProps<{ item: UploadEntry }>()
const storageStore = userStorageStore()

const statusText = computed(() => {
  if (props.item.status === 'queued') return 'Queued'
  if (props.item.status === 'uploading') return 'Uploading'
  if (props.item.status === 'processing') return 'Processing'
  if (props.item.status === 'success') return 'Success'
  return 'Error'
})

const progress = computed({
  get: () => props.item.progress,
  set: (newValue) => {
    // This setter is needed for v-model to work
    const index = storageStore.uploads.findIndex(u => u.id === props.item.id)
    if (index !== -1) {
      storageStore.updateProgress(props.item.id, newValue)
    }
  }
})
</script>

<template>
  <div class="p-2 flex items-center space-x-2">
    <UIcon name="i-lucide-file" class="shrink-0" />
    <div class="flex-1 overflow-hidden">
      <div class="text-sm truncate">{{ item.name }}</div>
      <div class="mt-1">
        <UProgress v-if="item.status === 'queued' || item.status === 'uploading' || item.status === 'processing'"
                  v-model="progress"
                  :color="item.status === 'queued' ? 'neutral' : 'primary'"
                  status />
        <span class="text-xs">{{ statusText }}</span>
      </div>
    </div>
  </div>
</template>
