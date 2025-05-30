<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import { getWorkspaces, getWorkspaceChildren, download, getFolderChildren } from '@/services/StorageService'
import type { Workspace } from '@/types/Workspace'
import type { Children } from '@/types/Children'
import { userStorageStore } from '@/stores/StorageStore'
import type { StorageRow } from '@/types/StorageRow'
import { downloadDecrypted } from '@/services/MiddlewareService'

const view = ref<'grid' | 'list'>('list')
const workspaces = ref<Workspace[]>([])
const dropdownWorkspaces = ref<{ label: string, value: number }[]>([]);
const selectedWorkspace = ref();
const rows = ref();
const storageStore = userStorageStore();
const loading = ref(false);

function toggleLoading() {
  loading.value = !loading.value;
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
    parentId: folder.parentId ?? 0,
    createdAt: folder.createAt,
    updatedAt: folder.updateAt
  }))

  const fileRows = children.files.map(file => ({
    id: file.fileId,
    name: file.name,
    type: 'File',
    size: '-',
    parentId: file.parentId ?? 0,
    createdAt: file.createAt,
    updatedAt: file.updateAt
  }))

  rows.value = [...folderRows, ...fileRows]
}

onMounted(async () => {
  await fetchWorkspaces()
})

async function fetchWorkspaces() {
  toggleLoading();
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
  toggleLoading();
}

async function fetchWorkspaceChildren(workspaceId: number) {
  toggleLoading();
  try {
    const result = await getWorkspaceChildren(workspaceId);
    storageStore.setCurrentFolder(0)
    storageStore.setPrevFolder(0)
    setRows(result);
  } catch (error) {
    console.error('Failed to fetch workspace children:', error);
  }
  toggleLoading();
}

async function fetchFolderChildren(folderId: number, parentId: number | null = null) {
  toggleLoading();
  try {
    const result = await getFolderChildren(folderId);
    storageStore.setCurrentFolder(folderId)
    storageStore.setPrevFolder(parentId == null ? 0 : parentId);

    result.folders.unshift({ folderId: storageStore.getPreviousFolder!, name: "..", parentId: 0 })
    setRows(result);
  } catch (error) {
    console.error('Failed to fetch folder children:', error);
  }
  toggleLoading();
}

function refresh() {
  toggleLoading();
  if (storageStore.getCurrentFolder === 0) {
    fetchWorkspaceChildren(selectedWorkspace.value.value);
  } else {
    fetchFolderChildren(storageStore.getCurrentFolder!);
  }
  toggleLoading();
}

async function openFolder(folderId: number, parentId: number | null = null) {
  try {
    if (folderId === 0) {
      await fetchWorkspaceChildren(selectedWorkspace.value.value)
    } else {
      await fetchFolderChildren(folderId, parentId)
    }
  } catch (error) {
    console.error('Failed to fetch workspace children:', error);
  }
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
        onSelect: () => {
          if (item.type === 'Folder') {
            openFolder(item.id, item.parentId)
          } else {
            viewFile(item.id, item.name)
          }
        }
      },
      {
        label: 'Download',
        icon: 'i-lucide-download',
        onSelect: async () => {
          if (item.type === 'Folder') {
            return
          } else {
            // await download(item.id);
            await downloadDecrypted(item.id, "tpetrovic");
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
watch(selectedWorkspace, (wsId, _old) => {
  storageStore.setCurrentWorkspace(wsId.value)
  fetchWorkspaceChildren(wsId.value)
})

</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-4">
      <div class="flex space-x-2">
        <USelectMenu v-model="selectedWorkspace" :items="dropdownWorkspaces" placeholder="Select Workspace" class="w-[200px] cursor-pointer" />
        <UButton icon="i-lucide-grid" variant="outline" class="cursor-pointer" @click="view = 'grid'" :active="view === 'grid'" />
        <UButton icon="i-lucide-list" variant="outline" class="cursor-pointer" @click="view = 'list'" :active="view === 'list'" />
      </div>
      <div class="flex space-x-2">
        <CreateFolderModal @created="refresh" />
        <FileUploadModal @uploaded="refresh"/>
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

    <div v-else class="flex justify-center">
      <UTable
        :columns="columns"
        :data="rows"
        :loading="loading"
        striped
        hoverable
        scrollable
        :ui="{ tr: 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer' } "
        class="w-[95%] max-h-[600px]"
        >
        <template #name-cell="{ row }">
          <div
          :class="[
            'flex items-center gap-2 select-none',
            row.original.type === 'Folder' ? 'cursor-pointer' : ''
          ]"
            @click="row.original.type === 'Folder' ? openFolder(row.original.id, row.original.parentId) : viewFile(row.original.id, row.original.name)"
          >
            <UIcon :name="row.original.type === 'Folder' ? 'i-lucide-folder' : 'i-lucide-file'" class="size-5" />
            <span class="text-black dark:text-white">{{ row.original.name }}</span>
          </div>
        </template>
        <!-- Actions dropdown cell -->
        <template #actions-cell="{ row }">
          <!-- TODO: Add open and close state to dropdown -->
          <UDropdownMenu :items="getActions(row.original)">
            <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" size="sm" aria-label="Actions" />
          </UDropdownMenu>
        </template>
      </UTable>
    </div>
    <UploadQueue />
  </div>
</template>
