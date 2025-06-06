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
import { ROLES } from '../../constants/roles.constants'
import { useAuth } from '../../context/AuthContext'
import { useProject } from '../../context/ProjectContext'
import { KebabMenu } from '../ui/KebabMenu'

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
          <div className='flex items-center gap-1 mb-1 font-semibold'>
            <AvatarDun user={user} size={24} />
            <span className='ml-1 text-sm font-medium text-zinc-700 font-rubik'>
              {user?.name}
              <span className='ml-2 font-normal text-gray-400 text-10'>{time}</span>
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
  const { user } = useAuth()
  const { hasPermission } = useProject()

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

  const isAuthor = author?.id === user?.id
  const canDeleteChat = hasPermission(ROLES.ADMIN) || isAuthor

  useEffect(() => {
    setUnreadMessages(getUnreadMessagesCount(chat.id))
  }, [unreadChats])

  const isChatRead = unreadMessages === 0

  return (
    <div className='flex w-full'>
      <div
        className={clsx(
          'w-2 h-full border-r-1 border-borders-purple',
          isChatRead ? 'bg-[#EFEFEF]' : 'bg-salad',
        )}
      ></div>
      <div
        className={clsx(
          'w-full flex border-borders-purple hover:cursor-pointer hover:bg-gray-100 pr-7 py-3',
          isChatRead ? 'opacity-70' : '',
        )}
        onClick={onClick}
      >
        <div className='w-full ml-4'>
          <div className='relative flex items-center h-10 gap-2 mb-3'>
            {unreadMessages ? <UnreadIndicator count={unreadMessages} /> : null}
            {chat.content ? (
              <div className='flex items-center w-11/12 h-full gap-2 font-monaspace '>
                <div className='h-full w-[3px] bg-[#969696]' />
                <div className='flex flex-col text-[11px]'>
                  <div className='text-[#969696]'>
                    {author ? `${author.name} started a discussion about:` : 'New discussion:'}
                  </div>
                  <div className='line-clamp-2'>{editorContent || chat.content}</div>
                </div>
              </div>
            ) : null}
            {canDeleteChat ? (
              <KebabMenu
                menuText='Remove discussion'
                confirmMessage='Are you sure you want to remove this discussion?'
                confirmText='Remove'
                onConfirm={onDeleteChat}
                withoutConfirm
              />
            ) : (
              <div />
            )}
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
                    <div className='w-full pr-5 text-sm font-semibold text-left font-monaspace text-btnBg'>
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
