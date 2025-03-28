export interface IMessage {
  authorId: string
  author: string
  text: string
  timestamp: number
  mentions: string[]
  readBy: string[]
}

export interface IChat {
  id: string
  content: string
  messages: IMessage[] | null
}
