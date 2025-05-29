<script setup lang="ts">
import { ref } from 'vue'
import CreateFolderModal from './CreateFolderModal.vue'
import FileUploadModal from './FileUploadModal.vue'

const open = ref(false)
const emit = defineEmits(['uploaded', 'created'])

function onCreated() {
  emit('created')
  open.value = false
}

function onUploaded() {
  emit('uploaded')
  open.value = false
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
    <div v-show="open" class="flex flex-col items-end space-y-2 mb-2">
      <CreateFolderModal @created="onCreated" />
      <FileUploadModal @uploaded="onUploaded" />
    </div>
    <UButton icon="i-lucide-plus" size="xl" class="rounded-full cursor-pointer" @click="open = !open" />
  </div>
</template>
