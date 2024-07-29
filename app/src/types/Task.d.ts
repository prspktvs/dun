import { PartialBlock } from '@blocknote/core'
import { IUser } from './User'

export enum TaskStatus {
  Planned = 'Planned',
  InProgress = 'In progress',
  InReview = 'In review',
  Done = 'Dun',
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Urgent = 'Urgent',
}
export interface ITask extends PartialBlock {
  id: string
  isDone: boolean
  text: string
  users: string[]
  status: TaskStatus
  priority: TaskPriority
  author: string
  card_id: string
  cardPath?: string 
}
