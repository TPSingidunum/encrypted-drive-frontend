<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { reactive, ref } from 'vue'

const show = ref(false)
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})
type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}
</script>

<template>
  <main class="h-full">
    <UCard class="max-w-[250px] mx-auto mt-48">
      <template #header>
        <h1 class="font-bold justify-self-center">LogIn</h1>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-4 flex flex-col" @submit="onSubmit">
        <UFormField label="Email" name="email">
          <UInput v-model="state.email" class="w-full" />
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
          <UButton type="submit" class="w-18 justify-center cursor-pointer">
            Submit
          </UButton>
        </div>
      </UForm>
    </UCard>
  </main>
</template>
