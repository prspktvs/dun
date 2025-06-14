import { ITeamMember, IUser } from './User'
import { ITask } from './Task'

export interface IProject {
  id: string
  title: string
  description?: string
  tags: string[] | null
  users: ITeamMember[] | null
  cards: ICard[] | null
}
