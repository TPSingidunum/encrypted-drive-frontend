<script setup lang="ts">
import { ref, reactive } from 'vue'
import { createFolder } from '@/services/StorageService'
import { userStorageStore } from '@/stores/StorageStore'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const emit = defineEmits(['created'])
const isOpen = ref(false)

const schema = z.object({
  name: z.string().min(1, 'Folder name is required'),
})
type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({
  name: '',
})
const storageStore = userStorageStore()

function closeModal() {
  isOpen.value = false
  state.name = ''
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const result = await createFolder({
      name: event.data.name,
      workspaceId: storageStore.getCurrentWorkspace!,
      parentId: storageStore.getCurrentFolder!,
    })

    if (result) {
    emit('created')
    closeModal()
    }

  } catch (err) {
    console.error('Create folder error:', err)
  }
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    title="Create Folder"
    :ui="{ content: 'w-[400px]' }"
    :close="{ class: 'cursor-pointer' }"
    description="What name do you want to give this folder?"
  >
    <UButton
      icon="i-lucide-folder-plus"
      label="New Folder"
      color="primary"
      class="cursor-pointer"
      @click="isOpen = true"
    />
    <template #body>
      <UForm :state="state" :schema="schema" class="p-4 space-y-4" @submit="onSubmit">
        <UFormField label="Folder Name" name="folderName">
          <UInput v-model="state.name" placeholder="Folder name" class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton color="error" class="cursor-pointer" @click="closeModal">Cancel</UButton>
          <UButton type="submit" color="primary" class="cursor-pointer" loading-auto>Create</UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
