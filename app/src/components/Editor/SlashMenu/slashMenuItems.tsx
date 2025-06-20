import {
  BlockNoteEditor,
  BlockSchema,
  defaultBlockSchema,
  DefaultSuggestionItem,
  PartialBlock,
} from '@blocknote/core'
import {
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuProps,
} from '@blocknote/react'
import { useMemo } from 'react'
import { groupBy } from 'lodash'

import { insertOrUpdateBlock } from '../../../utils/editor'
import ImageBlock from '../Blocks/ImageBlock'
import { TaskList } from '../Blocks/TaskList'
import { auth } from '../../../config/firebase'

const EXCLUDED_KEYS = ['Check List']

export const customSchema: unknown = {
  ...defaultBlockSchema,
  image: ImageBlock,
  task: TaskList,
}

export function CustomSlashMenu(props: SuggestionMenuProps<DefaultReactSuggestionItem>) {
  const groupedTools = useMemo(
    () => groupBy(props.items, ({ group }) => group || 'Other'),
    [props.items],
  )
  const groups = Object.keys(groupedTools)
  const allTools = Object.values(groupedTools).flat()

  const checkSelected = (item: DefaultReactSuggestionItem) => {
    return allTools.indexOf(item) === props.selectedIndex
  }

  return (
    <div className='relative overflow-auto border-1 border-black rounded-[8px] p-1 min-w-60 bg-white'>
      {groups.map((group, index) => (
        <div key={`group_menu_${group}_${index}`} className='mb-3'>
          <div className='text-14 font-rubik'>{group}</div>
          {groupedTools[group].map((item, index) => (
            <div
              key={`group_menu_item_${item.title}_${index}`}
              className={`block w-full text-16 text-left font-rubik pl-3 ${
                checkSelected(item)
                  ? 'text-black font-semibold border-1 border-black rounded-md'
                  : 'border-none'
              }`}
              onClick={() => {
                props.onItemClick?.(item)
              }}
            >
              <div>{item.title}</div>
              <div className='text-10 font-normal'>{item.subtext}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const insertTask = (editor: BlockNoteEditor) => {
  const user = auth.currentUser
  return {
    title: 'Task',
    onItemClick: () => {
      insertOrUpdateBlock(editor, {
        type: 'task',
        props: {
          isDone: false,
          author: user ? user.uid : '',
        },
      })
    },
    aliases: ['task', '/task'],
    group: 'Tasks',
    icon: (
      <div className='bg-[#edebf3] h-[18px] w-[18px] flex items-center justify-center rounded-md'>
        <i className='ri-checkbox-fill' />
      </div>
    ),
    subtext: 'Add a task',
    badge: '⌘-Shift-0',
  }
}

export const getCustomSlashMenuItems = (editor: BlockNoteEditor): DefaultReactSuggestionItem[] => {
  return [
    ...getDefaultReactSlashMenuItems(editor).filter(
      (item: DefaultReactSuggestionItem) =>
        !EXCLUDED_KEYS.includes((item as DefaultSuggestionItem).title),
    ),
    insertTask(editor),
  ]
}
