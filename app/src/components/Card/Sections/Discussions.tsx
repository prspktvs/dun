import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'
import clsx from 'clsx'

import { Chat } from '../../Chats/Chat'
import { IUser } from '../../../types/User'
import { useChats } from '../../../context/ChatContext'
import ChatPreview from '../../Chats/ChatPreview'
import { IChat } from '../../../types/Chat'
import { useProject } from '../../../context/ProjectContext'

function AddNewChat({ onClick }: { onClick: () => void }) {
  return (
    <>
      <div
        className='h-[120px] border-b-1 border-borders-purple overflow-hidden flex-none hidden md:block'
        onClick={onClick}
      >
        <div className='flex w-full'>
          <div className={clsx('w-2 h-full border-r-1 border-borders-purple', 'bg-[#EFEFEF]')} />
          <div
            className={clsx(
              'w-full flex border-borders-purple hover:cursor-pointer hover:bg-gray-100 pr-7 py-3',
              'opacity-70',
            )}
          >
            <div className='flex flex-col items-center justify-between '>
              <div className='flex items-center w-11/12 h-8 gap-2 font-monaspace '>
                <div className='h-full w-[3px] bg-gray-500' />
                <div className='flex flex-col text-12'>
                  <div className='text-[#969696]'>Main discussion</div>
                </div>
              </div>
              <div className='font-monaspace mb-5 ml-3 text-12 text-[#969696] hover:cursor-pointer'>
                No messages yet,{' '}
                <span className='font-bold text-btnBg hover:underline'>start a discussion</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='font-monaspace text-16 text-center w-full px-16 mt-3 text-[#969696] hidden md:block'>
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
  const { updateCard } = useProject()

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

  const onCreateNewDiscussion = async () => createChat('initialBlockId', 'Topic discussion')

  return (
    <section className='h-screen'>
      <div className='relative px-6 py-3 md:p-3 border-b-1 border-borders-purple'>
        <i className='absolute top-[5px] ri-search-line text-lg text-gray-400' />
        <input
          className='block w-full h-4 overflow-hidden text-sm align-middle border-none pl-7 font-monaspace '
          value={search}
          onChange={onSearch}
          placeholder='Find it'
        />
      </div>
      <div className='overflow-y-scroll h-[calc(100vh_-_164px)] pb-10 w-full  '>
        {!isEmpty(filteredChats) ? (
          filteredChats.map((chat) => (
            <article
              key={'filtered-chat-' + chat.id}
              className='h-[160px] border-b-1 border-borders-purple overflow-hidden flex flex-none'
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
