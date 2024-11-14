import { Avatar, Blockquote, Menu } from '@mantine/core'
import { isEmpty } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'

import { IChat, IMessage } from '../../types/Chat'
import { IUser } from '../../types/User'
import { useChats } from '../../context/ChatContext'
import { useEditor } from '../../context/EditorContext'
import { renderMessage } from './Chat'
import AvatarDun from '../ui/Avatar'
import UnreadIndicator from '../ui/UnreadIndicator'

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
      <div className='max-w-7xl'>
        {user ? (
          <div className='flex gap-1 items-center font-semibold mb-1'>
            <AvatarDun user={user} />
            <span className='text-sm text-zinc-700 font-rubik font-medium ml-1'>
              {user?.name}
              <span className='ml-2 text-10  text-gray-400 font-normal'>{time}</span>
            </span>
          </div>
        ) : null}
        <div className='overflow-hidden max-h-[72px] w-5/6'>
          <span className='text-sm text-[#46434E] font-commissioner line-clamp-2 truncate'>
            {renderMessage(message)}
          </span>
        </div>
      </div>
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

  const editorContent =
    editor && !isEmpty(editor.topLevelBlocks)
      ? editor.topLevelBlocks.find((block) => block.id === chat.id)?.content?.[0]?.text
      : ''

  const firstMessage = sortedMessages ? sortedMessages[0] : null
  const lastMessage =
    sortedMessages && sortedMessages.length > 1
      ? sortedMessages.at(-1)
      : sortedMessages?.[0] || null
  const repliesCount = sortedMessages ? sortedMessages.length - 1 : 0

  const author = chatUsers?.[firstMessage?.authorId]
  const secondAuthor = chatUsers?.[lastMessage?.authorId]

  useEffect(() => {
    setUnreadMessages(getUnreadMessagesCount(chat.id))
  }, [unreadChats])

  const isChatRead = unreadMessages === 0

  return (
    <div className='flex w-full'>
      <div
        className={clsx(
          'w-2 h-full border-r-1 border-border-color',
          isChatRead ? 'bg-[#EFEFEF]' : 'bg-salad',
        )}
      ></div>
      <div
        className={clsx(
          'w-full flex border-border-color hover:cursor-pointer hover:bg-gray-100 pr-7 py-3',
          isChatRead ? 'opacity-70' : '',
        )}
        onClick={onClick}
      >
        <div className='w-full ml-4'>
          <div className='relative flex items-center h-10  gap-2 mb-3'>
            {unreadMessages ? <UnreadIndicator count={unreadMessages} /> : null}
            {chat.content ? (
              <div className='h-full flex gap-2 items-center font-monaspace w-11/12 '>
                <div className='h-full w-[3px] bg-gray-500' />
                <div className='flex flex-col text-[11px]'>
                  <div className='text-[#A3A1A7]'>
                    {author ? `${author.name} started a discussion about:` : 'New discussion:'}
                  </div>
                  <div className='line-clamp-2'>{editorContent || chat.content}</div>
                </div>
              </div>
            ) : null}
            <Menu shadow='md' width={200}>
              <Menu.Target>
                <i
                  onClick={(e) => e.stopPropagation()}
                  className='z-40 ri-more-2-fill text-2xl absolute top-1 right-0 '
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
                  Delete discussion
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
          {!isEmpty(chat?.messages) ? (
            <>
              {lastMessage ? (
                <>
                  <div className='my-3'>
                    <MessagePreview
                      user={secondAuthor}
                      timestamp={lastMessage.timestamp}
                      message={lastMessage.text}
                    />
                  </div>
                  {repliesCount ? (
                    <div className='w-full font-monaspace text-left font-semibold pr-5 text-[#8279BD] text-sm'>
                      {repliesCount}+ replies
                    </div>
                  ) : null}
                </>
              ) : null}
            </>
          ) : (
            <div className='text-gray-400'>No messages here</div>
          )}
        </div>
      </div>
    </div>
  )
}
