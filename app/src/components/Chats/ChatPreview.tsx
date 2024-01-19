import { Avatar, Blockquote, Menu } from '@mantine/core'
import { IChat, IMessage } from '../../types/Chat'
import { IUser } from '../../types/User'
import { isEmpty } from 'lodash'
import { useChats } from '../../context/ChatContext/ChatContext'
import { useCallback, useEffect, useState } from 'react'
import { useEditor } from '../../context/EditorContext/EditorContext'
import { removeChatById } from '../../services/chats'

function MessagePreview({
  user,
  timestamp,
  message,
}: {
  user: IUser
  timestamp: number
  message: string
}) {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const time = `${hours}:${minutes}`
  return (
    <>
      <div className='flex gap-1 items-center font-semibold mb-1'>
        <Avatar size={24} src={user.avatarUrl} radius={0} />
        <span>
          {user.name}
          <span className='ml-3 text-sm text-gray-400 font-normal'>{time}</span>
        </span>
      </div>
      <span>{message}</span>
    </>
  )
}

export default function ChatPreview({
  chat,
  users,
  onClick,
  onDeleteChat,
}: {
  chat: IChat
  users: IUser[]
  onDeleteChat: () => void
  onClick: () => void
}) {
  const { getUnreadMessagesCount, unreadChats } = useChats()

  const chatUsers = users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {})

  const [unreadMessages, setUnreadMessages] = useState(0)
  const { editor } = useEditor()
  const sortedMessages = !isEmpty(chat?.messages)
    ? Object.values(chat?.messages)?.sort((a, b) => a.timestamp - b.timestamp)
    : null

  const editorContent = editor.topLevelBlocks.find((block) => block.id === chat.id)?.content?.[0]
    ?.text

  const firstMessage = sortedMessages ? sortedMessages[0] : null
  const lastMessage = sortedMessages && sortedMessages.length > 1 ? sortedMessages.at(-1) : null
  const repliesCount = sortedMessages ? sortedMessages.length - 2 : 0

  // const messageUser = lastMessage ? chatUsers[lastMessage.authorId] : null

  useEffect(() => {
    setUnreadMessages(getUnreadMessagesCount(chat.id))
  }, [unreadChats])

  return (
    <div
      className='w-full h-52 flex items-center pl-5 border-b-2 border-gray-border hover:cursor-pointer hover:bg-gray-100'
      onClick={onClick}
    >
      <div className='w-full'>
        <div className='relative flex items-center h-10 gap-2 mb-3 '>
          {unreadMessages ? (
            <div className='h-7 w-7 bg-red-400 border-2 border-black flex items-center justify-center'>
              <span className='font-semibold'>+{unreadMessages}</span>
            </div>
          ) : null}
          {chat.content ? (
            <div className='h-full flex gap-2 items-center font-monaspace whitespace-nowrap'>
              <div className='h-full w-[3px] bg-gray-500' />
              <div>{editorContent || chat.content}</div>
            </div>
          ) : null}
          <Menu shadow='md' width={200}>
            <Menu.Target>
              <i
                onClick={(e) => e.stopPropagation()}
                className='z-40 ri-more-2-fill text-2xl absolute top-1 right-5'
              />
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteChat()
                }}
                className='text-red-600'
              >
                Delete chat
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
        {!isEmpty(chat?.messages) ? (
          <>
            <MessagePreview
              user={chatUsers[firstMessage.authorId]}
              timestamp={firstMessage.timestamp}
              message={firstMessage.text}
            />
            {lastMessage ? (
              <>
                {repliesCount ? (
                  <div className='w-full font-monaspace text-right font-semibold pr-5 underline'>
                    {repliesCount} more replies
                  </div>
                ) : null}
                <MessagePreview
                  user={chatUsers[lastMessage.authorId]}
                  timestamp={lastMessage.timestamp}
                  message={lastMessage.text}
                />
              </>
            ) : null}
          </>
        ) : (
          <div className='text-gray-400'>No messages here</div>
        )}
      </div>
    </div>
  )
}
