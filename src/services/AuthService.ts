import type { LoginData } from '@/dtos/LoginData'
import type { LoginFormData } from '@/dtos/LoginFormData'
import type { RegisterFormData } from '@/dtos/RegisterFormData'
import type { ApiResult } from '@/types/ApiResult'
import apiClient, { makeRequest } from '@/services/ApiClient.ts'
import type { Token } from '@/types/Token'
import { jwtDecode } from 'jwt-decode'

export function getJwtClaims(token: string): Token | undefined {
  try {
    const decoded: Token = jwtDecode(token)
    return decoded
  } catch (error: any) {
    console.log('Error during JWT decode: ' + error)
  }
}

//TODO: Zasto nemoze biti u zasebnom fajlu
interface ApiResult {
  success: boolean
}

export function login(data: LoginFormData): Promise<LoginData> {
  return makeRequest(() => apiClient.post('/api/auth/login', data))
}

export function register(data: RegisterFormData): Promise<ApiResult> {
  return makeRequest(() => apiClient.post('/api/auth/register', data))
}
