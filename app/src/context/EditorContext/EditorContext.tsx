import { BlockNoteEditor } from '@blocknote/core'
import { createContext, useContext } from 'react'

export type EditorContext = {
  editor: BlockNoteEditor | undefined
  setEditor: (editor: BlockNoteEditor) => void
}

export const EditorContext = createContext<EditorContext | undefined>(undefined)

export const useEditor = (): EditorContext => {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor must be used within a EditorProvider')
  }
  return context
}
