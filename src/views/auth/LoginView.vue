<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { reactive, ref } from 'vue'
import { login } from '@/services/AuthService'
import type { LoginFormData } from '@/dtos/LoginFormData'
import { error } from 'console'

const show = ref(false)
const schema = z.object({
  username: z.string(),
  password: z.string().min(8, 'Must be at least 8 characters'),
})
type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({
  username: undefined,
  password: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const result = login(event.data)
    console.log(JSON.stringify(result, null, 2))
  } catch (error: any) {
    console.log(error)
  }
}
</script>

<template>
  <main class="h-full">
    <UCard class="max-w-[250px] mx-auto mt-48">
      <template #header>
        <h1 class="font-bold justify-self-center">LogIn</h1>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-4 flex flex-col" @submit="onSubmit">
        <UFormField label="Username" name="email">
          <UInput v-model="state.username" class="w-full" />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput
            v-model="state.password"
            placeholder="Password"
            :type="show ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Hide password' : 'Show password'"
                :aria-pressed="show"
                aria-controls="password"
                @click="show = !show"
                class="cursor-pointer"
              />
            </template>
          </UInput>
        </UFormField>

        <div class="flex justify-end">
          <UButton type="submit" class="w-18 justify-center cursor-pointer"> Submit </UButton>
        </div>
      </UForm>
    </UCard>
  </main>
</template>
