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
  const [search, setSearch] = useState('')
  const [chats, setChats] = useState([])
  const [filteredChats, setFilteredChats] = useState([])

  useEffect(() => {
    getAllCardChats(`projects/${projectId}/cards/${cardId}`).then((res) => setChats(res))
  }, [chatId])

  useEffect(() => {
    const updatedChats = chats.filter((chat) =>
      chat.content.toLowerCase().includes(search.toLowerCase()),
    )
    setFilteredChats(updatedChats)
  }, [search, chats])

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)

  if (chatId) {
    return <Chat chatId={chatId} users={users} />
  }

  return (
    <div className='h-full'>
      <div className='relative p-3 border-b-2'>
        <i className='absolute ri-search-line text-2xl text-gray-400' />
        <input
          className='block pl-7 align-middle text-xl w-full overflow-hidden border-none'
          value={search}
          onChange={onSearch}
        />
      </div>
      {!isEmpty(filteredChats) ? (
        filteredChats.map((chat) => (
          <ChatPreview
            key={'chat-' + chat.id}
            users={users}
            chat={chat}
            onClick={() => openChatById(chat.id)}
          />
        ))
      ) : (
        <div className='flex flex-col items-center justify-center'>
          <div className='text-gray-400 font-monaspace mt-5'>No discussions yet</div>
          <div
            className='underline font-monaspace text-lg hover:cursor-pointer'
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
