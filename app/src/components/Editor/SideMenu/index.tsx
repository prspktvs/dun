import { AddBlockButton, DragHandle, SideMenu, SideMenuProps } from '@blocknote/react'
import { Button } from '@mantine/core'
import { useChats } from '../../../context/ChatContext/ChatContext'
import { createNewChat, saveChatAndMessage } from '../../../services/chats'
import { useParams } from 'react-router-dom'

export default function CustomSideMenu(props: SideMenuProps) {
  const { id: projectId, cardId } = useParams()
  const { openChatById } = useChats()
  const blockId = props.block.id

  return (
    <SideMenu>
      <i
        className='ri-message-3-line text-xl text-gray-300 rounded-lg hover:cursor-pointer hover:bg-gray-100 px-1'
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
      <AddBlockButton {...props} />
      <DragHandle {...props} />
    </SideMenu>
  )
}
