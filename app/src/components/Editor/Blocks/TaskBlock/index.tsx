/* eslint-disable react-hooks/rules-of-hooks */
import {
  BlockNoteEditor,
  BlockSchema,
  defaultProps,
  getBlockInfo,
  getBlockInfoFromTransaction,
  getNearestBlockPos,
  PartialBlock,
  PropSchema,
  updateBlockCommand,
} from '@blocknote/core'
import { createReactBlockSpec } from '@blocknote/react'
import { useEffect, useRef, useState } from 'react'
import { Menu, Popover } from '@mantine/core'
import clsx from 'clsx'
import { EditorState } from '@tiptap/pm/state'

import { insertOrUpdateBlock } from '../../../../utils/editor'
import { ITask, TaskPriority, TaskStatus } from '../../../../types/Task.d.ts'
import { useProject } from '../../../../context/ProjectContext'
import { useAuth } from '../../../../context/AuthContext'
import { RiArrowDown } from '../../../Project/Content/IconsCard/IconsCard'

type Task = {
  isDone: {
    default: boolean
  }
  status: {
    default: string
  }
  priority: {
    default: string
  }
  author: {
    default: string
  }
  users: {
    default: string[]
  }
}

export const splitBlockCommand = (posInBlock: number, keepType?: boolean, keepProps?: boolean) => {
  return ({
    state,
    dispatch,
  }: {
    state: EditorState
    dispatch: ((args?: any) => any) | undefined
  }) => {
    const nearestBlockContainerPos = getNearestBlockPos(state.doc, posInBlock)

    const info = getBlockInfo(nearestBlockContainerPos)

    if (!info.isBlockContainer) {
      throw new Error(`BlockContainer expected when calling splitBlock, position ${posInBlock}`)
    }

    const types = [
      {
        type: info.bnBlock.node.type, // always keep blockcontainer type
        attrs: keepProps ? { ...info.bnBlock.node.attrs, id: undefined } : {},
      },
      {
        type: keepType ? info.blockContent.node.type : state.schema.nodes['paragraph'],
        attrs: keepProps ? { ...info.blockContent.node.attrs } : {},
      },
    ]

    if (dispatch) {
      state.tr.split(posInBlock, 2, types)
    }

    return true
  }
}

export const handleEnter = (editor: BlockNoteEditor<any, any, any>) => {
  const { blockInfo, selectionEmpty } = editor.transact((tr) => {
    return {
      blockInfo: getBlockInfoFromTransaction(tr),
      selectionEmpty: tr.selection.anchor === tr.selection.head,
    }
  })

  if (!blockInfo.isBlockContainer) {
    return false
  }
  const { bnBlock: blockContainer, blockContent } = blockInfo

  if (
    !(
      blockContent.node.type.name === 'task' || blockContent.node.type.name === 'numberedListItem'
    ) ||
    !selectionEmpty
  ) {
    return false
  }
}

const CustomCheckbox = ({ checked }: { checked: boolean }) =>
  checked ? (
    <i className='ri-checkbox-line  text-lg' />
  ) : (
    <i className='ri-checkbox-blank-line text-lg' />
  )

