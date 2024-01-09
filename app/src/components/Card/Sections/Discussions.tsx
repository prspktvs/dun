import React, { useEffect, useState } from 'react'
import Chat from '../../Chats/Chat'
import { IUser } from '../../../types/User'
import { useChats } from '../../../context/ChatContext/ChatContext'
import { getAllCardChats, saveChatAndMessage } from '../../../services/chats'
import { useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'
import CardPreview from '../CardPreview'
import ChatPreview from '../../Chats/ChatPreview'

export default function Discussions({ users }: { users: IUser[] }) {
  const { id: projectId, cardId } = useParams()
  const { chatId, openChatById } = useChats()
  const [chats, setChats] = useState([])
  useEffect(() => {
    getAllCardChats(`projects/${projectId}/cards/${cardId}`).then((res) => setChats(res))
  }, [])

  if (chatId) {
    return <Chat chatId={chatId} users={users} />
  }

  return (
    <div className='h-full'>
      {!isEmpty(chats) ? (
        chats.map((chat) => (
          <ChatPreview
            key={'chat-' + chat.id}
            users={users}
            chat={chat}
            onClick={() => openChatById(chat.id)}
          />
        ))
      ) : (
        <div className='flex flex-col items-center h-full justify-center'>
          <div className='text-gray-400'>No discussions here</div>
          <div
            className='underline text-lg hover:cursor-pointer'
            onClick={async () => {
              await saveChatAndMessage({
                chatId: cardId,
                cardPath: `projects/${projectId}/cards/${cardId}`,
                content: 'Card discussion',
                messageData: undefined,
              })
              openChatById(cardId)
            }}
          >
            Start new discussion
          </div>
        </div>
      )}
    </div>
  )
}
