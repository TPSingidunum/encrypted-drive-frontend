<script setup lang="ts">
import { computed, ref } from 'vue'
import UploadItem from './UploadItem.vue'
import { userStorageStore } from '@/stores/StorageStore'

const storageStore = userStorageStore()
const minimized = ref(false)

const canClose = computed(() =>
  storageStore.uploads.every((u) => u.status !== 'uploading' && u.status !== 'processing'),
)

function close() {
  if (canClose.value) storageStore.clear()
}
</script>

<template>
  <div v-if="storageStore.uploads.length" class="fixed bottom-6 right-6 w-72 bg-white dark:bg-gray-800 border rounded shadow-lg z-50">
    <div class="flex justify-between items-center px-3 py-2 border-b">
      <span class="font-semibold">Uploads</span>
      <div class="flex space-x-1">
        <UButton icon="i-lucide-minus" size="xs" variant="ghost" class="cursor-pointer" @click="minimized = !minimized" />
        <UButton icon="i-lucide-x" size="xs" variant="ghost" class="cursor-pointer" :disabled="!canClose" @click="close" />
      </div>
    </div>
    <div v-show="!minimized" class="max-h-60 overflow-y-auto divide-y">
      <UploadItem v-for="item in storageStore.uploads" :key="item.id" :item="item" />
    </div>
  </div>
</template>
