<script setup lang="ts">
const props = defineProps<{ name: string }>()
</script>

<template>
  <div
    class="flex flex-col items-center p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded hover:shadow transition cursor-pointer dark:hover:shadow-gray-900">
    <UIcon name="i-lucide-folder" size="xl" />
    <span class="mt-2 text-sm truncate">{{ name }}</span>
  </div>
</template>
