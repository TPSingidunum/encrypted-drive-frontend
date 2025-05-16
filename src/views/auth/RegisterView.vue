<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ApiError } from '@/types/ApiError'
import { register } from '@/services/AuthService'

const show = ref(false)
const router = useRouter()
const errorField = ref<string>("");
const schema = z.object({
  username: z.string(),
  email: z.string().email("Must be a valid Email"),
  password: z.string().min(8, 'Must be at least 8 characters'),
  confirmPassword: z.string().min(1, "Must enter confirmPassword"),
})
type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({
  username: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const result = await register(event.data)

    if (!result.success) {
      errorField.value = "Faild to create user"
      return;
    }

    return router.push('/login')
  } catch (error: any) {
    if (error instanceof ApiError) {
      switch (error.errorCode) {
        case 1005:
          errorField.value = "Passwords do not match"
          return;
        case 1003:
          errorField.value = "Email already exists"
          return;
        case 1004:
          errorField.value = "Username already exists"
          return;
        default:
          console.log('Error Code: ' + error.errorCode)
          return;
      }
    }
    console.log('Error: ' + JSON.stringify(error, null, 2))
  }
}
</script>

<template>
  <main class="h-full">
    <UCard class="max-w-[300px] mx-auto mt-48">
      <template #header>
        <h1 class="font-bold justify-self-center">Register</h1>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-4 flex flex-col" @submit="onSubmit">
        <UFormField label="Username" name="username">
          <UInput v-model="state.username" class="w-full" />
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput v-model="state.email" class="w-full" />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput v-model="state.password" placeholder="Password" :type="show ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }" class="w-full">
            <template #trailing>
              <UButton color="neutral" variant="link" size="sm" :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Hide password' : 'Show password'" :aria-pressed="show" aria-controls="password"
                @click="show = !show" class="cursor-pointer" />
            </template>
          </UInput>
        </UFormField>
        <UFormField label="ConfirmPassword" name="confirmPassword">
          <UInput v-model="state.confirmPassword" placeholder="Confirm Password" :type="show ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }" class="w-full">
            <template #trailing>
              <UButton color="neutral" variant="link" size="sm" :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Hide password' : 'Show password'" :aria-pressed="show" aria-controls="password"
                @click="show = !show" class="cursor-pointer" />
            </template>
          </UInput>
        </UFormField>
        <p class="text-red-500 text-sm text-center w-full font-bold" v-if="errorField"> {{ errorField }}</p>

        <div class="flex justify-end">
          <UButton type="submit" class="justify-center cursor-pointer" loading-auto> Submit </UButton>
        </div>
      </UForm>


      <template #footer>
        <p class="text-sm flex justify-center">
          Already have an account?
          <RouterLink to="login" class="pl-2">Login</RouterLink>
        </p>
      </template>
    </UCard>
  </main>
</template>
