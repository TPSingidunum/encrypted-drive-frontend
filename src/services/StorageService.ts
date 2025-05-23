import apiClient, { makeRequest } from '@/services/ApiClient.ts'
import type { ApiResult } from '@/types/ApiResult'
import type { Children } from '@/types/Children'
import type { Workspace } from '@/types/Workspace'

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

export function getWorkspaces(): Promise<Workspace[]> {
  return makeRequest(() => apiClient.get('/api/storage/workspaces'))
}

export function getWorkspaceChildren(workspaceId: number): Promise<Children> {
  return makeRequest(() => apiClient.get('/api/storage/workspace/' + workspaceId))
}
