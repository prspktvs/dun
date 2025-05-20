import {
  AddBlockButton,
  BlockColorsItem,
  DragHandleButton,
  DragHandleMenu,
  DragHandleMenuProps,
  RemoveBlockItem,
  SideMenu,
  SideMenuProps,
  useBlockNoteEditor,
  useComponentsContext,
} from '@blocknote/react'
import clsx from 'clsx'

import { useChats } from '../../../context/ChatContext'
import { TaskPriority, TaskStatus } from '../../../types/Task.d.ts'

function CustomHandleButton(
  props: DragHandleMenuProps & { type: 'priority' | 'status'; children: React.ReactNode },
) {
  const editor = useBlockNoteEditor()
  const Components = useComponentsContext()!

  const menuItems =
    props.type === 'priority'
      ? [
          TaskPriority.NoPriority,
          TaskPriority.Low,
          TaskPriority.Medium,
          TaskPriority.High,
          TaskPriority.Urgent,
        ]
      : [
          TaskStatus.NoStatus,
          TaskStatus.Planned,
          TaskStatus.InProgress,
          TaskStatus.InReview,
          TaskStatus.Done,
        ]

  return (
    <Components.Generic.Menu.Root position={'right'} sub={true}>
      <Components.Generic.Menu.Trigger sub={true}>
        <Components.Generic.Menu.Item className={'bn-menu-item'} subTrigger={true}>
          {props.children}
        </Components.Generic.Menu.Item>
      </Components.Generic.Menu.Trigger>

      <Components.Generic.Menu.Dropdown
        sub={true}
        className={'bn-menu-dropdown bn-color-picker-dropdown'}
      >
        {menuItems.map((item) => (
          <Components.Generic.Menu.Item
            key={item}
            className={clsx('bn-menu-item', {
              'text-priority-low': item === TaskPriority.Low,
              'text-priority-medium': item === TaskPriority.Medium,
              'text-priority-high': item === TaskPriority.High,
              'text-priority-urgent': item === TaskPriority.Urgent,
            })}
            onClick={() => {
              editor.updateBlock(props.block.id, {
                props: {
                  [props.type]: item,
                },
              })
            }}
          >
            {item}
          </Components.Generic.Menu.Item>
        ))}
      </Components.Generic.Menu.Dropdown>
    </Components.Generic.Menu.Root>
  )
}

const CustomDragHandleMenu = (props: DragHandleMenuProps) => (
  <DragHandleMenu {...props}>
    <RemoveBlockItem {...props}>Delete</RemoveBlockItem>
    <BlockColorsItem {...props}>Colors</BlockColorsItem>
    {props.block.type === 'task' && (
      <CustomHandleButton {...props} type='priority'>
        Priority
      </CustomHandleButton>
    )}
    {props.block.type === 'task' && (
      <CustomHandleButton {...props} type='status'>
        Status
      </CustomHandleButton>
    )}
  </DragHandleMenu>
)

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
        <DragHandleButton {...props} dragHandleMenu={CustomDragHandleMenu} />
      </div>
    </SideMenu>
  )
}
