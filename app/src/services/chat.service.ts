import { get, push, ref, remove, set, update } from 'firebase/database'

import { realtimeDb } from '../config/firebase'
import { IMessage } from '../types/Chat'
import { updateCard } from './card.service'
import { apiRequest } from '../utils/api'
import { extractIdsFromPath } from '../utils/chat'

export const createNewChat = async ({
  path,
  content,
}: {
  path: string
  content: string
}) => {
  const chatRef = ref(realtimeDb, path)
  const parts = path.split('/')
  const cardId = parts[3]
  const chatId = parts[5]
  await set(chatRef, { id: chatId, content, messages: [] })
  if (cardId) await updateCard({ id: cardId, chatIds: [chatId] })
}

const saveMessage = async ({ path, messageData} : { path: string; messageData: IMessage}) => {
  const messageRef = ref(realtimeDb, `${path}/messages/`)
  await push(messageRef, messageData)
}

export const saveChatAndMessage = async ({
  path,
  content,
  messageData,
}: {
  path: string
  content: string
  messageData: IMessage | undefined
}) => {
  const chatRef = ref(realtimeDb, path)
  const chatSnapshot = await get(chatRef)

  if (!chatSnapshot.exists()) {
    await createNewChat({ path, content })
  }

  if (messageData) await saveMessage({ path, messageData})
}

export const getAllCardChats = async (path: string) => {
  const cardRef = ref(realtimeDb, path)
  const cardSnapshot = await get(cardRef)
  const value = cardSnapshot.val()
  if (!value || !value.chats) return []
  return Object.values(cardSnapshot.val().chats)
}

export const removeCardChat = async (path: string) => {
  try {
    if (!path) return null
    await remove(ref(realtimeDb, path))
    const { cardId, chatId } = extractIdsFromPath(path)

    await apiRequest(`cards/${cardId}/chats/${chatId}`, {
      method: 'DELETE',
    })
  } catch (e) {
    console.error(e)
    return null
  }
}

export const updateReadBy = async (path: string, userId: string) => {
  const messagesRef = ref(realtimeDb, `${path}/messages`)
  const messagesSnapshot = await get(messagesRef)
  const messages: IMessage[] = messagesSnapshot.val()

  if (messages) {
    const updates = {}
    Object.entries(messages).forEach(([messageId, message]) => {
      const readBy = message.readBy || []
      if (!readBy.includes(userId)) {
        readBy.push(userId)
        updates[`${path}/messages/${messageId}/readBy`] = readBy
      }
    })
    await update(ref(realtimeDb), updates)
  }
}
