<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { reactive, ref } from 'vue'
import { getJwtClaims, login } from '@/services/AuthService'
import { useRouter } from 'vue-router'
import { ApiError } from '@/types/ApiError'
import { useUserStore } from '@/stores/UserStore'
import { useColorMode } from '@vueuse/core'

const show = ref(false)
const router = useRouter()
const errorField = ref<string>("");
const userStore = useUserStore();
const mode = useColorMode()
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
    const result = await login(event.data)

    localStorage.setItem(`access_token`, result.accessToken)
    localStorage.setItem(`refresh_token`, result.refreshToken)
    const claims = getJwtClaims(result.accessToken);

    if (claims != undefined) {
      userStore.setUser({
        username: claims.sub,
        email: claims.email,
        role: claims.role
      })
    }

    return router.push('/')
  } catch (error: any) {
    if (error instanceof ApiError) {
      switch (error.errorCode) {
        case 1005:
          errorField.value = "Wrong password"
          return;
        case 1002:
          errorField.value = "Username does not exist"
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
    <div class="fixed top-4 right-4 z-50">
      <UButton class="cursor-pointer" :icon="mode === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'" color="neutral"
        variant="ghost" @click="mode = mode === 'dark' ? 'light' : 'dark'" />
    </div>
    <UCard class="max-w-[300px] mx-auto mt-48">
      <template #header>
        <h1 class="font-bold justify-self-center">LogIn</h1>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-4 flex flex-col" @submit="onSubmit">
        <UFormField label="Username" name="email">
          <UInput v-model="state.username" class="w-full" />
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
        <p class="text-red-500 text-sm text-center w-full font-bold" v-if="errorField"> {{ errorField }}</p>

        <div class="flex justify-end">
          <UButton type="submit" class="justify-center cursor-pointer" loading-auto> Submit </UButton>
        </div>
      </UForm>

      <template #footer>
        <div>
          <p class="text-sm flex justify-center">
            Dont have an account?
            <RouterLink to="register" class="pl-2">Register</RouterLink>
          </p>
        </div>
      </template>
    </UCard>
  </main>
</template>
