import { createContext, useContext } from 'react'

export type ChatContext = {
  chatId: string
  openChatById: (id: string) => void
  unreadChats: { id: string; unreadCount: number }[]
  getUnreadMessagesCount: (id: string) => number
  closeChat: () => void
}

export const ChatContext = createContext<ChatContext | undefined>(undefined)

export const useChats = (): ChatContext => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChats must be used within a ChatProvider')
  }
  return context
}
