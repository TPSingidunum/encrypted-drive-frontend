import type { LoginData } from '@/dtos/LoginData'
import type { LoginFormData } from '@/dtos/LoginFormData'
import type { RegisterFormData } from '@/dtos/RegisterFormData'
import apiClient, { makeRequest } from '@/services/ApiClient.ts'
import type { ApiResult } from '@/types/ApiResult'
import type { Token } from '@/types/Token'
import type { User } from '@/types/User'
import { jwtDecode } from 'jwt-decode'

export function getJwtClaims(token: string): Token | undefined {
  try {
    const decoded: Token = jwtDecode(token)
    return decoded
  } catch (error: any) {
    console.log('Error during JWT decode: ' + error)
  }
}

export function login(data: LoginFormData): Promise<LoginData> {
  return makeRequest(() => apiClient.post('/api/auth/login', data))
}

export function register(data: RegisterFormData): Promise<ApiResult> {
  return makeRequest(() => apiClient.post('/api/auth/register', data))
}

export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) {
    return false
  }

  try {
    const { accessToken } = await makeRequest(() =>
      apiClient.post('/api/auth/refresh', { refreshToken }),
    )

    localStorage.setItem('access_token', accessToken)
    return true
  } catch {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    return false
  }
}

export async function verifyToken(): Promise<boolean> {
  const token = localStorage.getItem('access_token')
  if (!token) {
    return false
  }

  const claims = getJwtClaims(token)
  if (!claims) {
    return false
  }

  const isExpired = claims.exp * 1000 <= Date.now()
  if (!isExpired) {
    return true
  }

  return await refreshAccessToken()
}

export async function getCurrentPublicKey(): Promise<string | null> {
    return await makeRequest(() => apiClient.get('/api/user/public-key'))
}

export async function registerPublicKey(publicKey: string): Promise<ApiResult> {
  return makeRequest(() => apiClient.post('/api/user/register-key', { publicKey }))
}

export async function getUserInformation(): Promise<User> {
    return await makeRequest(() => apiClient.get('/api/user'))
}
