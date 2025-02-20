export interface IUser {
  id: string
  name: string
  email: string
  avatarUrl?: string
  color?: string
  lastProjectId?: string
}

export interface ICard {
  id: string
  title: string
  description?: string
  chatIds?: string[]
  cardPath?: string
  createdAt: string
  updatedAt: string
  author: IUser
  users: IUser[]
  public: boolean
}

export interface IProject {
  id: string
  title: string
  description?: string
  tags?: string[]
  author: IUser
  users: IUser[]
  public: boolean
} 