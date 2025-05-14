import apiClient, { makeRequest } from '@/services/ApiClient.ts'

export function login(username: string, password: string): any {
 return makeRequest(() =>
    apiClient.post('/api/auth/login', {username, password})
 )
}
