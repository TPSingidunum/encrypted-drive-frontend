export interface Folder {
  folderId: number
  name: string
  workspaceId?: number
  parentId?: number
  createAt?: Date
  updateAt?: Date
}

export interface File {
  fileId: number
  name: string
  workspaceId: number
  parentId: number
  createAt: Date
  updateAt: Date
}

export interface Children {
  folders: Folder[]
  files: File[]
}
