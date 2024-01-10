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
import { saveOrCreateCard } from '../../services/cards'
import { debounce } from 'lodash'
import { Block, PartialBlock } from '@blocknote/core'
import { ICard } from '../../types/Card'
import { IUser } from '../../types/User'

import { HocuspocusProvider } from '@hocuspocus/provider'
import { Alert, Loader } from '@mantine/core'
import { useAuth } from '../../context/AuthContext'
import CustomSideMenu from './SideMenu'

const SAVING_DELAY = 2000

interface IEditorProps {
  projectId: string
  card: ICard
  users: IUser[]
}

const HOCUSPOCUS_URL = process.env.VITE_HOCUSPOCUS_URL || ''
console.log('HOCUSPOCUS_URL', HOCUSPOCUS_URL)

function useWebRtc(
  id: string,
  onStatus: ({ status }: { status: string }) => void,
  onClose: ({ event }: { event: unknown }) => void,
) {
  const lastId = useRef<string>(id)
  const [doc, setDoc] = useState<Y.Doc>(new Y.Doc())

  const [provider, setProvider] = useState(
    new HocuspocusProvider({
      url: HOCUSPOCUS_URL,
      name: id,
      document: doc,
      onStatus,
      onClose,
    }),
  )

  useEffect(() => {
    if (lastId.current === id) return
    lastId.current = id
    const doc = new Y.Doc()
    setDoc(doc)
    setProvider(
      new HocuspocusProvider({
        url: HOCUSPOCUS_URL,
        name: id,
        document: doc,
        onStatus,
        onClose,
      }),
    )

    // return () => provider?.destroy()
  }, [id])

  return { provider, doc }
}

function Editor({ projectId, card, users }: IEditorProps) {
  const [isLoading, setLoading] = useState(true)
  const [editable, setEditable] = useState(true)
  const { user } = useAuth()
  const { provider, doc } = useWebRtc(
    `${projectId}/cards/${card.id}`,
    ({ status }) => {
      if (status !== 'connected') return
      setEditable(true)
      setLoading(false)
    },
    ({ event }) => {
      setEditable(false)
    },
  )

  const editor = useBlockNote({
    _tiptapOptions: {
      editable,
      // uploadFile: async (file) => {
      //   // @eugeek @FIXME
      //   console.log(file)
      //   return 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.lotus-qa.com%2Fwp-content%2Fuploads%2F2020%2F02%2Ftesting.jpg&f=1&nofb=1&ipt=6eed9cc4ea6d1214a0e396c2bf5dcec365d76eb74d8a084cb5eabbd84324cf2d&ipo=images'
      // },
      extensions: [
        Mention.configure({
          HTMLAttributes: {
            class: 'mention',
          },
          renderLabel({ options, node }) {
            return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
          },
          suggestion: {
            ...suggestion,
            items: ({ query }) => {
              return users.filter((user) => user.name.toLowerCase().startsWith(query.toLowerCase()))
            },
          },
        }),
      ],
    },
    onEditorContentChange: (editor) => onDebouncedSave(editor),
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

  useEffect(() => {
    editor.isEditable = editable
  }, [editable])

  const onDebouncedSave = debounce(async (editor) => {
    console.log('editor.topLevelBlocks', editor.topLevelBlocks, 'editor', editor)
    // await saveOrCreateCard(projectId, { ...card, content: editor.topLevelBlocks })
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
        <SideMenuPositioner editor={editor} sideMenu={CustomSideMenu} />
      </BlockNoteView>
    </>
  )
}

export default Editor
