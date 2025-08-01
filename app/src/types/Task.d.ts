import { PartialBlock } from '@blocknote/core'

import { IUser } from './User'

export enum TaskStatus {
  NoStatus = 'no status',
  Planned = 'Planned',
  InProgress = 'In progress',
  InReview = 'In review',
  Done = 'Dun',
}

export enum TaskPriority {
  NoPriority = 'no priority',
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
  position: number
  cardPath?: string
  index?: number
}
