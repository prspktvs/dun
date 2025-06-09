import { BlockNoteEditor } from '@blocknote/core'
import { DefaultReactSuggestionItem } from '@blocknote/react'

import { IUser } from '../../../types'

export const getMentionMenuItems = (
  editor: BlockNoteEditor,
  users: IUser[]
): DefaultReactSuggestionItem[] => {
  if (!users || users.length === 0) {
    return []
  }
  return users.map((user) => ({
    title: user.name,
    onItemClick: () => {
      editor.insertInlineContent([
        {
          type: 'mention',
          props: {
            id: user.id,
            label: user.name
          },
        },
        ' ',
      ])
    },
  }))
}
