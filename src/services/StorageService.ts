import type { CreateFolder } from '@/dtos/CreateFolder'
import apiClient, { makeRequest } from '@/services/ApiClient.ts'
import type { ApiResult } from '@/types/ApiResult'
import type { Children } from '@/types/Children'
import type { Workspace } from '@/types/Workspace'

export function uploadFile(workspaceId: number, folderId: number, file: File): Promise<ApiResult> {
  const formData = new FormData()
  formData.append('workspaceId', workspaceId.toString())
  formData.append('folderId', folderId.toString())
  formData.append('file', file)

  return makeRequest(() =>
    apiClient.post('/api/storage/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  )
}

export function createFolder(data: CreateFolder): Promise<ApiResult> {
  return makeRequest(() => apiClient.post('/api/storage/folder', data))
}

export function getWorkspaces(): Promise<Workspace[]> {
  return makeRequest(() => apiClient.get('/api/storage/workspaces'))
}

export function getWorkspaceChildren(workspaceId: number): Promise<Children> {
  return makeRequest(() => apiClient.get('/api/storage/workspace/' + workspaceId + '/children'))
}

export function getFolderChildren(folderId: number): Promise<Children> {
  return makeRequest(() => apiClient.get('/api/storage/folder/' + folderId + '/children'))
}

export async function download(fileId: number): Promise<void> {
  const { data, headers } = await apiClient.get('/api/storage/download/file/' + fileId, {
    responseType: 'blob',
  })

  const contentDisposition = headers['content-disposition']
  const filename = contentDisposition.split('; ')[1].replace('filename=', '').replaceAll('"', '')

  const url = URL.createObjectURL(data)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
