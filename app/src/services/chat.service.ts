import { get, push, ref, remove, set } from 'firebase/database'
import { db, realtimeDb } from '../config/firebase'
import { IMessage } from '../types/Chat'
import { getCardById, saveChatIdsToCard, updateCard } from './card.service'
import { collection, deleteDoc, doc, getDoc } from 'firebase/firestore'

export const createNewChat = async ({
  chatId,
  cardId,
  content,
}: {
  chatId: string
  cardId: string | undefined
  content: string
}) => {
  const chatRef = ref(realtimeDb, `chats/${chatId}`)
  await set(chatRef, { id: chatId, content, messages: [] })
  if (cardId) await updateCard({ id: cardId, chatIds: [chatId] })
}

const saveMessage = async (chatId: string, messageData: IMessage) => {
  const messageRef = ref(realtimeDb, `chats/${chatId}/messages/`)
  await push(messageRef, messageData)
}

export const saveChatAndMessage = async ({
  chatId,
  cardId,
  content,
  messageData,
}: {
  chatId: string
  cardId: string
  content: string
  messageData: IMessage | undefined
}) => {
  const chatRef = ref(realtimeDb, `chats/${chatId}`)
  const chatSnapshot = await get(chatRef)
  console.log('SNAP',chatSnapshot.exists())

  if (!chatSnapshot.exists()) {
    await createNewChat({ chatId, cardId, content })
  }

  if (messageData) await saveMessage(chatId, messageData)
}

export const getAllCardChats = async (cardId: string) => {
  const card = await getCardById(cardId)

  if (!card) return []

  if(!card?.chatIds) return []

  const snapshots = await Promise.all(
    card?.chatIds.map((chatId: string) => {
      const messagesRef = ref(realtimeDb, `chats/${chatId}`)
      return get(messagesRef)
    }),
  )

  return snapshots.filter((snap) => snap.exists()).map((snap) => snap.val())
}

export const removeChatById = async (chatId: string) => {
  try {
    if (!chatId) return null
    await remove(ref(realtimeDb, `chats/${chatId}`))
  } catch (e) {
    console.error(e)
    return null
  }
}