const StatusDropdown = ({
  status,
  updateStatus,
}: {
  status: ITask['status']
  updateStatus: (s: ITask['status']) => void
}) => {
  return (
    <Menu>
      <Menu.Target>
        <span className='flex items-center font-rubik text-[#969696] hover:cursor-pointer'>
          {status}
          <RiArrowDown />
        </span>
      </Menu.Target>
      <Menu.Dropdown className='rounded-xl border-1 border-borders-purple'>
        <Menu.Item onClick={() => updateStatus(TaskStatus.NoStatus)}>no status</Menu.Item>
        <Menu.Item onClick={() => updateStatus(TaskStatus.Planned)}>Planned</Menu.Item>
        <Menu.Item onClick={() => updateStatus(TaskStatus.InProgress)}>In progress</Menu.Item>
        <Menu.Item onClick={() => updateStatus(TaskStatus.InReview)}>In review</Menu.Item>
        <Menu.Item onClick={() => updateStatus(TaskStatus.Done)}>Dun</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

const PriorityDropdown = ({
  priority,
  updatePriority,
}: {
  priority: ITask['priority']
  updatePriority: (s: ITask['priority']) => void
}) => {
  return (
    <Menu>
      <Menu.Target>
        <span
          className={clsx(
            'flex items-center font-rubik text-[#969696] hover:cursor-pointer',
            priority === TaskPriority.Low
              ? 'text-priority-low'
              : priority === TaskPriority.Medium
                ? 'text-priority-medium'
                : priority === TaskPriority.High
                  ? 'text-priority-high'
                  : priority === TaskPriority.Urgent
                    ? 'text-priority-urgent'
                    : '',
          )}
        >
          {priority}
          <RiArrowDown />
        </span>
      </Menu.Target>
      <Menu.Dropdown className='rounded-xl border-1 border-borders-purple'>
        <Menu.Item
          className='text-[#969696]'
          onClick={() => updatePriority(TaskPriority.NoPriority)}
        >
          no priority
        </Menu.Item>
        <Menu.Item className='text-priority-low' onClick={() => updatePriority(TaskPriority.Low)}>
          Low
        </Menu.Item>
        <Menu.Item
          className='text-priority-medium'
          onClick={() => updatePriority(TaskPriority.Medium)}
        >
          Medium
        </Menu.Item>
        <Menu.Item className='text-priority-high' onClick={() => updatePriority(TaskPriority.High)}>
          High
        </Menu.Item>
        <Menu.Item
          className='text-priority-urgent'
          onClick={() => updatePriority(TaskPriority.Urgent)}
        >
          Urgent
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

const taskSchema: Partial<PropSchema> | Partial<Task> = {
  title: {
    default: '',
  },
  isDone: {
    default: false,
  },
  status: {
    default: TaskStatus.NoStatus,
  },
  priority: {
    default: TaskPriority.NoPriority,
  },
  author: {
    default: '',
  },
  users: {
    default: [],
  },
}

const TaskBlock = createReactBlockSpec(
  {
    type: 'task',
    propSchema: {
      ...defaultProps,
      ...(taskSchema as PropSchema),
    },
    content: 'inline',
  },
  {
    render: ({ block, editor, contentRef }) => {
      const { status, priority, author } = block.props
      const { user } = useAuth()

      // useEffect(() => {
      //   const handleKeyDown = (e: KeyboardEvent) => {
      //     console.log('1')
      //     const currentBlock = editor.getTextCursorPosition()?.block
      //     if (currentBlock?.id !== block.id) {
      //       return
      //     }
      //     console.log('2')
      //     if (e.key === 'Enter' && !e.shiftKey) {
      //       e.preventDefault()

      //       const pos = editor._tiptapEditor.state.selection.from
      //       const blockPos = getNearestBlockPos(editor._tiptapEditor.state.doc, pos)
      //       const info = getBlockInfo(blockPos)

      //       if (!info.isBlockContainer) {
      //         return
      //       }

      //       // Проверяем содержимое блока
      //       const isEmpty = info.blockContent.node.childCount === 0

      //       if (isEmpty) {
      //         editor.updateBlock(block, {
      //           type: 'paragraph',
      //           props: {},
      //         })
      //       } else {
      //         const newBlock = {
      //           type: 'task' as const,
      //           props: {
      //             ...block.props,
      //             isDone: false,
      //             author: user?.id || '',
      //           },
      //         }

      //         editor.insertBlocks([newBlock], block, 'after')
      //       }
      //     }
      //   }

      //   document.addEventListener('keydown', handleKeyDown, true) // используем capture phase
      //   return () => document.removeEventListener('keydown', handleKeyDown, true)
      // }, [block, editor, user, contentRef])

      const isBlockActive = block === editor?.getTextCursorPosition()?.block

      return (
        <div className='w-full'>
          <Popover position='top-start' offset={6}>
            <Popover.Target>
              <div className='relative flex gap-4 items-start w-full' tabIndex={0}>
                <div
                  onClick={() =>
                    editor.updateBlock(block, { props: { isDone: !block.props.isDone } })
                  }
                >
                  <CustomCheckbox checked={block.props.isDone} />
                </div>

                <span className='inline-block mt-[2px]' ref={contentRef} />
                {!(block?.content[0]?.text || block?.content[0]?.href) && isBlockActive ? (
                  <div className='absolute left-9 mt-[2px] text-gray-300 flex items-center italic'>
                    <div className='cursor' />
                    Enter a text or type '@' to mention user
                  </div>
                ) : (
                  <span className='mt-[5px] flex gap-2 items-center'>
                    {status !== TaskStatus.NoStatus && (
                      <span className='flex text-14 font-rubik text-[#969696] hover:cursor-pointer'>
                        {status}
                      </span>
                    )}
                    {priority !== TaskPriority.NoPriority && (
                      <span
                        className={clsx(
                          'flex text-14 items-center font-rubik text-[#969696] hover:cursor-pointer',
                          priority === TaskPriority.Low
                            ? 'text-priority-low'
                            : priority === TaskPriority.Medium
                              ? 'text-priority-medium'
                              : priority === TaskPriority.High
                                ? 'text-priority-high'
                                : priority === TaskPriority.Urgent
                                  ? 'text-priority-urgent'
                                  : '',
                        )}
                      >
                        {priority}
                      </span>
                    )}
                  </span>
                )}
              </div>
            </Popover.Target>
            <Popover.Dropdown className='rounded-lg h-9 flex items-center gap-3 border-1 border-borders-purple bg-background'>
              <StatusDropdown
                status={status}
                updateStatus={(status) => editor.updateBlock(block, { props: { status } })}
              />
              <div className='border-l-1 w-[1px] h-8 border-borders-purple' />
              <PriorityDropdown
                priority={priority}
                updatePriority={(priority) => editor.updateBlock(block, { props: { priority } })}
              />
            </Popover.Dropdown>
          </Popover>

          <div className='mb-3' />
        </div>
      )
    },
  },
)

export default TaskBlock
