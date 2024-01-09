import { useEffect, useState } from 'react'
import { ChatContext } from './ChatContext'
import { onValue, ref } from 'firebase/database'
import { realtimeDb } from '../../config/firebase'

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chatId, setChatId] = useState('')

  const openChatById = (id: string) => setChatId(id)

  const closeChat = () => setChatId('')

  useEffect(() => {
    const messagesRef = ref(realtimeDb, `chats`)
    onValue(messagesRef, (snapshot) => {
      const messageData = snapshot.val()
      console.log('All messages', messageData)
    })
  }, [])

  const contextValue: ChatContext = {
    chatId,
    openChatById,
    closeChat,
  }
  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
}

export default ChatProvider
