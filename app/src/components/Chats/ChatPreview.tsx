import { Avatar, Blockquote } from '@mantine/core'
import { IChat, IMessage } from '../../types/Chat'
import { IUser } from '../../types/User'
import { isEmpty, last } from 'lodash'

export default function ChatPreview({
  chat,
  users,
  onClick,
}: {
  chat: IChat
  users: IUser[]
  onClick: () => void
}) {
  const chatUsers = users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {})

  const lastMessage = !isEmpty(chat?.messages)
    ? (Object.values(chat?.messages)?.sort((a, b) => a.timestamp - b.timestamp)?.[0] as IMessage)
    : null

  const messageUser = lastMessage ? chatUsers[lastMessage.authorId] : null

  const date = new Date(lastMessage?.timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const time = `${hours}:${minutes}`

  return (
    <div
      className='w-full h-40 flex items-center pl-5 border-b-2 border-gray-border hover:cursor-pointer hover:bg-gray-100'
      onClick={onClick}
    >
      <div>
        {chat.content ? (
          <div className='h-10 flex gap-3 mb-3 items-center'>
            <div className='h-full w-[2px] bg-black' />
            <div>{chat.content}</div>
          </div>
        ) : null}
        {lastMessage ? (
          <>
            {' '}
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
