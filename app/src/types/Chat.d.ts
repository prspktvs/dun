export interface IMessage {
  authorId: string
  text: string
  timestamp: number
}

export interface IChat {
  id: string
  content: string
  messages: IMessage[] | null
}
