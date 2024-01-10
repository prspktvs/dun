import { Avatar, Blockquote } from '@mantine/core'
import { IChat, IMessage } from '../../types/Chat'
import { IUser } from '../../types/User'
import { isEmpty, last, set } from 'lodash'
import { useChats } from '../../context/ChatContext/ChatContext'
import { useCallback, useEffect, useState } from 'react'

export default function ChatPreview({
  chat,
  users,
  onClick,
}: {
  chat: IChat
  users: IUser[]
  onClick: () => void
}) {
  const { getUnreadMessagesCount, unreadChats } = useChats()

  const chatUsers = users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {})

  const [unreadMessages, setUnreadMessages] = useState(0)
  const lastMessage = !isEmpty(chat?.messages)
    ? (Object.values(chat?.messages)?.sort((a, b) => a.timestamp - b.timestamp)?.[0] as IMessage)
    : null

  const messageUser = lastMessage ? chatUsers[lastMessage.authorId] : null

  useEffect(() => {
    setUnreadMessages(getUnreadMessagesCount(chat.id))
  }, [unreadChats])

  const date = new Date(lastMessage?.timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const time = `${hours}:${minutes}`

  return (
    <div
      className='w-full h-32 flex items-center pl-5 border-b-2 border-gray-border hover:cursor-pointer hover:bg-gray-100'
      onClick={onClick}
    >
      <div>
        <div className='flex items-center h-10 gap-2 mb-3 '>
          {unreadMessages ? (
            <div className='h-7 w-7 bg-red-400 border-2 border-black flex items-center justify-center'>
              <span className='font-semibold'>+{unreadMessages}</span>
            </div>
          ) : null}
          {chat.content ? (
            <div className='h-full flex gap-2 items-center'>
              <div className='h-full w-[3px] bg-black' />
              <div>{chat.content}</div>
            </div>
          ) : null}
        </div>
        {lastMessage ? (
          <>
            <div className='flex gap-1 items-center font-semibold mb-1'>
              <Avatar size={24} src={messageUser.avatarUrl} radius={0} />
              <span>
                {messageUser.name}
                <span className='ml-3 text-sm text-gray-400 font-normal'>{time}</span>
              </span>
            </div>
            <span>{lastMessage.text}</span>
          </>
        ) : (
          <div className='text-gray-400'>No messages here</div>
        )}
      </div>
    </div>
  )
}
