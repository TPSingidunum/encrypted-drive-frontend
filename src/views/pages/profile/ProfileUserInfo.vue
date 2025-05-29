<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import { getCurrentPublicKey } from '@/services/AuthService';

const userStore = useUserStore();
const loading = ref(false);
const hasRegisteredKey = ref(false);

onMounted(async () => {
  await checkExistingKey();
});

async function checkExistingKey() {
  try {
    loading.value = true;
    const result = await getCurrentPublicKey();
    hasRegisteredKey.value = result.success;
  } catch (error) {
    console.error('Error checking existing key:', error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="space-y-6">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">User Information</h3>
          <UBadge v-if="hasRegisteredKey" color="success">Certificate Registered</UBadge>
          <UBadge v-else color="warning">No Certificate Registered</UBadge>
        </div>
      </template>

      <USkeleton v-if="loading" class="h-32" />

      <div v-else class="space-y-4">
        <div class="flex items-center space-x-4">
          <UAvatar
            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            size="xl"
          />
          <div>
            <h4 class="text-xl font-semibold">{{ userStore.getUsername }}</h4>
            <p class="text-gray-500">{{ userStore.getEmail }}</p>
          </div>
        </div>

        <USeparator />

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Role</p>
            <p class="capitalize">{{ userStore.getRole || 'User' }}</p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
