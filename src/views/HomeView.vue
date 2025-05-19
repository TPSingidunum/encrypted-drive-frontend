<script setup lang="ts">
import { getAllUsers } from '@/services/UserService';
import MainDashboard from '@/views/layouts/main/MainDashboard.vue'

async function getAll() {
  const result = await getAllUsers();
  console.log(JSON.stringify(result, null, 2))
}


</script>

<template>
  <MainDashboard>
    <UButton @click="getAll">Hello</UButton>
    <FileExplorer />
  </MainDashboard>
</template>
