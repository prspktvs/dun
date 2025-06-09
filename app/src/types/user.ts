import { UserRole } from '../constants/roles.constants'

export interface IUser {
  id: string
  name: string
  color?: string
  email: string
  lastProjectId: string
}

export interface ITeamMember extends IUser {
  role: UserRole
}