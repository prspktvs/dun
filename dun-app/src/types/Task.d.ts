import { PartialBlock } from '@blocknote/core'
import { IUser } from './User'

export interface ITask extends PartialBlock {
  props: {
    users?: IUser[]
    isDone: boolean
  }
}
