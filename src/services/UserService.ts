import apiClient, { makeRequest } from '@/services/ApiClient.ts'
import type { User } from '@/types/User'

export function getAllUsers(): Promise<User[]> {
  return makeRequest(() => apiClient.get<User[]>('/api/admin/users'))
}
