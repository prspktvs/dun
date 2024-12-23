import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'
import clsx from 'clsx'

import { Chat } from '../../Chats/Chat'
import { IUser } from '../../../types/User'
import { useChats } from '../../../context/ChatContext'
import ChatPreview from '../../Chats/ChatPreview'
import { IChat } from '../../../types/Chat'

function AddNewChat({ onClick }: { onClick: () => void }) {
  return (
    <>
      <div
        className='h-[120px] border-b-1 border-border-color overflow-hidden flex flex-none'
        onClick={onClick}
      >
        <div className='flex w-full'>
          <div className={clsx('w-2 h-full border-r-1 border-border-color', 'bg-[#EFEFEF]')} />
          <div
            className={clsx(
              'w-full flex border-border-color hover:cursor-pointer hover:bg-gray-100 pr-7 py-3',
              'opacity-70',
            )}
          >
            <div className='flex flex-col items-center justify-between'>
              <div className='h-8 flex gap-2 items-center font-monaspace w-11/12 '>
                <div className='h-full w-[3px] bg-gray-500' />
                <div className='flex flex-col text-12'>
                  <div className='text-[#969696]'>Major topic discussion</div>
                </div>
              </div>
              <div className='font-monaspace mb-5 ml-3 text-12 text-[#969696] hover:cursor-pointer'>
                No messages yet,{' '}
                <span className='text-btnBg font-bold hover:underline'>start a discussion</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='font-monaspace text-16 text-center w-full px-16 mt-3 text-[#969696]'>
        Hover over the content and click the comment icon on the left to start a new discussion
      </div>
    </>
  )
}

export default function Discussions({ users }: { users: IUser[] }) {
  const { cardId } = useParams<{ cardId: string }>()
  const { chatId, openChatById, createChat, deleteChat, cardChats } = useChats()
  const [search, setSearch] = useState('')
  const [filteredChats, setFilteredChats] = useState<IChat[]>([])

  useEffect(() => {
    const updatedChats = cardChats.filter((chat) => {
      const chatMessages = chat?.messages ? Object.values(chat.messages).map((m) => m.text) : []
      return (
        chat?.content?.toLowerCase()?.includes(search.toLowerCase()) ||
        chatMessages.some((m) => m.toLowerCase().includes(search.toLowerCase()))
      )
    })
    setFilteredChats(updatedChats)
  }, [search, cardChats])

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)

  if (chatId) {
    return <Chat chatId={chatId} users={users} />
  }

  const onDeleteChat = (chatId: string) => deleteChat(cardId, chatId)

  const onCreateNewDiscussion = async () => createChat(cardId, 'Topic discussion')

  return (
    <section className='h-screen'>
      <div className='relative p-3 border-b-1 border-border-color'>
        <i className='absolute top-[5px] ri-search-line text-lg text-gray-400' />
        <input
          className='block pl-7 h-4 align-middle text-sm w-full overflow-hidden border-none font-monaspace'
          value={search}
          onChange={onSearch}
          placeholder='Find it'
        />
      </div>
      <div className='overflow-y-scroll h-[calc(100vh_-_164px)] pb-10 w-full'>
        {!isEmpty(filteredChats) ? (
          filteredChats.map((chat) => (
            <article
              key={'filtered-chat-' + chat.id}
              className='h-[160px] border-b-1 border-border-color overflow-hidden flex flex-none'
            >
              <ChatPreview
                key={'chat-' + chat.id}
                users={users}
                chat={chat}
                onDeleteChat={() => onDeleteChat(chat.id)}
                onClick={() => openChatById(chat.id)}
              />
            </article>
          ))
        ) : search ? (
          <div className='font-monaspace text-16 text-center w-full px-16 mt-3 text-[#969696]'>
            No found chats
          </div>
        ) : (
          <AddNewChat onClick={onCreateNewDiscussion} />
        )}
      </div>
    </section>
  )
}
