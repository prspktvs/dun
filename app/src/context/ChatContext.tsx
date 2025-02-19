import { createContext, useContext, useEffect, useState } from 'react'
import { off, onValue, ref } from 'firebase/database'
import { useNavigate, useParams } from 'react-router-dom'

import { realtimeDb } from '../config/firebase'
import { IChat, IMessage } from '../types/Chat'
import { getAllCardChats, removeCardChat, saveChatAndMessage } from '../services'
import { useAuth } from './AuthContext'
import { getChatPath } from '../utils/chat'

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

  const { user } = useAuth()

  const navigate = useNavigate()

  const openChatById = (id: string) => {
    setChatId(id)
    const newUrl = `/${projectId}/cards/${currentCardId}/chats/${id}`
    navigate(newUrl, { replace: true })
  }

  const getUnreadMessagesCount = (chatId: string) => {
    const chat = unreadChats.find((chat) => chat.chatId === chatId)
    return chat ? chat.unreadCount : 0
  }

  const closeChat = () => {
    setChatId('')
    const newUrl = `/${projectId}/cards/${currentCardId}`
    navigate(newUrl, { replace: true })
  }

  const deleteChat = async (cardId: string, chatId: string) => {
    try {
      if (!confirm('Are you sure?')) return

      const path = getChatPath(projectId, cardId, chatId)
      await removeCardChat(path)
      setCardChats((prev) => prev.filter((c) => c.id !== chatId))
    } catch (e) {
      console.error('Error deleting chat:', e)
    }
  }

  const createChat = async (cardId: string) => {
    try {
      openChatById(cardId as string)
    } catch (e) {
      console.error('Error creating chat:', e)
    }
  }

  useEffect(() => {
    if (!currentCardId) return
    getAllCardChats(`projects/${projectId}/cards/${currentCardId}`).then((data) =>
      setCardChats(data),
    )
  }, [projectId, currentCardId])

  useEffect(() => {
    if (!currentCardId) return

    const messagesRef = ref(realtimeDb, `projects/${projectId}/cards/${currentCardId}/chats`)
    onValue(messagesRef, (snapshot) => {
      const chats = snapshot.val()
      const allChats = []

      Object.entries(chats).forEach(([chatId, chat]) => {
        allChats.push({ cardId: currentCardId, chatId, chat })
      })

      const data = allChats.map(({ cardId, chatId, chat }) => {
        if (!chat || !chat.id || !chat.messages) return { cardId, chatId: '', unreadCount: 0 }
        const messages = Object.values(chat.messages)
        const unreadCount = messages.filter(
          (message) => !message.readBy || !message.readBy.includes(user.id),
        ).length
        return { cardId, chatId: chat.id, unreadCount }
      })

      setUnreadChats(data)
    })

    return () => off(messagesRef)
  }, [projectId, currentCardId])

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
