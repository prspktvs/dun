import { createContext, useContext, useEffect, useState } from 'react'
import { off, onValue, ref } from 'firebase/database'
import { useNavigate, useParams } from 'react-router-dom'

import { realtimeDb } from '../config/firebase'
import { IChat, IMessage } from '../types/Chat'
import { getAllCardChats, removeCardChat, saveChatAndMessage } from '../services'

export type ChatContext = {
  chatId: string
  cardChats: IChat[]
  openChatById: (id: string) => void
  unreadChats: { id: string; unreadCount: number }[]
  getUnreadMessagesCount: (id: string) => number
  closeChat: () => void
  deleteChat: (cardId: string, chatId: string) => void
  createChat: (cardId: string, title?: string) => void
}

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    id: projectId,
    cardId: currentCardId,
    chatId: currentChatId,
  } = useParams<{
    id: string
    cardId: string
    chatId: string
  }>()

  const [chatId, setChatId] = useState<string>(currentChatId ?? '')
  const [cardChats, setCardChats] = useState<IChat[]>([])
  const [unreadChats, setUnreadChats] = useState<{ id: string; unreadCount: number }[]>([])

  const navigate = useNavigate()

  const openChatById = (id: string) => {
    setChatId(id)
    const newUrl = `/${projectId}/cards/${currentCardId}/chats/${id}`
    navigate(newUrl, { replace: true })
  }

  const getUnreadMessagesCount = (id: string) => {
    const message = unreadChats.find((chat) => chat.id === id)
    return message && message?.unreadCount ? message?.unreadCount : 0
  }

  const closeChat = () => {
    setChatId('')
    const newUrl = `/${projectId}/cards/${currentCardId}`
    navigate(newUrl, { replace: true })
  }

  const deleteChat = async (cardId: string, chatId: string) => {
    try {
      if (!confirm('Are you sure?')) return

      await removeCardChat(cardId, chatId)
      setCardChats((prev) => prev.filter((c) => c.id !== chatId))
    } catch (e) {
      console.error('Error deleting chat:', e)
    }
  }

  const createChat = async (cardId: string, title: string = 'Major topic discussion') => {
    try {
      await saveChatAndMessage({
        chatId: cardId as string,
        cardId: cardId as string,
        content: title,
        messageData: undefined,
      })
      openChatById(cardId as string)
    } catch (e) {
      console.error('Error creating chat:', e)
    }
  }

  useEffect(() => {
    if (!currentCardId) return
    getAllCardChats(currentCardId).then((data) => setCardChats(data))
  }, [currentCardId])

  useEffect(() => {
    // @TODO: split chats by project ids (/chats/projectId) to get a batch of project chats
    // @TODO: add read status to messages
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
    cardChats,
    openChatById,
    getUnreadMessagesCount,
    closeChat,
    deleteChat,
    createChat,
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
