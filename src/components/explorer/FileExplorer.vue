<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'

const view = ref<'grid' | 'list'>('list')
const folders = ref<string[]>(['Documents', 'Pictures', 'Videos'])
const files = ref<string[]>(['Report.pdf', 'Photo.png', 'Video.mp4'])

interface TableColumProps {
  accessorKey?: string
  header?: string
  id?: string
}

const columns = ref<TableColumn<TableColumProps>[]>([
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'size', header: 'Size' },
  { id: 'actions', header: '' }
])

// Combine folders and files into table rows
const rows = computed(() => {
  const folderRows = folders.value.map(name => ({ name, type: 'Folder', size: '-' }))
  const fileRows = files.value.map(name => ({ name, type: 'File', size: '-' }))
  return [...folderRows, ...fileRows]
})

function refresh() {
  // TODO: fetch updated folders and files
}

// Generate dropdown actions per item
function getActions(item: { name: string; type: string; size: string }): DropdownMenuItem[][] {
  return [
    [
      {
        label: item.type === 'Folder' ? 'Open' : 'View',
        icon: item.type === 'Folder' ? 'i-lucide-folder-open' : 'i-lucide-eye'
      }
    ],
    [
      { label: 'Rename', icon: 'i-lucide-edit' },
      { label: 'Delete', icon: 'i-lucide-trash', color: 'error' }
    ]
  ]
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- View Controls -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex space-x-2">
        <UButton icon="i-lucide-grid" variant="outline" class="cursor-pointer" @click="view = 'grid'"
          :active="view === 'grid'" />
        <UButton icon="i-lucide-list" variant="outline" class="cursor-pointer" @click="view = 'list'"
          :active="view === 'list'" />
      </div>
      <div class="flex space-x-2">
        <FileUploadModal />
        <UButton icon="i-lucide-refresh-ccw" class="cursor-pointer" variant="outline" @click="refresh" />
      </div>
    </div>

    <!-- Grid View -->
    <div v-if="view === 'grid'" class="grid grid-cols-4 gap-4">
      <FolderCard v-for="folder in folders" :key="folder" :name="folder" />
      <FileCard v-for="file in files" :key="file" :name="file" />
    </div>

    <!-- List View as Table -->
    <div v-else class="flex justify-center">
      <UTable :columns="columns" :data="rows" striped hoverable scrollable class="w-[95%]">
        <!-- Icon + Name cell -->
        <template #name-cell="{ row }">
          <div class="flex items-center gap-2">
            <UIcon :name="row.original.type === 'Folder' ? 'i-lucide-folder' : 'i-lucide-file'" class="size-5" />
            <span>{{ row.original.name }}</span>
          </div>
        </template>
        <!-- Actions dropdown cell -->
        <template #actions-cell="{ row }">
          <UDropdownMenu :items="getActions(row.original)">
            <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" size="sm" aria-label="Actions" />
          </UDropdownMenu>
        </template>
      </UTable>
    </div>
  </div>
</template>
