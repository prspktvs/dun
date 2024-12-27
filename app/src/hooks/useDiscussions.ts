import { useEffect } from 'react'

import { useChats } from '../context/ChatContext'

const useDiscussions = (cardId: string) => {
  const { openChatById, cardChats } = useChats()

  useEffect(() => {
    if (cardChats.length > 0) {
      openChatById(cardChats[0].id)
    }
  }, [cardChats, openChatById])

  return {
    cardChats,
  }
}

export default useDiscussions