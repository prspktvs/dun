import { BlockNoteEditor } from '@blocknote/core'
import { createContext, useContext } from 'react'

import { useState } from 'react'

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const [editor, setEditor] = useState<BlockNoteEditor | undefined>(undefined)
  const contextValue: EditorContext = {
    editor,
    setEditor,
  }
  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>
}

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
