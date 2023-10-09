import { BlockSchema, defaultProps, PartialBlock, PropSchema } from '@blocknote/core'
import { createReactBlockSpec, InlineContent } from '@blocknote/react'
import React, { useEffect, useRef } from 'react'
import { insertOrUpdateBlock } from '../../../../utils/editor'

type Task = {
  isDone: {
    default: boolean
  }
  users: {
    default: { name: string; url: string }[]
  }
}

const CustomCheckbox = ({ checked }: { checked: boolean }) =>
  checked ? (
    <i className='ri-checkbox-line  text-lg' />
  ) : (
    <i className='ri-checkbox-blank-line text-lg' />
  )

const taskSchema: Partial<PropSchema> & Partial<Task> = {
  title: {
    default: '',
  },
  isDone: {
    default: false,
  },
  users: {
    default: [],
  },
}

const TaskBlock = createReactBlockSpec({
  type: 'task',
  propSchema: {
    ...defaultProps,
    ...(taskSchema as PropSchema),
  },
  containsInlineContent: true,
  render: ({ block, editor }) => {
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
      <div className='relative flex gap-4 items-center' tabIndex={0}>
        {/* <input
          type='checkbox'
          checked={block.props.isDone}
          onChange={() => editor.updateBlock(block, { props: { isDone: !block.props.isDone } })}
        /> */}
        <div onClick={() => editor.updateBlock(block, { props: { isDone: !block.props.isDone } })}>
          <CustomCheckbox checked={block.props.isDone} />
        </div>
        <InlineContent as='div' />
        {!block?.content[0]?.text && isBlockActive ? (
          <div className='absolute left-9 text-gray-300 flex items-center italic'>
            Enter a text or type '@' to mention user
          </div>
        ) : null}
      </div>
    )
  },
})

export default TaskBlock
