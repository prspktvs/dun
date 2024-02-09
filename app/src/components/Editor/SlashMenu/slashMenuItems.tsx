import { BlockSchema, defaultBlockSchema, PartialBlock } from '@blocknote/core'
import { getDefaultReactSlashMenuItems, ReactSlashMenuItem } from '@blocknote/react'
import { insertOrUpdateBlock } from '../../../utils/editor'
import ImageBlock from '../Blocks/ImageBlock'
import TaskBlock from '../Blocks/TaskBlock'

export const customSchema: BlockSchema = {
  ...defaultBlockSchema,
  image: ImageBlock,
  task: TaskBlock,
}

const insertImage: ReactSlashMenuItem<typeof customSchema> = {
  name: 'Insert Image',
  execute: (editor) => {
    insertOrUpdateBlock(editor, {
      type: 'image',
      props: {
        src: '',
        alt: '',
      },
    })
  },
  aliases: ['image', 'img', 'picture', 'media'],
  group: 'Media',
  icon: <i className='ri-image-add-line' />,
  hint: 'Insert an image',
}

const insertTask: ReactSlashMenuItem<typeof customSchema> = {
  name: 'Task',
  execute: (editor) => {
    insertOrUpdateBlock(editor, {
      type: 'task',
    } as PartialBlock<BlockSchema>)
  },
  aliases: ['task', '/task'],
  group: 'Tasks',
  icon: <i className='ri-checkbox-line' />,
  hint: 'Add a task',
}

export const slashMenuItems = [
  ...getDefaultReactSlashMenuItems(customSchema),
  insertTask,
  insertImage,
]
