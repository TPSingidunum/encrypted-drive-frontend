<script setup lang="ts">
import ProfileDropdown from '@/views/layouts/main/ProfileDropdown.vue'
import { ref } from 'vue'
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[]>([
  { label: 'My Drive', icon: 'i-lucide-folder', to: '/' },
  { label: 'Shared', icon: 'i-lucide-users', to: '/login' },
  { label: 'Recent', icon: 'i-lucide-clock', to: '/login' },
  { label: 'Trash', icon: 'i-lucide-trash', to: '/login' }
])
</script>

<template>
  <header class="grid grid-cols-3 items-center pl-6 pr-2 h-16 border-b border-gray-200">
    <UIcon name="i-lucide-file-lock-2" class="size-6" />
    <UNavigationMenu :items="items" class="w-full justify-center" />
    <div class="flex justify-end">
      <ProfileDropdown />
    </div>
  </header>
</template>
