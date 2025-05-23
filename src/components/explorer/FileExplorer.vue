<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import { getWorkspaces, getWorkspaceChildren, download } from '@/services/StorageService'
import type { Workspace } from '@/types/Workspace'
import type { Children } from '@/types/Children'
import { userStorageStore } from '@/stores/StorageStore'

const view = ref<'grid' | 'list'>('list')
const workspaces = ref<Workspace[]>([])
const dropdownWorkspaces = ref<{ label: string, value: number }[]>([]);
const selectedWorkspace = ref();
const rows = ref();
const storageStore = userStorageStore();

export interface StorageRow {
  id: number
  name: string
  type: 'Folder' | 'File'
  size: string
  createdAt: string
  updatedAt: string
}

const columns = ref<TableColumn<StorageRow>[]>([
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'size', header: 'Size' },
  { id: 'actions', header: '' }
])

function setRows(children: Children) {
  const folderRows = children.folders.map(folder => ({
    id: folder.folderId,
    name: folder.name,
    type: 'Folder',
    size: '-',
    createdAt: folder.createAt,
    updatedAt: folder.updateAt
  }))

  const fileRows = children.files.map(file => ({
    id: file.fileId,
    name: file.name,
    type: 'File',
    size: '-',
    createdAt: file.createAt,
    updatedAt: file.updateAt
  }))

  rows.value = [...folderRows, ...fileRows]
}

// Fetch workspaces on component mount
onMounted(async () => {
  await fetchWorkspaces()
})

async function fetchWorkspaces() {
  try {
    const result = await getWorkspaces();
    workspaces.value = result;
    dropdownWorkspaces.value = result.map(workspace => ({
      label: workspace.name,
      value: workspace.workspaceId,
    }))

    selectedWorkspace.value = dropdownWorkspaces.value[0]
    storageStore.setCurrentWorkspace(dropdownWorkspaces.value[0].value)

    await fetchWorkspaceChildren(selectedWorkspace.value.value)
  } catch (error) {
    console.error('Failed to fetch workspaces:', error)
  }
}

async function fetchWorkspaceChildren(workspaceId: number) {
  try {
    const result = await getWorkspaceChildren(workspaceId);
    setRows(result);
  } catch (error) {
    console.error('Failed to fetch workspace children:', error);
  }
}

function onWorkspaceSelected(workspace: { label: string, value: number }) {
  if (selectedWorkspace.value === workspace) {
    return
  }

  selectedWorkspace.value = workspace;
  storageStore.setCurrentWorkspace(workspace.value)

  fetchWorkspaceChildren(workspace.value);
}

function refresh() {
  if (selectedWorkspace.value) {
    fetchWorkspaceChildren(selectedWorkspace.value.value);
  }
}

async function openFolder(folderId: number) {
  console.log("Opening folder with ID:", folderId);
}

function viewFile(fileId: number, fileName: string) {
  console.log(`Viewing file: ${fileName} (ID: ${fileId})`);
}

function getActions(item: StorageRow): DropdownMenuItem[][] {
  return [
    [
      {
        label: item.type === 'Folder' ? 'Open' : 'View',
        icon: item.type === 'Folder' ? 'i-lucide-folder-open' : 'i-lucide-eye',
        onSelect: (e: Event) => {
          e.preventDefault()
          if (item.type === 'Folder') {
            openFolder(item.id)
          } else {
            viewFile(item.id, item.name)
          }
        }
      },
      {
        label: 'Download',
        icon: 'i-lucide-download',
        onSelect: async (e: Event) => {
          e.preventDefault()
          if (item.type === 'Folder') {
            return
          } else {
            await download(item.id);
          }
        }
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
        <USelectMenu v-model="selectedWorkspace" :items="dropdownWorkspaces" placeholder="Select Workspace"
          class="w-[200px] cursor-pointer" @update:model-value="onWorkspaceSelected(selectedWorkspace)" />
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
      <!-- <FolderCard
        v-for="folder in children.folder"
        :key="folder.folderId"
        :name="folder.name"
      />
      <FileCard
        v-for="file in children.file"
        :key="file.fileId"
        :name="file.name"
      /> -->
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
