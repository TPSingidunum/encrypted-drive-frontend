<script setup lang="ts">
import type { UploadEntry } from '@/stores/StorageStore';
import { computed } from 'vue'

const props = defineProps<{ item: UploadEntry }>()

const statusText = computed(() => {
  if (props.item.status === 'uploading') return 'Uploading'
  if (props.item.status === 'processing') return 'Processing'
  if (props.item.status === 'success') return 'Success'
  return 'Error'
})
</script>

<template>
  <div class="p-2 flex items-center space-x-2">
    <UIcon name="i-lucide-file" class="shrink-0" />
    <div class="flex-1 overflow-hidden">
      <div class="text-sm truncate">{{ item.name }}</div>
      <div class="mt-1">
        <UProgress v-if="item.status === 'uploading'" :value="item.progress" />
        <span v-else class="text-xs">{{ statusText }}</span>
      </div>
    </div>
  </div>
</template>
