<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCertificates, getPublicKey } from '@/services/MiddlewareService';
import { registerPublicKey } from '@/services/AuthService';
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui';

const certificates = ref<{label: string, value: string}[]>([]);
const loading = ref(false);
const error = ref('');
const success = ref('');

type Schema = z.output<typeof schema>
const schema = z.object({
  certificate: z.string().min(1, 'Please select a certificate')
});

const state = ref({
  certificate: ''
});

onMounted(async () => {
  certificates.value = []; // Reset certificates array before loading
  await loadCertificates();
});

async function loadCertificates() {
  try {
    loading.value = true;
    certificates.value = []; // Clear existing certificates
    const result = await getCertificates() as unknown as string[];

    if (Array.isArray(result)) {
      // Process each token into the format expected by USelect
      for (const token of result) {
        certificates.value.push({
          label: token,
          value: token
        });
      }
    }

    error.value = '';
  } catch (err: any) {
    error.value = err.message || 'Failed to load certificates';
    certificates.value = [];
  } finally {
    loading.value = false;
  }
}

// Update to handle form submission properly
async function onSubmit(event: FormSubmitEvent<Schema>) {

  try {
    loading.value = true;
    error.value = '';
    success.value = '';

    // Get public key using the selected certificate
    const publicKey = await getPublicKey(event.data.certificate);
    console.log('Public Key:', publicKey);

    if (!publicKey) {
      throw new Error('Public key could not be retrieved from middleware');
    }

    // Register public key with server
    await registerPublicKey(publicKey);

    success.value = 'Certificate successfully registered';
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
          <!-- Direct USelect without UFormGroup -->
          <USelect
            v-model="state.certificate"
            :items="certificates"
            placeholder="Select a certificate"
            :loading="loading"
            :disabled="loading || certificates.length === 0"
          />

          <div class="mt-4 flex justify-end space-x-3">
            <UButton class="cursor-pointer" type="button" color="success" @click="loadCertificates" :disabled="loading">
              Refresh Certificates
            </UButton>
            <UButton class="cursor-pointer" type="submit" :loading="loading" :disabled="loading || certificates.length === 0">
              Register Certificate
            </UButton>
          </div>
        </UForm>
      </div>
    </UCard>
  </div>
</template>
