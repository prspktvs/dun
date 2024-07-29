import { AddBlockButton, DragHandleButton, SideMenu, SideMenuProps } from '@blocknote/react'
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
    <SideMenu {...props}>
      <div className='flex items-start mt-1 mr-1'>
        <i
          className={clsx(
            'relative text-xl -top-[2px] pr-[2px] hover:cursor-pointer',
            unreadCount > 0
              ? 'text-red-700 ri-message-3-fill'
              : 'ri-message-3-line text-[#CFCFCF] hover:bg',
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

        <AddBlockButton {...props} />
        <DragHandleButton {...props} />
      </div>
    </SideMenu>
  )
}
