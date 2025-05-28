<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useColorMode } from '@vueuse/core'
import { useRouter } from 'vue-router'

const colorMode = useColorMode()
const router = useRouter()
const isDarkMode = ref(colorMode.value === 'dark')

watch(isDarkMode, (newValue) => {
  colorMode.value = newValue ? 'dark' : 'light'
})


function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  router.push('/login')
}

const items = computed(() => [
  [
    { label: 'Profile', icon: 'i-lucide-user', to: '/profile' },
  ],
  [
    {
      label: 'Appearance',
      icon: 'i-lucide-palette',
      type: 'label' as const
    },
    {
      type: 'separator' as const
    },
    {
      label: 'Dark Mode',
      icon: 'i-lucide-moon',
      class: 'cursor-pointer',
      type: 'checkbox' as const,
      checked: isDarkMode.value,
      onUpdateChecked(checked: boolean) {
        isDarkMode.value = checked
      },
      onSelect(e: Event) {
        e.preventDefault()
      }
    }
  ],
  [
    {
      label: 'Log out',
      icon: 'i-lucide-log-out',
      onSelect: () => logout(),
    }
  ]
])
</script>

<template>
  <UDropdownMenu :items="items" :ui="{ content: 'w-48' }">
    <div
      class="flex items-center space-x-3 px-4 py-2 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-xl dark:bg-gray-800 dark:hover:bg-gray-700">
      <UAvatar src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" size="md" />
      <div class="flex flex-col text-left">
        <span class="text-sm font-bold">Teodor Petrovic</span>
        <span class="text-xs text-gray-500 dark:text-gray-400">teodor.z.petrovic@gmail.com</span>
      </div>
    </div>
  </UDropdownMenu>
</template>
