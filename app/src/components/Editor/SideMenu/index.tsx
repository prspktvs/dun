import { AddBlockButton, DragHandleButton, SideMenu, SideMenuProps } from '@blocknote/react'
import clsx from 'clsx'

import { useChats } from '../../../context/ChatContext'

export default function CustomSideMenu(props: SideMenuProps) {
  const { openChatById, getUnreadMessagesCount, cardChats } = useChats()
  const blockId = props.block.id

  const unreadCount = getUnreadMessagesCount(blockId)
  const hasMasseges = cardChats.some((chat) => chat.id === blockId)

  return (
    <SideMenu {...props}>
      <div className='flex items-start mt-1 mr-1'>
        <i
          className={clsx(
            'relative text-xl -top-[2px] pr-[2px] hover:cursor-pointer',
            unreadCount > 0
              ? 'text-black ri-message-3-fill'
              : hasMasseges
                ? 'text-black ri-message-3-line'
                : 'ri-message-3-line text-[#CFCFCF] hover:bg',
          )}
          onClick={async (e) => {
            openChatById(blockId)
          }}
        />

        <AddBlockButton {...props} />
        <DragHandleButton {...props} />
      </div>
    </SideMenu>
  )
}
