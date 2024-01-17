import { useState } from 'react'
import { BlockNoteEditor } from '@blocknote/core'
import { EditorContext } from './EditorContext'

const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const [editor, setEditor] = useState<BlockNoteEditor | undefined>(undefined)
  const contextValue: EditorContext = {
    editor,
    setEditor,
  }
  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>
}

export default EditorProvider
