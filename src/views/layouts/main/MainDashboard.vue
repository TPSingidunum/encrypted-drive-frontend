<script setup lang="ts">
import TopNav from '@/views/layouts/main/TopNav.vue'
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
    <TopNav />
    <main class="p-6 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>
