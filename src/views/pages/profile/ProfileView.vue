<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ProfileUserInfo from './ProfileUserInfo.vue';
import ProfileKeyManager from './ProfileKeyManager.vue';
import { checkMiddlewareStatus } from '@/services/MiddlewareService';
import MainDashboard from '@/views/layouts/main/MainDashboard.vue';

const middlewareConnected = ref(false);
const toast = useToast();

onMounted(async () => {
  await checkMiddleware();
});

async function checkMiddleware() {
  middlewareConnected.value = await checkMiddlewareStatus();

  if (!middlewareConnected.value) {
    toast.add({
      title: 'Middleware Not Connected',
      description: 'Certificate management features will be unavailable.',
      color: 'warning',
      icon: 'i-lucide-alert-triangle',
    });
  }
}

</script>

<template>
  <MainDashboard>
    <div class="container mx-auto px-4 py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Profile Settings</h1>
        <UButton v-if="!middlewareConnected" color="warning" icon="i-lucide-refresh-cw" @click="checkMiddleware">
          Retry Middleware Connection
        </UButton>
      </div>

      <UTabs :items="[
        {
          label: 'User Information',
          slot: 'userInfo',
          icon: 'i-lucide-user',
        },
        {
          label: 'Certificate Management',
          slot: 'keyManager',
          icon: 'i-lucide-key',
          disabled: !middlewareConnected
        }
      ]">
        <template #userInfo>
          <ProfileUserInfo />
        </template>

        <template #keyManager>
          <ProfileKeyManager />
        </template>
      </UTabs>
    </div>
  </MainDashboard>
</template>
