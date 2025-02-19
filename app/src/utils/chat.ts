export const getChatPath = (projectId: string, cardId: string, chatId: string) => 
  `projects/${projectId}/cards/${cardId}/chats/${chatId}`

export const extractIdsFromPath = (path: string) => {
  const parts = path.split('/')

  const projectId = parts[1]
  const cardId = parts[3]
  const chatId = parts[5]

  return { projectId, cardId, chatId }
}