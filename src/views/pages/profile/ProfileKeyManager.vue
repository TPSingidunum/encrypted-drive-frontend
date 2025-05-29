<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCertificates, getPublicKey } from '@/services/MiddlewareService';
import { registerPublicKey } from '@/services/AuthService';
import type { Certificate } from '@/services/MiddlewareService';

const certificates = ref<Certificate[]>([]);
const selectedCertificate = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

// Keep schema as is
const schema = {
  certificate: {
    label: 'Select Certificate',
    required: true
  }
};

const state = ref({
  certificate: ''
});

onMounted(async () => {
  await loadCertificates();
});

async function loadCertificates() {
  console.log("Current certificates:", JSON.stringify(certificates.value, null, 2));
  try {
    loading.value = true;
    const result = await getCertificates();
    // Handle potential undefined result
    console.log('Loaded certificates:', JSON.stringify(result, null, 2));
    console.log('Certificates type:', Array.isArray(result) ? 'Array' : typeof result);
    certificates.value = Array.isArray(result) ? result : [];
    error.value = '';
  } catch (err: any) {
    error.value = err.message || 'Failed to load certificates';
    certificates.value = [];
  } finally {
    loading.value = false;
  }
}

async function onSubmit() {
  if (!selectedCertificate.value) {
    error.value = 'Please select a certificate';
    return;
  }

  try {
    loading.value = true;
    error.value = '';
    success.value = '';

    // Get public key from middleware with undefined check
    const publicKey = await getPublicKey(selectedCertificate.value);

    if (!publicKey) {
      throw new Error('Public key could not be retrieved from middleware');
    }

    // Register public key with server
    await registerPublicKey(publicKey);

    success.value = 'Certificate successfully registered';
    state.value.certificate = selectedCertificate.value;

  } catch (err: any) {
    error.value = err.message || 'Failed to register certificate';
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
          <h3 class="text-lg font-semibold">Certificate Management</h3>
        </div>
      </template>

      <div class="space-y-4">
        <p class="text-sm">
          Register a certificate to securely encrypt and decrypt your files.
          This enables end-to-end encryption for your stored files.
        </p>

        <UAlert v-if="error" color="warning" title="Error" class="mb-4">
          {{ error }}
        </UAlert>

        <UAlert v-if="success" color="success" title="Success" class="mb-4">
          {{ success }}
        </UAlert>

        <UForm :schema="schema" :state="state" @submit="onSubmit">
          <USelect v-model="selectedCertificate" :options="certificates.map(cert => ({
            label: cert?.name || 'Unknown Certificate',
            value: cert?.token || ''
          }))" placeholder="Select a certificate" :loading="loading"
            :disabled="loading || certificates.length === 0" />

          <div class="mt-4 flex justify-end space-x-3">
            <UButton type="button" color="success" @click="loadCertificates" :disabled="loading">
              Refresh Certificates
            </UButton>
            <UButton type="submit" :loading="loading" :disabled="loading || certificates.length === 0">
              Register Certificate
            </UButton>
          </div>
        </UForm>
      </div>
    </UCard>
  </div>
</template>
