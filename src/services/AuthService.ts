import type { LoginData } from '@/dtos/LoginData'
import type { LoginFormData } from '@/dtos/LoginFormData'
import apiClient, { makeRequest } from '@/services/ApiClient.ts'

export function login(data: LoginFormData): Promise<LoginData> {
  return makeRequest(() => apiClient.post('/api/auth/login', data))
}
