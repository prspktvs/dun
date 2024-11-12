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
import { insertOrUpdateBlock } from '../../../utils/editor'
import ImageBlock from '../Blocks/ImageBlock'
import TaskBlock from '../Blocks/TaskBlock'
import { useMemo } from 'react'

const EXCLUDED_KEYS = ['Check List', 'Image', 'Emoji']

export const customSchema: unknown = {
  ...defaultBlockSchema,
  image: ImageBlock,
  task: TaskBlock,
}

export function CustomSlashMenu(props: SuggestionMenuProps<DefaultReactSuggestionItem>) {
  const groupedTools = useMemo(
    () => Object.groupBy(props.items, ({ group }) => group || 'Other'),
    [props.items],
  )
  const groups = Object.keys(groupedTools)
  const allTools = Object.values(groupedTools).flat()

  const checkSelected = (item: DefaultReactSuggestionItem) => {
    return allTools.indexOf(item) === props.selectedIndex
  }

  return (
    <div className='relative overflow-auto border-1 border-black rounded-[8px] p-1 min-w-60 bg-cloudy'>
      {groups.map((group) => (
        <div className='mb-3'>
          <div className='text-14 font-rubik'>{group}</div>
          {groupedTools[group].map((item) => (
            <div
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

const insertImage = (editor: BlockNoteEditor) => ({
  title: 'Image',
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: 'image',
    })
  },
  aliases: ['image', 'img', 'picture', 'media'],
  group: 'Media',
  icon: <i className='ri-image-add-line' />,
  subtext: 'Insert an image',
})

const insertTask = (editor: BlockNoteEditor) => ({
  title: 'Task',
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: 'task',
    })
  },
  aliases: ['task', '/task'],
  group: 'Tasks',
  icon: <i className='ri-checkbox-line' />,
  subtext: 'Add a task',
})

export const getCustomSlashMenuItems = (editor: BlockNoteEditor): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor).filter(
    (item: DefaultReactSuggestionItem) =>
      !EXCLUDED_KEYS.includes((item as DefaultSuggestionItem).title),
  ),
  insertTask(editor),
  insertImage(editor),
]
