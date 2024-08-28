import { PartialBlock } from '@blocknote/core'
import { ITask } from './Task'
import { IUser } from './User'
import { IFile } from './File'

export interface ICard {
  id: string
  title: string
  tags: string[] | null
  createdAt: Date
  content: PartialBlock[]
  description: string[] | null
  chatIds: string[] | null
  tasks: ITask[] | null
  users: IUser['id'][] | null
  files: IFile[] | null
  author: IUser['id']
  project_id: string
}
