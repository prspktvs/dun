import React, { useEffect, useState } from 'react'
import { Chat } from '../../Chats/Chat'
import { IUser } from '../../../types/User'
import { useChats } from '../../../context/ChatContext'
import { getAllCardChats, removeChatById, saveChatAndMessage } from '../../../services'
import { useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'
import ChatPreview from '../../Chats/ChatPreview'
import { IChat } from '../../../types/Chat'

export default function Discussions({ users }: { users: IUser[] }) {
  const { id: projectId, cardId } = useParams()
  const { chatId, openChatById } = useChats()
  const [search, setSearch] = useState('')
  const [chats, setChats] = useState<IChat[]>([])
  const [filteredChats, setFilteredChats] = useState<IChat[]>([])

  useEffect(() => {
    getAllCardChats(cardId).then((res) => setChats(res))
  }, [chatId])

  useEffect(() => {
    const updatedChats = chats.filter((chat) => {
      console.log(chat)
      const chatMessages = chat?.messages ? Object.values(chat.messages).map((m) => m.text) : []
      return (
        chat?.content?.toLowerCase()?.includes(search.toLowerCase()) ||
        chatMessages.some((m) => m.toLowerCase().includes(search.toLowerCase()))
      )
    })
    setFilteredChats(updatedChats)
  }, [search, chats])

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)

  if (chatId) {
    return <Chat chatId={chatId} users={users} />
  }

  const onDeleteChat = async (id: string) => {
    try {
      if (confirm('Are you sure?')) {
        await removeChatById(id)
        setChats((prev) => prev.filter((chat) => chat.id !== id))
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className='h-screen'>
      <div className='relative p-3 border-b-1 border-border-color'>
        <i className='absolute top-[9px] ri-search-line text-xl text-gray-400' />
        <input
          className='block pl-7 align-middle text-sm w-full overflow-hidden border-none font-monaspace'
          value={search}
          onChange={onSearch}
          placeholder='Find it'
        />
      </div>
      <div className='overflow-y-scroll h-[calc(100vh_-_164px)] pb-10 w-full'>
        {!isEmpty(filteredChats) ? (
          filteredChats.map((chat) => (
            <div
              key={'filtered-chat-' + chat.id}
              className='h-[266px] border-b-1 border-border-color overflow-hidden flex flex-none'
            >
              <ChatPreview
                key={'chat-' + chat.id}
                users={users}
                chat={chat}
                onDeleteChat={() => onDeleteChat(chat.id)}
                onClick={() => openChatById(chat.id)}
              />
            </div>
          ))
        ) : (
          <div className='flex flex-col items-center justify-center'>
            <div className='text-gray-400 font-monaspace mt-5'>No discussions yet</div>
            <div
              className='underline font-monaspace text-lg hover:cursor-pointer'
              onClick={async () => {
                await saveChatAndMessage({
                  chatId: cardId,
                  cardId,
                  content: 'Topic main discussion',
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
    </div>
  )
}
