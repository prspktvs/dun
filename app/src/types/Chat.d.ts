export interface IMessage {
  authorId: string
  text: string
  timestamp: number
  mentions: string[]
}

export interface IChat {
  id: string
  content: string
  messages: IMessage[] | null
}
