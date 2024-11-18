import { createContext, useContext , useEffect, useState } from 'react'
import { off, onValue, ref } from 'firebase/database'

import { realtimeDb } from '../config/firebase'
import { IMessage } from '../types/Chat'

export type ChatContext = {
  chatId: string
  openChatById: (id: string) => void
  unreadChats: { id: string; unreadCount: number }[]
  getUnreadMessagesCount: (id: string) => number
  closeChat: () => void
}

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chatId, setChatId] = useState('')
  const [unreadChats, setUnreadChats] = useState<{ id: string; unreadCount: number }[]>([])

  const openChatById = (id: string) => setChatId(id)

  const getUnreadMessagesCount = (id: string) => {
    const message = unreadChats.find((chat) => chat.id === id)
    return message && message?.unreadCount ? message?.unreadCount : 0
  }

  const closeChat = () => setChatId('')

  useEffect(() => {
    const messagesRef = ref(realtimeDb, `chats`)
    onValue(messagesRef, (snapshot) => {
      const messageData: { id: string; content: string; messages: IMessage[] } = snapshot.val()
      const lastReadMessages = JSON.parse(localStorage.getItem('lastReadMessages'))
      const allChats = Object.values(messageData)
      const data: { id: string; unreadCount: number }[] = allChats.map((chat) => {
        if (!chat || !chat?.id || !chat?.messages) return { id: '', unreadCount: 0 }
        const messagesIds = Object.keys(chat.messages)
        const unreadCount =
          lastReadMessages && lastReadMessages.hasOwnProperty(chat.id)
            ? messagesIds.length - 1 - messagesIds.indexOf(lastReadMessages[chat.id])
            : messagesIds.length
        return { id: chat.id, unreadCount }
      })

      setUnreadChats(data)
    })

    return () => off(messagesRef)
  }, [chatId])

  const contextValue: ChatContext = {
    chatId,
    unreadChats,
    openChatById,
    getUnreadMessagesCount,
    closeChat,
  }
  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
}

export const ChatContext = createContext<ChatContext | undefined>(undefined)

export const useChats = (): ChatContext => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChats must be used within a ChatProvider')
  }
  return context
}
