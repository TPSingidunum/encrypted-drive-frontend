<script setup lang="ts">
type Props = {
  name: string
  icon?: string
}
const props = defineProps<Props>()
const icon = props.icon || 'i-lucide-file'
</script>

<template>
  <div
    class="flex flex-col items-center p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded hover:shadow transition dark:hover:shadow-gray-900">
    <UIcon :name="icon" size="xl" />
    <span class="mt-2 text-sm truncate">{{ name }}</span>
  </div>
</template>
