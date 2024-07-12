import { useEffect, useState, useRef } from 'react'
import {
  BlockNoteView,
  DragHandle,
  FormattingToolbarPositioner,
  HyperlinkToolbarPositioner,
  SideMenu,
  SideMenuPositioner,
  SlashMenuItem,
  SlashMenuPositioner,
  useBlockNote,
} from '@blocknote/react'
import '@blocknote/core/style.css'
import Mention from '@tiptap/extension-mention'
import suggestion from './Mentions/suggestion'
import { CustomMention } from './Mentions/CustomMention'
import { customSchema, slashMenuItems } from './SlashMenu/slashMenuItems'
import * as Y from 'yjs'
import { debounce } from 'lodash'
import { Block, BlockNoteEditor, PartialBlock } from '@blocknote/core'
import { ICard } from '../../types/Card'
import { IUser } from '../../types/User'
import firebase from 'firebase/compat/app'

import { HocuspocusProvider } from '@hocuspocus/provider'
import { Alert, Loader } from '@mantine/core'
import { useAuth } from '../../context/AuthContext'
import CustomSideMenu from './SideMenu'
import { useChats } from '../../context/ChatContext'
import { useEditor } from '../../context/EditorContext'

const SAVING_DELAY = 2000

interface IEditorProps {
  projectId: string
  card: ICard
  users: IUser[]
}

const BACKEND_URL = process.env.VITE_BACKEND_URL || ''
console.log('BACKEND_URL', BACKEND_URL)

function useWebRtc(
  id: string,
  onStatus: ({ status }: { status: string }) => void,
  onClose: ({ event }: { event: unknown }) => void,
  user: IUser | firebase.User | null,
  users: IUser[],
) {
  // const lastId = useRef<string>(id)
  const [doc, setDoc] = useState<Y.Doc>(new Y.Doc())

  const [provider, setProvider] = useState(
    () =>
      new HocuspocusProvider({
        url: `${BACKEND_URL}/collaboration`,
        name: id,
        document: doc,
        onStatus,
        onClose,
      }),
  )
  console.log('useWebRtc', provider)

  const editor = useBlockNote({
    _tiptapOptions: {
      editable: false,
      extensions: [
        Mention.configure({
          HTMLAttributes: {
            class: 'mention',
          },
          renderText({ options, node }) {
            return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
          },
          suggestion: {
            ...suggestion,
            items: ({ query }) => {
              return (
                users?.filter((user) => user.name.toLowerCase().startsWith(query.toLowerCase())) ||
                []
              )
            },
          },
        }),
      ],
    },
    // onEditorContentChange: (editor) => onDebouncedSave(editor),
    collaboration: provider
      ? {
          provider,
          fragment: doc.getXmlFragment('document-store'),
          user: { name: user.name, color: user.color },
        }
      : undefined,
    blockSchema: customSchema,
    slashMenuItems,
  })

  return { provider, doc, editor }
}

function Editor({ projectId, card, users }: IEditorProps) {
  const [isLoading, setLoading] = useState(true)
  const [editable, setEditable] = useState(false)
  const { user } = useAuth()
  const { chatId } = useChats()
  const { setEditor } = useEditor()
  const { provider, doc, editor } = useWebRtc(
    `${projectId}/cards/${card.id}`,
    ({ status }) => {
      if (status !== 'connected') return
      setEditable(true)
      setLoading(false)
    },
    ({ event }) => {
      setEditable(false)
    },
    user,
    users,
  )

  useEffect(() => {
    setEditor(editor as BlockNoteEditor)
  }, [editor])

  useEffect(() => {
    editor.isEditable = editable
  }, [editable])

  const onDebouncedSave = debounce(async (editor) => {
    console.log('onDebounceSave editor.topLevelBlocks', editor.topLevelBlocks, 'editor', editor)
  }, SAVING_DELAY)

  useEffect(() => {
    return () => onDebouncedSave.cancel()
  }, [onDebouncedSave])

  return isLoading ? (
    <div className='flex justify-center items-center h-full w-full'>
      <Loader />
    </div>
  ) : (
    <>
      {!editable && (
        <Alert variant='light' color='red' title='' icon={<Loader color='red' size={20} />}>
          Loading...
        </Alert>
      )}
      <BlockNoteView editor={editor} theme='light'>
        <FormattingToolbarPositioner editor={editor} />
        <HyperlinkToolbarPositioner editor={editor} />
        <SlashMenuPositioner editor={editor} />
        <SideMenuPositioner editor={editor as BlockNoteEditor} sideMenu={CustomSideMenu} />
      </BlockNoteView>
    </>
  )
}

export default Editor
