export interface StorageRow {
  id: number
  name: string
  type: 'Folder' | 'File'
  size: string
  parentId: number | null
  createdAt: string
  updatedAt: string
}
