import apiClient, { makeRequest } from '@/services/ApiClient.ts'
import type { ApiResult } from '@/types/ApiResult'

export function uploadFile(file: File): Promise<ApiResult> {
  const formData = new FormData()
  formData.append('file', file)

  return makeRequest(() =>
    apiClient.post('/api/storage/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  )
}
