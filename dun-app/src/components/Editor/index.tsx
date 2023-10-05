import { useEffect, useState, useRef } from 'react'
import { BlockNoteView, useBlockNote } from '@blocknote/react'
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

const SAVING_DELAY = 2000

interface IEditorProps {
  projectId: string
  card: ICard
  users: IUser[]
}

const user = JSON.parse(localStorage['user'] || '{"name": "Anon", "color": "#FF0000"}')

function useWebRtc(id: string) {
  const lastId = useRef<string>(id)
  const [doc, setDoc] = useState<Y.Doc>(new Y.Doc())
  const [provider, setProvider] = useState(
    new HocuspocusProvider({
      url: process.env.VITE_HOCUSPOCUS_URL || '',
      name: id,
      document: doc,
    }),
  )

  useEffect(() => {
    if (lastId.current === id) return
    lastId.current = id
    const doc = new Y.Doc()
    setDoc(doc)
    setProvider(
      new HocuspocusProvider({
        url: 'wss://hocuspocus.eugeek.repl.co',
        name: id,
        document: doc,
      }),
    )

    // return () => provider?.destroy()
  }, [id])

  return { provider, doc }
}

function Editor({ projectId, card, users }: IEditorProps) {
  const { provider, doc } = useWebRtc(`${projectId}/cards/${card.id}`)

  const editor = useBlockNote({
    // initialContent: card?.content,
    _tiptapOptions: {
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

  const onDebouncedSave = debounce(async (editor) => {
    console.log('editor.topLevelBlocks', editor.topLevelBlocks, 'editor', editor)
    // await saveOrCreateCard(projectId, { ...card, content: editor.topLevelBlocks })
  }, SAVING_DELAY)

  useEffect(() => {
    return () => onDebouncedSave.cancel()
  }, [onDebouncedSave])

  return <BlockNoteView editor={editor} theme='light' />
}

export default Editor
