import {
  AddBlockButton,
  DragHandle,
  SideMenu,
  SideMenuButton,
  SideMenuProps,
} from '@blocknote/react'
import { Button } from '@mantine/core'
import { useChats } from '../../../context/ChatContext'
import { createNewChat, saveChatAndMessage } from '../../../services'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import clsx from 'clsx'

export default function CustomSideMenu(props: SideMenuProps) {
  const { id: projectId, cardId } = useParams()
  const { openChatById, getUnreadMessagesCount } = useChats()
  const blockId = props.block.id

  const unreadCount = getUnreadMessagesCount(blockId)

  return (
    <SideMenu>
      <div className='flex'>
        <SideMenuButton>
          <i
            className={clsx(
              'text-xl',
              unreadCount > 0 ? 'text-red-700 ri-message-3-fill' : 'ri-message-3-line',
            )}
            onClick={async (e) => {
              await saveChatAndMessage({
                chatId: blockId,
                cardId,
                content: props?.block?.content?.[0]?.text || 'Discussion',
                messageData: undefined,
              })
              openChatById(blockId)
            }}
          />
        </SideMenuButton>

        <AddBlockButton {...props} />
        <DragHandle {...props} />
      </div>
    </SideMenu>
  )
}
