import { get, push, ref, set } from 'firebase/database'
import { db, realtimeDb } from '../config/firebase'
import { IMessage } from '../types/Chat'
import { saveChatIdsToCard } from './cards'
import { doc, getDoc } from 'firebase/firestore'

export const createNewChat = async ({
  chatId,
  cardPath,
  content,
}: {
  chatId: string
  cardPath: string | undefined
  content: string
}) => {
  const chatRef = ref(realtimeDb, `chats/${chatId}`)
  await set(chatRef, { id: chatId, content, messages: [] })

  if (cardPath) await saveChatIdsToCard(cardPath, [chatId])
}

const saveMessage = async (chatId: string, messageData: IMessage) => {
  const messageRef = ref(realtimeDb, `chats/${chatId}/messages/`)
  await push(messageRef, messageData)
}

export const saveChatAndMessage = async ({
  chatId,
  cardPath,
  content,
  messageData,
}: {
  chatId: string
  cardPath: string
  content: string
  messageData: IMessage | undefined
}) => {
  const chatRef = ref(realtimeDb, `chats/${chatId}`)
  const chatSnapshot = await get(chatRef)

  if (!chatSnapshot.exists()) {
    await createNewChat({ chatId, cardPath, content })
  }

  if (messageData) await saveMessage(chatId, messageData)
}

export const getAllCardChats = async (cardPath: string) => {
  const cardRef = doc(db, cardPath)
  const card = await getDoc(cardRef)

  if (!card.exists()) return []

  const { chatIds } = card.data()

  const snapshots = await Promise.all(
    chatIds.map((chatId: string) => {
      const messagesRef = ref(realtimeDb, `chats/${chatId}`)
      return get(messagesRef)
    }),
  )

  return snapshots.filter((snap) => snap.exists()).map((snap) => snap.val())
}
