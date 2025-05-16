<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore';

const userStore = useUserStore();
</script>

<template>
  <main>
    <h1>Hello {{ userStore.getUsername }}</h1>
    <div>
      <UButton>Button</UButton>
    </div>
  </main>
</template>
