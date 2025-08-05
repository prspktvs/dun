export interface IAttachment {
  url: string
  name: string
  type: string
  size?: number
}

export interface IMessage {
  authorId: string
  author: string
  text: string
  timestamp: number
  mentions: string[]
  readBy: string[]
  attachments?: IAttachment[]
}

export interface IChat {
  id: string
  content: string
  messages: IMessage[] | null
}
