export interface IUser {
  id: string
  name: string
  email: string
  lastProjectId: string
}

export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer'


export interface ITeamMember extends IUser {
  role: UserRole
}