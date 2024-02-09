import { PartialBlock } from '@blocknote/core'
import { IUser } from './User'

export interface ITask extends PartialBlock {
  id: string
  isDone?: boolean
  text?: string
  props: {
    users?: IUser[]
    isDone: boolean
  }
}
