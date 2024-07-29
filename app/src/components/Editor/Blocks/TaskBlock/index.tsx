import { BlockSchema, defaultProps, PartialBlock, PropSchema } from '@blocknote/core'
import { createReactBlockSpec } from '@blocknote/react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { insertOrUpdateBlock } from '../../../../utils/editor'
import { Menu } from '@mantine/core'
import { ITask, TaskPriority, TaskStatus } from '../../../../types/Task.d.ts'
import clsx from 'clsx'
import { useProject } from '../../../../context/ProjectContext'
import { IUser } from '../../../../types/User'
import { useAuth } from '../../../../context/AuthContext'

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
        <span className='font-rubik text-[#969696] font-medium hover:cursor-pointer'>{status}</span>
      </Menu.Target>
      <Menu.Dropdown>
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
            'font-rubik text-[#969696] font-medium hover:cursor-pointer',
            priority === TaskPriority.Low
              ? 'text-priority-low'
              : priority === TaskPriority.Medium
              ? 'text-priority-medium'
              : priority === TaskPriority.High
              ? 'text-priority-high'
              : 'text-priority-urgent',
          )}
        >
          {priority}
        </span>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          className='text-priority-low font-bold'
          onClick={() => updatePriority(TaskPriority.Low)}
        >
          Low
        </Menu.Item>
        <Menu.Item
          className='text-priority-medium font-bold'
          onClick={() => updatePriority(TaskPriority.Medium)}
        >
          Medium
        </Menu.Item>
        <Menu.Item
          className='text-priority-high font-bold'
          onClick={() => updatePriority(TaskPriority.High)}
        >
          High
        </Menu.Item>
        <Menu.Item
          className='text-priority-urgent font-bold'
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
    default: 'Planned',
  },
  priority: {
    default: 'Low',
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
      const { users } = useProject()
      const createdBy = useMemo(
        () => users.find((user: IUser) => user.id === author),
        [user, author, users],
      )

      useEffect(() => {
        if (!block.props.author && user) {
          editor.updateBlock(block, { props: { author: user.id } })
        }
      }, [user])

      useEffect(() => {
        const handler = (e: KeyboardEvent) => {
          const prevBlock = editor.getTextCursorPosition().prevBlock
          const nextBlock = editor.getTextCursorPosition().nextBlock

          switch (e.key) {
            case 'Enter':
              if (prevBlock?.type === 'task' && prevBlock?.content?.[0]?.text) {
                insertOrUpdateBlock(editor, {
                  type: 'task',
                } as PartialBlock<BlockSchema>)
                return
              }
            case 'Backspace':
              if (prevBlock?.content?.[0]?.text) {
                document.removeEventListener('keydown', handler)
                return
              }
            default:
              return
          }
        }

        document.removeEventListener('keydown', handler)
        document.addEventListener('keydown', handler)

        return () => document.removeEventListener('keydown', handler)
      }, [])

      const isBlockActive = block === editor.getTextCursorPosition().block

      return (
        <div className='w-full'>
          <div className='relative flex gap-4 items-start w-full' tabIndex={0}>
            <div
              onClick={() => editor.updateBlock(block, { props: { isDone: !block.props.isDone } })}
            >
              <CustomCheckbox checked={block.props.isDone} />
            </div>
            <div ref={contentRef} className='mt-[2px]' />
            {!(block?.content[0]?.text || block?.content[0]?.href) && isBlockActive ? (
              <div className='absolute left-9 mt-[2px] text-gray-300 flex items-center italic'>
                <div className='cursor' />
                Enter a text or type '@' to mention user
              </div>
            ) : null}
          </div>
          <div className='flex gap-3'>
            <StatusDropdown
              status={status}
              updateStatus={(status) => editor.updateBlock(block, { props: { status } })}
            />
            <PriorityDropdown
              priority={priority}
              updatePriority={(priority) => editor.updateBlock(block, { props: { priority } })}
            />
          </div>
          {!createdBy ? null : (
            <div className='text-12'>
              Created by <span>{createdBy.name}</span>
            </div>
          )}
          <div className='mb-3' />
        </div>
      )
    },
  },
)

export default TaskBlock
