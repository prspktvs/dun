export interface IUser {
  id: string
  email: string
  lastProjectId?: string
}

export interface User extends IUser {
  lastProjectId?: string
} 