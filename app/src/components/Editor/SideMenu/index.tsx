import {
  AddBlockButton,
  DragHandle,
  SideMenu,
  SideMenuButton,
  SideMenuProps,
} from '@blocknote/react'
import { Button } from '@mantine/core'
import { useChats } from '../../../context/ChatContext/ChatContext'
import { createNewChat, saveChatAndMessage } from '../../../services/chats'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'

export default function CustomSideMenu(props: SideMenuProps) {
  const { id: projectId, cardId } = useParams()
  const { openChatById } = useChats()
  const blockId = props.block.id
  console.log(props)

  return (
    <SideMenu>
      <div className='flex'>
        <SideMenuButton>
          <i
            className='ri-message-3-line text-xl'
            onClick={async (e) => {
              await saveChatAndMessage({
                chatId: blockId,
                cardPath: `projects/${projectId}/cards/${cardId}`,
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
